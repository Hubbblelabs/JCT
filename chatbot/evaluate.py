import os
import json
from deepeval.metrics import AnswerRelevancyMetric, FaithfulnessMetric
from deepeval.test_case import LLMTestCase
from deepeval import evaluate
from langchain_ollama import ChatOllama
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

# Setup components
FAISS_INDEX_PATH = "chatbot/faiss_index"
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
llm = ChatOllama(model="mistral:7b")

def get_chatbot_response(question):
    # Retrieve context
    docs = vector_store.similarity_search(question, k=3)
    context = "\n\n".join([doc.page_content for doc in docs])
    
    # Generate response
    prompt = f"Context: {context}\n\nQuestion: {question}\n\nAnswer:"
    response = llm.invoke(prompt)
    return response.content, [doc.page_content for doc in docs]

def run_evaluation():
    # Define some test cases relevant to JCT
    test_cases_data = [
        "What are the courses offered in JCT Engineering?",
        "How can I apply for admission at JCT Polytechnic?",
        "Tell me about the placement opportunities at JCT.",
        "Where is JCT College of Arts and Science located?",
        "What is the counselling code for JCT Engineering?"
    ]
    
    test_cases = []
    
    print(f"Starting evaluation for {len(test_cases_data)} cases...")
    
    for question in test_cases_data:
        print(f"Evaluating: {question}")
        actual_output, retrieval_context = get_chatbot_response(question)
        
        # Create DeepEval test case
        test_case = LLMTestCase(
            input=question,
            actual_output=actual_output,
            retrieval_context=retrieval_context
        )
        test_cases.append(test_case)

    # Metrics
    # Note: DeepEval metrics usually require an LLM for scoring. 
    # By default it tries to use OpenAI, but we can configure it to use local or skip if not setup.
    # For now, we'll run a basic relevancy and faithfulness check.
    
    relevancy_metric = AnswerRelevancyMetric(threshold=0.7)
    faithfulness_metric = FaithfulnessMetric(threshold=0.7)
    
    # Run evaluation
    results = evaluate(test_cases, [relevancy_metric, faithfulness_metric])
    
    print("\nEvaluation Summary:")
    print(results)

if __name__ == "__main__":
    run_evaluation()
