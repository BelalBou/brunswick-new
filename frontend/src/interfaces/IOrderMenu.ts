export default interface IOrderMenu {
  id: number;
  order_id: number;
  quantity: number;
  pricing: string;
  article_not_retrieved: boolean;
  remark: string;
}
