/**
 * Centrální logger pro snazší debugging AI do budoucna.
 * Veškeré chytané chyby by měly jít primárně přes něj.
 */
export const logger = {
  error: (context: string, error: unknown) => {
    console.error(`[ERROR - ${context}]`, error);
    // V budoucnu můžeme ukládat logy do db nebo localStorage pro in-game debug konzoli
  },
  warn: (context: string, message: string) => {
    console.warn(`[WARN - ${context}]`, message);
  },
  info: (context: string, message: string) => {
    console.info(`[INFO - ${context}]`, message);
  }
};
