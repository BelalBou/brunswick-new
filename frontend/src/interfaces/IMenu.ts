import IAllergy from "./IAllergy";
import ICategory from "./ICategory";
import IMenuSize from "./IMenuSize";
import IOrderMenu from "./IOrderMenu";
import IExtra from "./IExtra";
import ISupplier from "./ISupplier";

export default interface IMenu {
  id: number;
  title: string;
  title_en: string;
  pricing: string;
  description: string;
  description_en: string;
  order_menus: IOrderMenu;
  category_id: number;
  menu_size_id: number;
  picture: string;
  Allergy: IAllergy[];
  Extra: IExtra[];
  Category: ICategory;
  MenuSize: IMenuSize;
  Supplier: ISupplier;
}
