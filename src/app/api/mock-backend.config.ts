/**
 * Fake backend settings. The candidate does not need to change them;
 * the interviewer may tweak them during the interview.
 */
export const MOCK_BACKEND = {
  /**
   * Response delay depends on query length: the SHORTER the query, the LONGER the response.
   * This makes the race reproducible: "an" arrives later than "anna".
   */
  maxDelayMs: 1800,
  minDelayMs: 250,
  delayStepPerCharMs: 350,
  jitterMs: 300,

  /** Probability of a random 500 error for a non-empty query (0..1). */
  randomErrorRate: 0.15,

  /** A query containing this word always fails. Handy for demos. */
  forceErrorKeyword: 'error',
};
