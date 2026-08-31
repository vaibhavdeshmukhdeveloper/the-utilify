import { toast } from "sonner";
import { triggerConfetti } from "./confetti";

/**
 * Copies the current tool state as a shareable deep link URL to clipboard,
 * updates the browser URL without reload, and triggers celebratory confetti.
 */
export function copyShareUrl(
  params: Record<string, string | number | boolean | undefined | null>,
  toolName = "Calculation"
) {
  if (typeof window === "undefined") return;

  try {
    const url = new URL(window.location.origin + window.location.pathname);
    
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        url.searchParams.set(key, String(val));
      }
    });

    navigator.clipboard.writeText(url.toString()).then(() => {
      window.history.replaceState({}, "", url.toString());
      triggerConfetti();
      toast.success(`Shareable ${toolName} link copied to clipboard!`);
    }).catch(() => {
      window.history.replaceState({}, "", url.toString());
      toast.info(`URL updated with parameters.`);
    });
  } catch (err) {
    console.error("Error generating share link:", err);
  }
}
