// ./utils/MenuSort2/MenuSort2.ts
import ICart from "../../interfaces/ICart";

/**
 * Trie deux objets `ICart` selon le titre du menu.
 */
export function menuSort2(a: ICart, b: ICart): number {
  const titleA = a.menu.title.toLowerCase();
  const titleB = b.menu.title.toLowerCase();
  return titleA.localeCompare(titleB);
}

// Export par défaut si vous préférez
export default menuSort2;
