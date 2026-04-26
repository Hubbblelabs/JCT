import os
import json
from pathlib import Path
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# Load environment variables
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Configuration from .env
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR.parent / "data"
OUTPUT_FILE = BASE_DIR / os.getenv("PROCESSED_DATA_PATH", "processed_data.json")
FAISS_INDEX_PATH = BASE_DIR / os.getenv("FAISS_INDEX_PATH", "faiss_index")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")

# Set HF_TOKEN for authentication
if os.getenv("HF_TOKEN"):
    os.environ["HF_TOKEN"] = os.getenv("HF_TOKEN")

def load_data():
    documents = []
    colleges = ["engineering", "polytechnic", "arts_science"]
    
    for college in colleges:
        pages_dir = DATA_DIR / college / "pages"
        if not pages_dir.exists():
            continue
            
        for filename in os.listdir(pages_dir):
            if filename.endswith(".json"):
                file_path = pages_dir / filename
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        
                        text_parts = []
                        text_parts.append(f"Title: {data.get('title', '')}")
                        
                        headings = data.get('headings', {})
                        for h_level, h_texts in headings.items():
                            if h_texts:
                                text_parts.append(f"{h_level.upper()}: {' '.join(h_texts)}")
                        
                        if data.get('paragraphs'):
                            text_parts.append("\n".join(data['paragraphs']))
                            
                        if data.get('lists'):
                            for lst in data['lists']:
                                text_parts.append("- " + "\n- ".join(lst))
                                
                        if data.get('tables'):
                            for table in data['tables']:
                                for row in table:
                                    text_parts.append(" | ".join(row))
                                    
                        full_text = "\n\n".join(text_parts)
                        
                        documents.append({
                            "content": full_text,
                            "metadata": {
                                "url": data.get("url"),
                                "college": college,
                                "title": data.get("title"),
                                "source": filename
                            }
                        })
                except Exception as e:
                    print(f"Skipping {filename}: {e}")
    return documents

def preprocess():
    print(f"Loading data from {DATA_DIR}...")
    docs = load_data()
    print(f"Loaded {len(docs)} documents.")
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        separators=["\n\n", "\n", " ", ""]
    )
    
    processed_chunks = []
    print("Chunking documents...")
    for doc in docs:
        chunks = splitter.split_text(doc["content"])
        for chunk in chunks:
            processed_chunks.append({
                "content": chunk,
                "metadata": doc["metadata"]
            })
            
    print(f"Created {len(processed_chunks)} chunks.")
    
    # Save processed JSON
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(processed_chunks, f, indent=2)
    print(f"Saved processed JSON to {OUTPUT_FILE}")
    
    # Create FAISS vector store
    print(f"Initializing embedding model ({EMBEDDING_MODEL})...")
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    
    texts = [chunk["content"] for chunk in processed_chunks]
    metadatas = [chunk["metadata"] for chunk in processed_chunks]
    
    print(f"Creating FAISS index for {len(texts)} chunks...")
    vector_store = FAISS.from_texts(texts, embeddings, metadatas=metadatas)
    
    print(f"Saving FAISS index to {FAISS_INDEX_PATH}...")
    vector_store.save_local(str(FAISS_INDEX_PATH))
    print("Vector store saved successfully.")

if __name__ == "__main__":
    preprocess()
