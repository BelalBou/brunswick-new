import IMenu from "./IMenu";
import IExtra from "./IExtra";

export default interface ICart {
  menu: IMenu;
  quantity: number;
  remark: string;
  extras: IExtra[];
}
