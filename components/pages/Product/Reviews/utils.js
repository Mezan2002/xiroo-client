// ── Distribute reviews into 3 columns for masonry effect ──
// Uses a "shortest column first" algorithm for natural height distribution
export function buildMasonryColumns(reviews) {
  const cols = [[], [], []];
  const heights = [0, 0, 0];

  reviews.forEach((review) => {
    // Estimate card height: photo cards are taller
    const hasPhotos = review.images?.length > 0 || review.image;
    const estimated = hasPhotos ? 380 : 260;
    const shortestCol = heights.indexOf(Math.min(...heights));
    cols[shortestCol].push(review);
    heights[shortestCol] += estimated;
  });

  return cols;
}
