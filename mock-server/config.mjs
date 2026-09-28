/**
 * Fake backend settings. The candidate does not need to change them;
 * the interviewer may tweak them during the interview (restart `npm start` afterwards).
 */
export const MOCK_BACKEND = {
  search: {
    /** Response delay range for GET /api/users. */
    minDelayMs: 400,
    maxDelayMs: 900,
    /** Probability of a random 500 error for a non-empty query (0..1). */
    randomErrorRate: 0.15,
    /** A query containing this word always fails. Handy for demos. */
    forceErrorKeyword: 'error',
  },

  favorites: {
    /** Users that are favorites when the server starts. */
    initial: [1, 5, 12],
    /**
     * PUT /api/users/:id/favorite applies the value when it RESPONDS.
     * Setting `true` is slow and `false` is fast, so a quick double click
     * makes the responses arrive in reverse order.
     */
    setTrueDelayMs: 1500,
    setFalseDelayMs: 300,
    /** Adding this user to favorites always fails with 500 (removing works). */
    cannotBeFavoriteUserId: 8, // Boris Petrov
  },
};
