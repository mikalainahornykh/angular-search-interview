import { handleApiRequest } from './mock-server/api.mjs';

/**
 * Dev-server config: every /api/* request is answered by the fake backend
 * right inside `ng serve`. Infrastructure code, not part of the task.
 */
export default {
  '/api': {
    // Never reached: the fake backend answers in `bypass` before any proxying happens.
    target: 'http://localhost:9',
    bypass: async (req, res) => {
      await handleApiRequest(req, res);
      // Response already sent -> a string tells the dev server "handled, do not proxy".
      // Client aborted -> false just closes the (already closed) response.
      return res.writableEnded ? req.url : false;
    },
  },
};
