"use client";

import confetti from "canvas-confetti";

export function triggerConfetti() {
  try {
    // Elegant small burst for micro-feedback
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#6366f1", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"],
      disableForReducedMotion: true,
    });
  } catch {
    // Fail silently if canvas isn't available
  }
}

export function triggerCelebration() {
  try {
    // Larger dual-cannon celebration for major completions (e.g. batch download, PDF conversion)
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ["#6366f1", "#8b5cf6", "#ec4899", "#3b82f6", "#10b981"],
      disableForReducedMotion: true,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  } catch {
    // Fail silently
  }
}
