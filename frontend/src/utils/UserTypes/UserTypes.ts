// ./utils/UserTypes/UserTypes.ts

// On définit un type pour un "user type" possible.
interface IUserTypeOption {
    value: string;
    label: string;
  }
  
  /**
   * Liste des différents "types" d'utilisateur,
   * associant une valeur interne et un libellé affichable.
   */
  export const USER_TYPES: IUserTypeOption[] = [
    {
      value: "customer",
      label: "Employé",
    },
    {
      value: "supplier",
      label: "Fournisseur",
    },
    {
      value: "vendor",
      label: "Caissier",
    },
    {
      value: "administrator",
      label: "Administrateur",
    },
  ];
  
  // Si vous souhaitez l'exporter par défaut, vous pouvez faire :
  export default USER_TYPES;
  