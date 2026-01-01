// SDG weight configuration (can be adjusted by admins)
const sdgWeights = {
  1: 10,  // No Poverty
  2: 10,  // Zero Hunger
  3: 9,   // Good Health
  4: 9,   // Quality Education
  5: 8,   // Gender Equality
  6: 9,   // Clean Water
  7: 10,  // Clean Energy
  8: 8,   // Economic Growth
  9: 8,   // Innovation
  10: 8,  // Reduced Inequalities
  11: 9,  // Sustainable Cities
  12: 10, // Responsible Consumption
  13: 10, // Climate Action
  14: 9,  // Life Below Water
  15: 9,  // Life on Land
  16: 8,  // Peace & Justice
  17: 7   // Partnerships
};

// Calculate impact score based on SDG, confidence, and engagement
export const calculateImpactScore = (sdgTag, confidence, voteCount = 0) => {
  if (!sdgTag || sdgTag < 1 || sdgTag > 17) {
    return 0;
  }

  const baseWeight = sdgWeights[sdgTag] || 8;
  const confidenceBonus = confidence * 20; // 0-20 points
  const engagementBonus = Math.min(voteCount * 2, 30); // Max 30 points from votes
  
  const totalScore = baseWeight + confidenceBonus + engagementBonus;
  
  // Cap at 100
  return Math.min(Math.round(totalScore), 100);
};

// Update user's total green karma
export const updateUserKarma = async (userId, pointsToAdd) => {
  try {
    const User = (await import('../models/User.js')).default;
    await User.findByIdAndUpdate(userId, {
      $inc: { green_karma: pointsToAdd }
    });
    return true;
  } catch (error) {
    console.error('Error updating user karma:', error);
    return false;
  }
};

// Get SDG weights (for admin configuration)
export const getSDGWeights = () => {
  return sdgWeights;
};

// Update SDG weights (admin only)
export const updateSDGWeights = (newWeights) => {
  Object.assign(sdgWeights, newWeights);
  return sdgWeights;
};
