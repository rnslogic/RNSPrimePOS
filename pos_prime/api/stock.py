import frappe
import json
from pos_prime.api._utils import validate_pos_access

@frappe.whitelist()
def get_dashboard_data():
    validate_pos_access()
    company = frappe.defaults.get_user_default("company") or frappe.get_all("Company")[0].name

    total_items = frappe.db.count("Item", {"disabled": 0})
    total_warehouses = frappe.db.count("Warehouse", {"is_group": 0, "company": company})
    
    # Calculate Total Stock Value
    stock_value_result = frappe.db.sql("""
        SELECT sum(stock_value) as total_value
        FROM `tabBin`
        WHERE warehouse IN (SELECT name FROM `tabWarehouse` WHERE company = %s)
    """, (company,), as_dict=True)
    total_stock_value = stock_value_result[0].total_value if stock_value_result and stock_value_result[0].total_value else 0

    return {
        "total_active_items": total_items,
        "total_warehouses": total_warehouses,
        "total_stock_value": total_stock_value
    }

@frappe.whitelist()
def get_recent_receipts(limit=20):
    validate_pos_access()
    limit = int(limit)
    company = frappe.defaults.get_user_default("company") or frappe.get_all("Company")[0].name
    
    stock_entries = frappe.get_all(
        "Stock Entry",
        filters={"stock_entry_type": "Material Receipt", "company": company, "docstatus": 1},
        fields=["name", "posting_date", "posting_time", "total_amount", "docstatus"],
        order_by="creation desc",
        limit_page_length=limit
    )
    for se in stock_entries:
        se["doctype_name"] = "Stock Entry"
        se["supplier"] = None
        
    purchase_receipts = frappe.get_all(
        "Purchase Receipt",
        filters={"company": company, "docstatus": 1},
        fields=["name", "posting_date", "posting_time", "base_grand_total as total_amount", "supplier", "docstatus"],
        order_by="creation desc",
        limit_page_length=limit
    )
    for pr in purchase_receipts:
        pr["doctype_name"] = "Purchase Receipt"
        
    all_receipts = stock_entries + purchase_receipts
    all_receipts.sort(key=lambda x: str(x.posting_date) + " " + str(x.posting_time), reverse=True)
    
    return all_receipts[:limit]

@frappe.whitelist()
def make_stock_receipt(data):
    validate_pos_access()
    if isinstance(data, str):
        data = json.loads(data)
        
    supplier = data.get("supplier")
    target_warehouse = data.get("target_warehouse")
    company = data.get("company") or frappe.defaults.get_user_default("company") or frappe.get_all("Company")[0].name
    items = data.get("items", [])
    
    if not items:
        frappe.throw("No items to receive")
        
    if not target_warehouse:
        frappe.throw("Target Warehouse is required")
        
    if supplier:
        doc = frappe.new_doc("Purchase Receipt")
        doc.supplier = supplier
        doc.company = company
        doc.set_posting_time = 1
        doc.posting_date = frappe.utils.nowdate()
        doc.posting_time = frappe.utils.nowtime()
        
        for item in items:
            doc.append("items", {
                "item_code": item.get("item_code"),
                "qty": item.get("qty"),
                "rate": item.get("rate") or 0,
                "warehouse": target_warehouse,
            })
    else:
        doc = frappe.new_doc("Stock Entry")
        doc.stock_entry_type = "Material Receipt"
        doc.company = company
        doc.set_posting_time = 1
        doc.posting_date = frappe.utils.nowdate()
        doc.posting_time = frappe.utils.nowtime()
        
        for item in items:
            doc.append("items", {
                "item_code": item.get("item_code"),
                "qty": item.get("qty"),
                "basic_rate": item.get("rate") or 0,
                "t_warehouse": target_warehouse,
            })
            
    doc.insert()
    doc.submit()
    return doc.name
