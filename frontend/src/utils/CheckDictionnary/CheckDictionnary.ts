// ./utils/CheckDictionnary/CheckDictionnary.ts

interface IDictionaryItem {
    tag: string;
    // On suppose qu'il y a des champs "translation_fr", "translation_en", etc.
    // Pour les langues dynamiques, on peut laisser un index signature :
    [key: string]: string; 
  }
  
  /**
   * Retourne la traduction pour un "tag" donné, en fonction de la liste de dictionnaires
   * et de la "languageName" (fr, en, etc.). Si aucune correspondance n'est trouvée,
   * on renvoie "tag" tel quel.
   */
  export function checkDictionnary(
    tag: string,
    dictionnaryList: IDictionaryItem[],
    languageName: string
  ): string {
    if (!dictionnaryList || dictionnaryList.length === 0) {
      return tag;
    }
  
    // Cherche l'élément dont le "tag" correspond
    const foundItem = dictionnaryList.find((x) => x.tag === tag);
    if (!foundItem) {
      return tag;
    }
  
    // On compose la clé, par exemple "translation_fr" ou "translation_en"
    const translationKey = `translation_${languageName}`;
    
    // Si la clé existe, on la retourne, sinon "tag"
    return foundItem[translationKey] ?? tag;
  }
  
  // Export par défaut si vous le souhaitez
  export default checkDictionnary;
  