export interface ToolRatingInfo {
  ratingValue: number;
  reviewCount: number;
  ratings?: { [star: number]: number };
}

// Client helper to fetch live genuine ratings
export async function fetchLiveRating(slug: string): Promise<ToolRatingInfo> {
  const normalizedSlug = slug.replace(/^\//, "").split("?")[0];
  try {
    const res = await fetch(`/api/ratings?tool=${normalizedSlug}`, {
      method: "GET",
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return {
        ratingValue: data.ratingValue || 0,
        reviewCount: data.reviewCount || 0,
        ratings: data.ratings,
      };
    }
  } catch (e) {
    console.error("Failed to fetch live rating:", e);
  }
  return { ratingValue: 0, reviewCount: 0 };
}

// Client helper to submit a genuine rating
export async function submitLiveRating(slug: string, rating: number): Promise<ToolRatingInfo | null> {
  const normalizedSlug = slug.replace(/^\//, "").split("?")[0];
  try {
    const res = await fetch("/api/ratings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tool: normalizedSlug,
        rating,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        ratingValue: data.ratingValue,
        reviewCount: data.reviewCount,
        ratings: data.ratings,
      };
    }
  } catch (e) {
    console.error("Failed to submit rating:", e);
  }
  return null;
}
