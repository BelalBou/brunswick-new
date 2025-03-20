import IMenuSize from "./IMenuSize";

export default interface IExtra {
  id: number;
  title: string;
  title_en: string;
  pricing: string;
  supplier_id: number;
  menu_size_id: number;
  MenuSize: IMenuSize;
}
