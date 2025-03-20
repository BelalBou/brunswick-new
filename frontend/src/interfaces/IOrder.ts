import IUser from "./IUser";
import IMenu from "./IMenu";

export default interface IOrder {
  id: number;
  date: string;
  User: IUser;
  Menu: IMenu[];
}
