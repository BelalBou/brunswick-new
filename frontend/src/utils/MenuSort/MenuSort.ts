// ./utils/MenuSort/MenuSort.ts
import IMenu from "../../interfaces/IMenu";

/**
 * Trie deux menus selon :
 *  1. Leur `title` (ordre alphabétique, insensible à la casse)
 *  2. Si les `title` sont identiques et qu'ils possèdent tous deux un `MenuSize`,
 *     on compare `MenuSize.title` (toujours alphabétique, insensible à la casse).
 */
export function menuSort(a: IMenu, b: IMenu): number {
  const titleA = a.title.toLowerCase();
  const titleB = b.title.toLowerCase();

  const primaryCompare = titleA.localeCompare(titleB);

  // Si le titre est identique, on compare par MenuSize (si présent)
  if (primaryCompare === 0 && a.MenuSize && b.MenuSize) {
    const sizeA = a.MenuSize.title.toLowerCase();
    const sizeB = b.MenuSize.title.toLowerCase();
    return sizeA.localeCompare(sizeB);
  }

  return primaryCompare;
}

// Export par défaut si vous le souhaitez
export default menuSort;
