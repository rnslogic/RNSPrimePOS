import frappe

def create_doctype():
    doctype_name = "POS Cashier"
    if frappe.db.exists("DocType", doctype_name):
        print(f"DocType {doctype_name} already exists.")
        return

    doc = frappe.get_doc({
        "doctype": "DocType",
        "name": doctype_name,
        "module": "POS Prime",
        "custom": 1,
        "istable": 0,
        "naming_rule": "By fieldname",
        "autoname": "field:title",
        "fields": [
            {
                "fieldname": "title",
                "label": "Title",
                "fieldtype": "Data",
                "reqd": 1,
                "unique": 1,
                "in_list_view": 1,
                "description": "e.g., Cashier 1"
            },
            {
                "fieldname": "cashier_name",
                "label": "Cashier Name",
                "fieldtype": "Data",
                "reqd": 1,
                "in_list_view": 1,
                "description": "e.g., Ahmed"
            },
            {
                "fieldname": "pin",
                "label": "PIN",
                "fieldtype": "Data",
                "reqd": 1,
                "in_list_view": 1,
                "description": "4-digit PIN",
                "length": 4
            }
        ],
        "permissions": [
            {
                "role": "System Manager",
                "read": 1,
                "write": 1,
                "create": 1,
                "delete": 1
            },
            {
                "role": "POS Manager",
                "read": 1,
                "write": 1,
                "create": 1,
                "delete": 1
            },
            {
                "role": "POS User",
                "read": 1
            }
        ],
        "quick_entry": 1,
        "track_changes": 1
    })
    doc.insert()
    print(f"Successfully created DocType: {doctype_name}")

    # Add a default cashier
    if not frappe.db.exists("POS Cashier", "Cashier 1"):
        cashier = frappe.get_doc({
            "doctype": "POS Cashier",
            "title": "Cashier 1",
            "cashier_name": "Ahmed",
            "pin": "1111"
        })
        cashier.insert()
        print("Created default Cashier: Cashier 1 (Ahmed)")
