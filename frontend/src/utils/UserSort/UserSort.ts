// ./utils/UserSort/UserSort.ts
import IOrder from "../../interfaces/IOrder";

/**
 * Trie deux commandes (IOrder) selon le `last_name` de l'utilisateur associé,
 * et si égalité, selon le `first_name`.
 */
export function userSort(a: IOrder, b: IOrder): number {
  // Compare sur last_name d'abord
  const lastNameA = a.User.last_name.toLowerCase();
  const lastNameB = b.User.last_name.toLowerCase();
  const primaryCompare = lastNameA.localeCompare(lastNameB);

  // Si c'est égal, compare sur first_name
  if (primaryCompare === 0) {
    const firstNameA = a.User.first_name.toLowerCase();
    const firstNameB = b.User.first_name.toLowerCase();
    return firstNameA.localeCompare(firstNameB);
  }

  return primaryCompare;
}

// Vous pouvez l'exporter par défaut si vous préférez :
export default userSort;
