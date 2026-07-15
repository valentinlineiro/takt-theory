import { performAdversarySearch } from './search.js';
import type { SearchResult } from './search.js';

export function runBatch016(): SearchResult[] {
  return performAdversarySearch();
}
