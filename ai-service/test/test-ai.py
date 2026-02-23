from transformers import pipeline
from typing import Tuple
import time

# 1. Initialize the pipeline
print("Loading model... (This may take a while on the first run)")
start_time = time.time()
try:
    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
    print(f"Model loaded successfully in {time.time() - start_time:.2f} seconds.")
except Exception as e:
    print(f"Error loading model: {e}")
    print("Tip: Run 'pip install transformers torch' if you haven't yet.")
    exit()

SDG_LABELS = [
    "No Poverty", "Zero Hunger", "Good Health and Well-being", 
    "Quality Education", "Gender Equality", "Clean Water and Sanitation", 
    "Affordable and Clean Energy", "Decent Work and Economic Growth", 
    "Industry, Innovation and Infrastructure", "Reduced Inequalities", 
    "Sustainable Cities and Communities", "Responsible Consumption and Production", 
    "Climate Action", "Life Below Water", "Life on Land", 
    "Peace, Justice and Strong Institutions", "Partnerships for the Goals"
]

def classify_sdg(title: str, content: str) -> Tuple[int, float]:
    text = f"{title}: {content}"
    result = classifier(text, candidate_labels=SDG_LABELS)
    top_label = result['labels'][0]
    confidence = result['scores'][0]
    sdg_tag = SDG_LABELS.index(top_label) + 1
    return sdg_tag, round(float(confidence), 2)

def calculate_impact_score(sdg_tag: int, confidence: float) -> int:
    weights = {1: 90, 2: 90, 7: 95, 12: 95, 13: 100, 14: 85, 15: 85 }
    base = weights.get(sdg_tag, 80)
    final_score = int(base * confidence)
    return min(max(final_score, 10), 100)

# 2. Run a Test Case
if __name__ == "__main__":
    test_title = "Solar Panel Project"
    test_content = "We installed 10 new solar panels on the community center roof to reduce electricity costs."
    
    print(f"\nTesting with: '{test_title}'")
    tag, conf = classify_sdg(test_title, test_content)
    score = calculate_impact_score(tag, conf)
    
    print(f"--- RESULTS ---")
    print(f"Assigned SDG: {tag} ({SDG_LABELS[tag-1]})")
    print(f"Confidence:   {conf}")
    print(f"Impact Score: {score}")