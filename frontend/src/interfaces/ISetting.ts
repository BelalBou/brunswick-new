export default interface ISetting {
  id: number;
  time_limit: string;  // Format HH:mm:ss
  start_period: number;  // 0-6 (Lundi-Dimanche)
  end_period: number;  // 0-6 (Lundi-Dimanche)
  email_order_cc: string;
  email_supplier_cc: string;
  email_vendor_cc: string;
}
