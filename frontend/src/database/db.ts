import Dexie, { type Table } from "dexie";

export interface LocalItem {
  item_code: string;
  item_name: string;
  description?: string;
  item_group: string;
  stock_uom: string;
  image?: string;
  has_batch_no?: number;
  has_serial_no?: number;
  is_stock_item?: number;
  taxes?: any[];
}

export interface LocalItemPrice {
  item_code: string;
  price_list: string;
  price_list_rate: number;
  currency: string;
}

export interface LocalCustomer {
  name: string;
  customer_name: string;
  customer_group: string;
  email_id?: string;
  mobile_no?: string;
  territory?: string;
}

export interface OfflineInvoice {
  id?: number;
  local_id: string;
  customer: string;
  items: any[];
  payments: any[];
  taxes: any[];
  grand_total: number;
  rounded_total: number;
  status: "Draft" | "Pending Sync" | "Synced" | "Error";
  error_message?: string;
  created_at: string;
}

export interface AppSetting {
  key: string;
  value: any;
}

export class POSDatabase extends Dexie {
  items!: Table<LocalItem, string>;
  itemPrices!: Table<LocalItemPrice, string>;
  customers!: Table<LocalCustomer, string>;
  invoices!: Table<OfflineInvoice, number>;
  settings!: Table<AppSetting, string>;

  constructor() {
    super("POSPrimeDB");

    // Define schema
    this.version(1).stores({
      items: "item_code, item_group",
      itemPrices: "[item_code+price_list], item_code",
      customers: "name, customer_name, mobile_no",
      invoices: "++id, local_id, status",
      settings: "key",
    });
  }
}

export const db = new POSDatabase();
