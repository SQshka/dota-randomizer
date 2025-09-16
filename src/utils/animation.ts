// src/utils/animation.ts

/**
 * Easing function used across roll animations.
 * Produces a smooth deceleration toward the end of the animation.
 */
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/** Clamp a value to the [0, 1] range. */
export const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));

/** Compute normalized progress based on a start time and total duration. */
export const computeProgress = (startTime: number, totalDurationMs: number): number => {
  const elapsed = performance.now() - startTime;
  return clamp01(elapsed / totalDurationMs);
};

/** Compute an eased delay value between min and max based on progress. */
export const getEasedDelay = (
  minDelayMs: number,
  maxDelayMs: number,
  progress: number,
  factor: number = 1
): number => minDelayMs + (maxDelayMs - minDelayMs) * easeOutCubic(progress) * factor;

/** Base speed heuristic used by progressive reveal/hide animations. */
export const computeBaseSpeed = (totalDurationMs: number): number => Math.max(200, totalDurationMs / 20);

/** Upper bound of delay for directional rolls, dependent on duration. */
export const maxDelayFromDuration = (totalDurationMs: number): number => {
  const durationSeconds = totalDurationMs / 1000;
  return Math.min(800, 50 + durationSeconds * 200);
};

/** Derive a simple step delay from total duration (≈250ms at 10s), clamped. */
export const delayFromDuration = (totalDurationMs: number): number => {
  const base = Math.floor(totalDurationMs / 40);
  return Math.max(150, Math.min(400, base));
};

// Common delays
export const DEFAULT_MIN_DELAY = 50;
export const ORIGINAL_MIN_DELAY = 60;
export const ORIGINAL_MAX_DELAY = 350;
