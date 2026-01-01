import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Classify post content into SDG
export const classifyPost = async (title, content, imageUrl = null) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/api/classify`, {
      title,
      content,
      image_url: imageUrl
    }, {
      timeout: 5000 // 5 second timeout
    });

    return {
      success: true,
      sdg_tag: response.data.sdg_tag,
      confidence: response.data.confidence,
      impact_score: response.data.impact_score
    };
  } catch (error) {
    console.error('AI Service Error:', error.message);
    
    // If AI service is down, return default values
    return {
      success: false,
      sdg_tag: null,
      confidence: 0,
      impact_score: 0,
      error: 'AI service unavailable'
    };
  }
};

// Check AI service health
export const checkAIHealth = async () => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, {
      timeout: 3000
    });
    return { healthy: true, data: response.data };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
};
