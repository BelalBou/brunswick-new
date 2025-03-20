import moment from "moment";

export default interface ISupplier {
  id: number;
  name: string;
  email_address: string;
  email_address2: string;
  email_address3: string;
  for_vendor_only: boolean;
  away_start: moment.Moment,
  away_end: moment.Moment
}
