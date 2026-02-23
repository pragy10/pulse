import axios from 'axios';

// .trim() removes any invisible Windows \r characters from the .env file
const AI_SERVICE_URL = (process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000').trim();

// Classify post content into SDG
export const classifyPost = async (title, content, imageUrl = null) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/api/classify`, {
      title,
      content,
      image_url: imageUrl
    }, {
      timeout: 30000 
    });

    return {
      success: true,
      sdg_tag: response.data.sdg_tag,
      confidence: response.data.confidence,
      impact_score: response.data.impact_score
    };
  } catch (error) {
    // Enhanced error logging to catch the exact issue
    console.error('\n--- AI Service Communication Error ---');
    console.error('URL Attempted:', `${AI_SERVICE_URL}/api/classify`);
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    if (error.response) {
      console.error('Python Server Response:', error.response.data);
    }
    console.error('--------------------------------------\n');
    
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