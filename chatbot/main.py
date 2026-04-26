from fastapi import FastAPI, Query, Body, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
import os
import json
import asyncio
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from dotenv import load_dotenv

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

# Load environment variables
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

if os.getenv("HF_TOKEN"):
    os.environ["HF_TOKEN"] = os.getenv("HF_TOKEN")

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR.parent / "data"
FAISS_INDEX_PATH = BASE_DIR / os.getenv("FAISS_INDEX_PATH", "faiss_index")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "mistral:7b")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")

# Email Config
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "winterbear070106@gmail.com")
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

app = FastAPI(title="JCT Chatbot API - Juggernaut Pro")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve Data folder for images
if DATA_DIR.exists():
    app.mount("/data", StaticFiles(directory=str(DATA_DIR)), name="data")

# ---------------------------------------------------------------------------
# Conversational / small-talk detector
# Bypass RAG entirely — greetings have no useful vector match in the KB.
# ---------------------------------------------------------------------------
CONVERSATIONAL_RE = re.compile(
    r"^\s*("
    r"hi+[!?.]?|hello+[!?.]?|hey+[!?.]?|howdy[!?.]?|greetings[!?.]?|"
    r"good\s*(morning|afternoon|evening|night)[!?.]?|"
    r"what'?s?\s*up[!?.]?|how\s*are\s*you[!?.]?|how\s*r\s*u[!?.]?|"
    r"thanks?[!?.]?|thank\s*you[!?.]?|ty[!?.]?|thx[!?.]?|"
    r"okay+[!?.]?|ok+[!?.]?|sure[!?.]?|got\s*it[!?.]?|alright[!?.]?|"
    r"cool[!?.]?|nice[!?.]?|great[!?.]?|awesome[!?.]?|wow[!?.]?|"
    r"bye+[!?.]?|goodbye+[!?.]?|see\s*you[!?.]?|later[!?.]?|take\s*care[!?.]?|"
    r"who\s*are\s*you[!?.]?|what\s+(are|is)\s+(you|your\s*name)[!?.]?|"
    r"what\s*can\s*you\s*do[!?.]?|help\s*me[!?.]?|i\s*need\s*help[!?.]?"
    r")\s*$",
    re.IGNORECASE,
)

CONVERSATIONAL_SYSTEM = (
    "You are Juggernaut, the official AI assistant of JCT Institutions. "
    "Respond naturally and warmly in 1-2 sentences. "
    "For hi/hello: greet back and offer help with JCT topics (courses, admissions, placements, campus). "
    "If asked who you are: say you are Juggernaut, JCT's AI assistant. "
    "Do NOT add contact numbers or suggestion tags."
)

# ---------------------------------------------------------------------------
# Topic-based source filtering
# Rather than asking the LLM to judge relevance (unreliable for 7B models),
# we detect intent from keywords and filter FAISS results by source filename.
# ---------------------------------------------------------------------------
TOPIC_PATTERNS: dict[str, list[str]] = {
    "about": [
        "about-jct", "vision-mission", "trust-information", "management",
        "administration", "core-values", "governing-council", "planning-monitoring",
        "quality-policy", "timeline", "nirf", "naac", "approval-accreditations",
        "feedback-system", "financial-statements",
    ],
    "placement": [
        "training-placements", "placed-students", "placement-record",
        "placement-process", "placement-brochure", "placement-gallery",
        "corporate-resource-centre", "why-recruit", "tpo-contacts",
        "placement-calendar", "placement-summary", "mou",
    ],
    "courses": [
        "courses", "ug-courses", "pg-courses",
    ],
    "admission": [
        "admission", "scholarship",
    ],
    "facilities": [
        "life-jct", "facilities", "library", "hostel", "sports",
        "anti-ragging", "canteen",
    ],
    "research": [
        "research",
    ],
    "contact": [
        "contact-us", "tpo-contacts", "quick-links",
    ],
}

# Keyword → topic mapping (order matters — more specific first)
TOPIC_KEYWORDS: list[tuple[str, list[str]]] = [
    ("placement", ["placement", "placed", "recruit", "package", "salary",
                   "lpa", "hired", "company", "companies", "job", "offer letter",
                   "campus drive", "corporate"]),
    ("courses",   ["course", "program", "department", "degree", "b.e", "b.tech",
                   "m.e", "m.tech", "bsc", "b.sc", "b.com", "diploma", "ug ", "pg ",
                   "undergraduate", "postgraduate", "engineering branch", "stream",
                   "syllabus", "curriculum", "subjects"]),
    ("admission", ["admission", "apply", "fee ", "fees", "how to join",
                   "eligibility", "scholarship", "application", "cutoff",
                   "merit", "counselling"]),
    ("facilities",["hostel", "facilities", "canteen", "sports", "library",
                   "campus", "amenities", "infrastructure", "transport", "bus",
                   "gym", "lab", "laboratory"]),
    ("research",  ["research", "publication", "journal", "phd", "paper"]),
    ("contact",   ["contact", "phone", "address", "email", "reach", "location",
                   "how to contact"]),
    ("about",     ["about", "history", "vision", "mission", "trust", "management",
                   "founded", "established", "overview", "who is", "tell me about jct",
                   "about jct", "jct institution", "governing", "accreditation",
                   "naac", "nirf", "quality policy", "core value"]),
]

def detect_topic(query: str) -> str | None:
    q = query.lower()
    for topic, keywords in TOPIC_KEYWORDS:
        if any(kw in q for kw in keywords):
            return topic
    return None

# College → source filename fragment mapping
COLLEGE_SOURCE_FILTERS: dict[str, list[str]] = {
    "engineering": ["engineering"],
    "arts":        ["cas.json"],
    "polytechnic": ["polytechnic.json"],
}

COLLEGE_LABELS: dict[str, str] = {
    "engineering": "JCT College of Engineering and Technology",
    "arts":        "JCT College of Arts and Science",
    "polytechnic": "JCT Polytechnic College",
    "all":         "JCT Institutions",
}

# Static fact sheet — always used as context when college="all".
# Written as answer-ready prose so the LLM just needs to paraphrase it.
INSTITUTION_OVERVIEW = """JCT Institutions in Coimbatore has three colleges under Shri Jagannath Educational Health and Charitable Trust.

JCT College of Engineering and Technology offers 11 UG programs (B.E/B.Tech): Computer Science & Engineering, Computer Science and Business Systems, Artificial Intelligence and Data Science, Electronics and Communication Engineering, Electrical and Electronics Engineering, Mechanical Engineering, Civil Engineering, Bio-Technology and Bio-Chemical Engineering, Food Technology, Petrochemical Technology, Petroleum Engineering. It also offers 4 PG programs (M.E/M.Tech): Structural Engineering, Power Electronics and Drives, CSE (AI & Machine Learning), Electrical and Electronics Engineering (Doctoral Programme).

JCT College of Arts and Science offers: BCA, B.Sc Computer Science, B.Sc Artificial Intelligence and Machine Learning, B.Com Logistics and Supply Chain Management, BBA Logistics.

JCT Polytechnic College offers Diploma programs in: Electrical and Electronics Engineering, Civil Engineering, Agricultural Engineering, Petrochemical Engineering, Mechanical Engineering.

Contact: +91 93614 22201 | +91 93614 88801

Useful page links:
- Engineering College: [Engineering College](/institutions/engineering)
- Arts & Science College: [Arts & Science](/institutions/arts-science)
- Polytechnic College: [Polytechnic College](/institutions/polytechnic)
- Admissions: [Apply Now](/admissions)
- Placements: [Placement Records](/placements)
- Campus Life: [Campus Life](/campus-life)
- Contact: [Contact Us](/contact)"""

# Per-college static course facts — appended to RAG context (placed last so
# recency-biased models weight it highest) to prevent hallucination.
COLLEGE_STATIC: dict[str, str] = {
    "engineering": (
        "Verified course list for JCT College of Engineering and Technology:\n"
        "UG (B.E/B.Tech, exactly 11 programs): Computer Science & Engineering, "
        "Computer Science and Business Systems, Artificial Intelligence and Data Science, "
        "Electronics and Communication Engineering, Electrical and Electronics Engineering, "
        "Mechanical Engineering, Civil Engineering, Bio-Technology and Bio-Chemical Engineering, "
        "Food Technology, Petrochemical Technology, Petroleum Engineering.\n"
        "PG (M.E/M.Tech, exactly 4 programs): Structural Engineering, Power Electronics and Drives, "
        "CSE (Artificial Intelligence & Machine Learning), Electrical and Electronics Engineering (Doctoral Programme).\n"
        "Only mention courses from this list.\n"
        "Relevant links: [Engineering College](/institutions/engineering) | [Admissions](/admissions) | [Placement Records](/placements)"
    ),
    "arts": (
        "Verified program list for JCT College of Arts and Science (exactly 5 programs):\n"
        "BCA (Bachelor of Computer Applications), B.Sc Computer Science, "
        "B.Sc Artificial Intelligence and Machine Learning, "
        "B.Com Logistics and Supply Chain Management, BBA Logistics.\n"
        "Only mention programs from this list.\n"
        "Relevant links: [Arts & Science College](/institutions/arts-science) | [Admissions](/admissions) | [Placement Records](/placements)"
    ),
    "polytechnic": (
        "COMPLETE and FINAL list of Diploma programs at JCT Polytechnic College — exactly 5, no others:\n"
        "1. Electrical and Electronics Engineering\n"
        "2. Civil Engineering\n"
        "3. Agricultural Engineering\n"
        "4. Petrochemical Engineering\n"
        "5. Mechanical Engineering\n"
        "DO NOT list any other diploma such as Computer Technology. Only these 5 exist.\n"
        "Relevant links: [Polytechnic College](/institutions/polytechnic) | [Admissions](/admissions)"
    ),
}

# ---------------------------------------------------------------------------

vector_store = None
llm = None
rag_chain = None
store = {}

# Preloaded sparse-college docs (populated at startup)
_arts_docs: list = []
_poly_docs: list = []

# ---------------------------------------------------------------------------
# System prompt — intentionally simple so small LLMs follow it reliably.
# Topic filtering is handled in Python; no complex reasoning required here.
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """You are Juggernaut, the friendly AI assistant for JCT Institutions in Coimbatore.

You help with: courses & programs, admissions & eligibility, placements & career, campus life & facilities, research, and contact information.

If asked what you can help with or what you know: briefly list these topics and offer to go deeper on any of them.

FORMATTING RULES:
1. Use bullet points (- item) for any list of 3+ items.
2. Use **bold** for college names, program names, and key facts.
3. Use *italics* for secondary details, years, or emphasis.
4. When the context includes a relevant page link (e.g. [Placement Records](/placements)), include it naturally in your answer.
5. Be warm, friendly, and concise — 2-4 sentences or a focused bullet list.
6. NEVER output website navigation labels like "About the Department", "Vision and Mission", "JOIN ALUMNI", "Quick Links".
7. NEVER invent course names, company names, or placement statistics not found in the context.
8. Do NOT reproduce internal notes or warnings verbatim.
9. ONLY include contact numbers when the user explicitly asks for contact details, phone number, address, or how to reach JCT — NOT on every reply.
10. When contact IS needed, format it exactly as: 📞 **+91 93614 22201** | **+91 93614 88801**
11. If context lacks the answer say: "I don't have that detail right now — you can find it on the [JCT website](/contact) or call 📞 **+91 93614 22201**."
12. STRICT SCOPE: You ONLY answer questions about JCT Institutions. NEVER provide any information about other colleges, universities, or institutions. If asked, respond: "I'm Juggernaut, JCT's AI assistant. I have information only about our JCT colleges."
13. PAGE PATHS: Always use ONLY these exact paths in links — /campus-life (NEVER /life-at-jct or /life-jct), /placements (NEVER /placement-records), /institutions/engineering, /institutions/arts-science, /institutions/polytechnic, /admissions, /contact, /research, /about.

Context:
{context}"""

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"
    college: str = "all"

class LeadRequest(BaseModel):
    name: str
    email: str
    phone: str
    program: str
    course: str

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

@app.on_event("startup")
async def startup_event():
    global vector_store, llm, rag_chain, _arts_docs, _poly_docs
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    if os.path.exists(FAISS_INDEX_PATH):
        vector_store = FAISS.load_local(str(FAISS_INDEX_PATH), embeddings, allow_dangerous_deserialization=True)
        # Pre-extract arts & polytechnic docs (tiny sets — 17 and 19 docs)
        # so we can force their inclusion when college="all".
        all_docs = list(vector_store.docstore._dict.values())
        # Source metadata is stored as filename only (e.g. "cas.json", "polytechnic.json")
        # Use the exact filename as the filter key.
        _arts_docs = [d for d in all_docs if "cas.json" in d.metadata.get("source", "").lower()]
        _poly_docs = [d for d in all_docs if "polytechnic.json" in d.metadata.get("source", "").lower()]
        print(f"[Juggernaut] Preloaded arts={len(_arts_docs)} poly={len(_poly_docs)} docs")

    llm = ChatOllama(model=OLLAMA_MODEL)
    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{question}"),
    ])

    if vector_store:
        from langchain_core.runnables import RunnableLambda

        def format_docs_recent(docs: list) -> str:
            """Sort by most recent year, trim each doc to 400 chars, join."""
            def recency_key(doc):
                years = re.findall(r'\b(202[0-9])\b', doc.page_content)
                return -max(int(y) for y in years) if years else 0
            return "\n\n".join(
                doc.page_content[:400] for doc in sorted(docs, key=recency_key)
            )

        def _keyword_score(doc, query_words: list[str]) -> int:
            text = doc.page_content.lower()
            return sum(w in text for w in query_words)

        def get_context_for_query(query: str, college: str = "all") -> str:
            """
            Balanced retrieval:
            - Single college: similarity search + topic filter scoped to that college.
            - All colleges: engineering similarity + forced inclusion of all arts/poly
              docs sorted by keyword relevance (they're tiny — 17/19 docs each).
            """
            topic = detect_topic(query)
            topic_patterns = TOPIC_PATTERNS.get(topic, []) if topic else []
            q_words = [w for w in query.lower().split() if len(w) > 2]

            def matches_topic(doc: object) -> bool:
                if not topic_patterns:
                    return True
                src = doc.metadata.get("source", "").lower()
                return any(p in src for p in topic_patterns)

            if college != "all":
                # Single-college: similarity search, filter to college + topic.
                # Always prepend the static course facts so the LLM never
                # hallucinates program names from training data.
                col_pats = COLLEGE_SOURCE_FILTERS.get(college, [])
                raw = vector_store.similarity_search(query, k=40)
                col_docs = [d for d in raw if any(p in d.metadata.get("source", "").lower() for p in col_pats)]
                if topic_patterns:
                    topic_col = [d for d in col_docs if matches_topic(d)]
                    if topic_col:
                        print(f"[Juggernaut] college={college} topic={topic} → {len(topic_col)} docs")
                        rag_context = format_docs_recent(topic_col[:5])
                    else:
                        rag_context = format_docs_recent(col_docs[:5]) if col_docs else format_docs_recent(raw[:5])
                else:
                    rag_context = format_docs_recent(col_docs[:5]) if col_docs else format_docs_recent(raw[:5])
                # Prepend static college facts so LLM always has accurate course info
                static = COLLEGE_STATIC.get(college, "")
                return f"{rag_context}\n\n{static}" if static else rag_context

            # college == "all": landing page / institution-level queries.
            # ALWAYS use only the static overview — never mix in FAISS docs.
            # Reason: arts/poly FAISS docs (17/19 chunks) are mostly navigation
            # text that confuses the LLM. The overview has all the needed facts.
            print(f"[Juggernaut] all-colleges → static overview only")
            return INSTITUTION_OVERVIEW

        inner_chain = (
            {
                "context": RunnableLambda(lambda x: get_context_for_query(x["question"], x.get("college", "all"))),
                "question": lambda x: x["question"],
                "history": lambda x: x["history"],
            }
            | prompt
            | llm
            | StrOutputParser()
        )
        rag_chain = RunnableWithMessageHistory(
            inner_chain,
            get_session_history,
            input_messages_key="question",
            history_messages_key="history",
        )
    print("Juggernaut Pro is ready!")

async def send_lead_email(lead: LeadRequest):
    if not SMTP_USER or not SMTP_PASSWORD:
        print("SMTP Credentials not set. Skipping email.")
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_USER
        msg['To'] = ADMIN_EMAIL
        msg['Subject'] = f"New Lead Captured: {lead.name}"

        body = f"""
        New Admission Lead Captured by Juggernaut:
        
        Name: {lead.name}
        Email: {lead.email}
        Phone: {lead.phone}
        Program: {lead.program}
        Course: {lead.course}
        
        ---
        Juggernaut AI Assistant
        """
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"Email sent to {ADMIN_EMAIL}")
    except Exception as e:
        print(f"Failed to send email: {e}")

@app.post("/leads")
async def collect_lead(lead: LeadRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_lead_email, lead)
    return {"status": "success", "message": "Lead captured successfully"}

# Contact intent detector — used to decide whether to keep or strip phone numbers
CONTACT_QUERY_RE = re.compile(
    r"\b(contact|phone|call|reach|number|address|location|email|whatsapp|helpline|hotline|"
    r"admission\s*office|enquiry|enquiries|how\s*to\s*apply|apply\s*now)\b",
    re.IGNORECASE,
)


def strip_phone_lines(text: str) -> str:
    """Remove phone-number lines/patterns the LLM appended contrary to the system prompt."""
    # Remove lines whose primary content is a phone/contact reference
    lines = text.split("\n")
    filtered = []
    for line in lines:
        stripped = line.strip()
        # Match common phone-append patterns
        if re.search(
            r"(📞.*\+91|\+91\s*9\d{4}\s*\d{5}|Contact:\s*\+91)",
            stripped,
        ):
            continue
        filtered.append(line)
    return "\n".join(filtered).rstrip()


# ---------------------------------------------------------------------------
# Other-institution guard
# Hard bypass: refuse queries about non-JCT colleges/universities.
# Exception: allow JCT affiliation questions (e.g. "Is JCT affiliated to Anna University?").
# ---------------------------------------------------------------------------
OTHER_INSTITUTION_RE = re.compile(
    r"\b("
    r"anna\s*university|vit\b|srm\b|sastra\b|bits\b|manipal\b|"
    r"amrita|psg\s*tech|psg\s*college|psg\s*institute|"
    r"kct\b|kumaraguru|karpagam|kongu\s*eng|kongu\s*college|"
    r"coimbatore\s*institute|cit\b|sns\s*college|snsce\b|"
    r"kgisl\b|kpr\s*institute|kpr\s*college|"
    r"bannari\s*amman|rathinam\s*college|nehru\s*college|"
    r"hindusthan|park\s*college|ngp\s*institute|dr\.?\s*ngp|"
    r"karunya|sona\s*college|gct\b|rvs\s*college|"
    r"sri\s*shakthi|avinashilingam|bharathiar\s*university|"
    r"iit\b|nit\b|iim\b|iiser\b|"
    r"other\s*college|another\s*college|different\s*college|"
    r"other\s*university|another\s*university"
    r")\b",
    re.IGNORECASE,
)
_JCT_RE = re.compile(r"\bjct\b", re.IGNORECASE)
_AFFILIATION_RE = re.compile(
    r"\b(affiliated|affiliation|under|approved\s*by|recognized\s*by)\b",
    re.IGNORECASE,
)

# Known wrong page paths the LLM generates → correct Next.js routes
_LINK_FIX_MAP = {
    "/life-at-jct": "/campus-life",
    "/life-jct": "/campus-life",
    "/life_at_jct": "/campus-life",
    "/placement-records": "/placements",
    "/placement-record": "/placements",
    "/placements/records": "/placements",
    "/engineering-college": "/institutions/engineering",
    "/arts-and-science": "/institutions/arts-science",
    "/arts-science-college": "/institutions/arts-science",
    "/polytechnic-college": "/institutions/polytechnic",
}


def fix_links(text: str) -> str:
    """Replace known incorrect page paths the LLM may generate."""
    for wrong, correct in _LINK_FIX_MAP.items():
        text = text.replace(wrong, correct)
    return text


async def generate_chat_stream(message: str, session_id: str, college: str = "all"):
    try:
        # ── Other-institution guard ────────────────────────────────────────
        # Block queries about non-JCT colleges/universities before hitting the LLM.
        # Exception: allow affiliation questions like "Is JCT affiliated to Anna University?".
        if OTHER_INSTITUTION_RE.search(message):
            jct_mentioned = bool(_JCT_RE.search(message))
            if not (jct_mentioned and _AFFILIATION_RE.search(message)):
                yield (
                    "I'm Juggernaut, JCT's AI assistant. "
                    "I have information only about our JCT colleges — "
                    "I'm not set up to answer questions about other institutions.\n\n"
                    "Feel free to ask me anything about **JCT College of Engineering and Technology**, "
                    "**JCT College of Arts and Science**, or **JCT Polytechnic College**!"
                )
                return

        # ── Conversational bypass ──────────────────────────────────────────
        # Simple greetings / small-talk have no meaningful FAISS match, so RAG
        # would inject random documents.  Respond directly with the LLM instead.
        if CONVERSATIONAL_RE.match(message.strip()):
            from langchain_core.messages import SystemMessage, HumanMessage
            label = COLLEGE_LABELS.get(college, "JCT Institutions")
            conv_system = (
                f"You are Juggernaut, the official AI assistant of {label}. "
                "Respond naturally and warmly in 1-2 sentences. "
                "For hi/hello: greet back and offer help with topics like courses, admissions, placements, campus. "
                "If asked who you are: say you are Juggernaut, the AI assistant for this college. "
                "Do NOT add contact numbers or suggestion tags."
            )
            async for chunk in llm.astream([
                SystemMessage(content=conv_system),
                HumanMessage(content=message),
            ]):
                yield chunk.content
            return

        # ── All knowledge queries — routes through rag_chain ─────────────
        # This maintains full conversation history via RunnableWithMessageHistory.
        # college="all"  → context = INSTITUTION_OVERVIEW (injected by get_context_for_query)
        # college=specific → context = RAG docs + COLLEGE_STATIC (appended last)
        #
        # Buffer the full response so we can post-process phone numbers.
        # The LLM (mistral:7b) tends to append contact regardless of the system prompt;
        # we strip those lines unless the user explicitly asked for contact.
        buffer = ""
        async for chunk in rag_chain.astream(
            {"question": message, "college": college},
            config={"configurable": {"session_id": session_id}}
        ):
            buffer += chunk

        if not CONTACT_QUERY_RE.search(message):
            buffer = strip_phone_lines(buffer)

        buffer = fix_links(buffer)
        yield buffer
    except Exception as e:
        yield f"Error: {str(e)}"

@app.post("/chat")
async def chat(request: ChatRequest):
    if not rag_chain:
        raise HTTPException(status_code=503, detail="Chatbot not fully initialized.")
    return StreamingResponse(generate_chat_stream(request.message, request.session_id, request.college), media_type="text/plain")

@app.get("/")
async def root():
    return {"chatbot_name": "Juggernaut", "status": "Ready", "model": OLLAMA_MODEL}
