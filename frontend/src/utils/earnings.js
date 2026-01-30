/**
 * Calculate earnings using the formula
 * @param {number} avgViews - Average views per video
 * @param {number} cpm - Cost per mille (CPM)
 * @param {number} platformFactor - Platform factor multiplier
 * @returns {number} Estimated earnings per video
 */
export const calculateEarning = (avgViews, cpm, platformFactor) => {
  return (avgViews / 1000) * cpm * platformFactor;
};

