// ./utils/AllergySort/AllergySort.ts
import IAllergy from "../../interfaces/IAllergy";

/**
 * Compare deux allergies par ordre alphabétique
 * de leur description (en ignorant la casse).
 */
export function allergySort(a: IAllergy, b: IAllergy): number {
  return a.description.toLowerCase().localeCompare(b.description.toLowerCase());
}
