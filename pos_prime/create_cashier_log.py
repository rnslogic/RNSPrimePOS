import frappe

def create_doctype():
    doctype_name = "POS Cashier Log"
    if frappe.db.exists("DocType", doctype_name):
        frappe.delete_doc("DocType", doctype_name)

    doc = frappe.get_doc({
        "doctype": "DocType",
        "name": doctype_name,
        "module": "POS Prime",
        "custom": 0,
        "istable": 0,
        "naming_rule": "Expression",
        "autoname": "format:PCL-{YYYY}-{MM}-{####}",
        "fields": [
            {
                "fieldname": "cashier",
                "label": "Cashier",
                "fieldtype": "Link",
                "options": "POS Cashier",
                "reqd": 1,
                "in_list_view": 1
            },
            {
                "fieldname": "log_type",
                "label": "Log Type",
                "fieldtype": "Select",
                "options": "Check-in\nCheck-out",
                "reqd": 1,
                "in_list_view": 1
            },
            {
                "fieldname": "time",
                "label": "Time",
                "fieldtype": "Datetime",
                "reqd": 1,
                "in_list_view": 1
            },
            {
                "fieldname": "offline_id",
                "label": "Offline ID",
                "fieldtype": "Data",
                "hidden": 1,
                "unique": 1
            }
        ],
        "permissions": [
            {
                "role": "System Manager",
                "read": 1,
                "write": 1,
                "create": 1,
                "delete": 1
            }
        ],
        "quick_entry": 1,
        "track_changes": 1
    })
    doc.insert()
    print(f"Successfully created DocType: {doctype_name}")

if __name__ == "__main__":
    frappe.init(site="erpdemo.rnslogic.com", sites_path="/home/frappe/frappe-bench/sites")
    frappe.connect()
    create_doctype()
    frappe.db.commit()
