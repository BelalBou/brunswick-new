// ./utils/DateSort/dateSort.ts

/**
 * On suppose que chaque objet possède un champ `date` 
 * avec une méthode `toDate()` qui renvoie un `Date`.
 * (Cas typique si vous utilisez des timestamps Firestore, moment.js, etc.)
 */
interface HasDate {
    date: {
      toDate(): Date;
    };
  }
  
  /**
   * Compare deux objets en se basant sur `a.date` et `b.date`.
   * Retourne un nombre négatif, nul ou positif suivant leur ordre.
   */
  export function dateSort(a: HasDate, b: HasDate): number {
    // Convertit en nombre de millisecondes
    const timeA = a.date.toDate().getTime();
    const timeB = b.date.toDate().getTime();
    return timeA - timeB;
  }
  
  // Vous pouvez soit l'exporter comme ci-dessus, 
  // soit en faire l'export par défaut :
  export default dateSort;
  