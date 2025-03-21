// ./utils/MenuSort/MenuSort.ts
import IMenu from "../../interfaces/IMenu";

/**
 * Fonction de tri des menus de la plus petite à la plus grande taille.
 * Par convention, lorsque deux menus partagent le même titre (= même produit):
 *     on compare `MenuSize.title` (toujours alphabétique, insensible à la casse).
 * Sinon, on compare la propriété `title` des menus.
 * 
 * @param a Le premier menu à comparer
 * @param b Le second menu à comparer
 */
export default function menuSort(a: IMenu, b: IMenu): number {
  // On vérifie si les menus ont le même titre
  if (a.title.toLowerCase() === b.title.toLowerCase()) {
    // Si oui, on compare par taille
    const sizeA = a.MenuSize?.title?.toLowerCase() || "";
    const sizeB = b.MenuSize?.title?.toLowerCase() || "";
    return sizeA.localeCompare(sizeB);
  }
  
  // Sinon on trie par défaut par titre
  return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
}
