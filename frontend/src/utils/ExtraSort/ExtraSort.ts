// ./utils/ExtraSort/ExtraSort.ts
import IExtra from "../../interfaces/IExtra";

/**
 * Trie deux objets de type IExtra par ordre alphabétique
 * en ignorant la casse de `title`.
 */
export function extraSort(a: IExtra, b: IExtra): number {
  return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
}

// Export par défaut si vous le souhaitez
export default extraSort;
