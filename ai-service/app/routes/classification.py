from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..services.classification_service import classify_sdg, calculate_impact_score

router = APIRouter()

class ClassificationRequest(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None

class ClassificationResponse(BaseModel):
    sdg_tag: int
    confidence: float
    impact_score: int
    message: str

@router.post("/classify", response_model=ClassificationResponse)
async def classify_post(request: ClassificationRequest):
    try:
        # Classify the post into SDG
        sdg_tag, confidence = classify_sdg(request.title, request.content)
        
        # Calculate impact score
        impact_score = calculate_impact_score(sdg_tag, confidence)
        
        return ClassificationResponse(
            sdg_tag=sdg_tag,
            confidence=confidence,
            impact_score=impact_score,
            message="Classification successful"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
