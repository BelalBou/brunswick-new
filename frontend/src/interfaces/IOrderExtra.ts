import IExtra from "./IExtra";

export default interface IOrderExtra {
  order_menu_id: number;
  pricing: string;
  Extra: IExtra;
}
