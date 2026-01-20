import re
from typing import Tuple

# SDG keywords mapping
SDG_KEYWORDS = {
    1: ['poverty', 'poor', 'income', 'economic resources', 'vulnerable'],
    2: ['hunger', 'food', 'nutrition', 'agriculture', 'farming'],
    3: ['health', 'disease', 'medical', 'healthcare', 'wellness', 'fitness'],
    4: ['education', 'learning', 'school', 'student', 'teaching'],
    5: ['gender', 'women', 'girls', 'equality', 'empowerment'],
    6: ['water', 'sanitation', 'hygiene', 'clean water'],
    7: ['energy', 'renewable', 'solar', 'wind', 'electricity', 'power'],
    8: ['employment', 'job', 'work', 'economic growth', 'economy'],
    9: ['infrastructure', 'innovation', 'industry', 'technology'],
    10: ['inequality', 'discrimination', 'inclusion', 'equity'],
    11: ['city', 'urban', 'housing', 'transport', 'sustainable cities'],
    12: ['consumption', 'production', 'waste', 'recycling', 'sustainable'],
    13: ['climate', 'global warming', 'carbon', 'emissions', 'environment'],
    14: ['ocean', 'marine', 'sea', 'fish', 'coastal'],
    15: ['forest', 'land', 'biodiversity', 'wildlife', 'ecosystem'],
    16: ['peace', 'justice', 'institutions', 'governance', 'law'],
    17: ['partnership', 'cooperation', 'global', 'collaboration']
}

def classify_sdg(title: str, content: str) -> Tuple[int, float]:
    """
    Classify text into one of 17 SDG categories using keyword matching.
    Returns: (sdg_tag, confidence)
    """
    text = f"{title} {content}".lower()
    
    # Count keyword matches for each SDG
    scores = {}
    for sdg_num, keywords in SDG_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            # Count occurrences of each keyword
            score += len(re.findall(r'\b' + keyword + r'\b', text))
        scores[sdg_num] = score
    
    # Find SDG with highest score
    if max(scores.values()) == 0:
        # Default to SDG 13 (Climate Action) if no matches
        return 13, 0.5
    
    best_sdg = max(scores, key=scores.get)
    max_score = scores[best_sdg]
    
    # Calculate confidence (normalized)
    total_score = sum(scores.values())
    confidence = min(max_score / (total_score + 1), 0.95)
    
    return best_sdg, round(confidence, 2)

def calculate_impact_score(sdg_tag: int, confidence: float) -> int:
    """
    Calculate impact score based on SDG and confidence.
    Returns: score (0-100)
    """
    # Base scores for each SDG
    base_scores = {
        1: 85, 2: 85, 3: 80, 4: 80, 5: 75,
        6: 80, 7: 90, 8: 75, 9: 75, 10: 75,
        11: 80, 12: 90, 13: 90, 14: 85, 15: 85,
        16: 75, 17: 70
    }
    
    base = base_scores.get(sdg_tag, 70)
    confidence_bonus = int(confidence * 15)
    
    return min(base + confidence_bonus, 100)
