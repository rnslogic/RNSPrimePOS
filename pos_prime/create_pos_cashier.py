import frappe

def create_doctype():
    doctype_name = "POS Cashier"
    if frappe.db.exists("DocType", doctype_name):
        print(f"DocType {doctype_name} already exists. Skipping creation.")
        return

    doc = frappe.get_doc({
        "doctype": "DocType",
        "name": doctype_name,
        "module": "POS Prime",
        "custom": 0,
        "istable": 0,
        "naming_rule": "Expression",
        "autoname": "format:CASHIER-{YYYY}-{MM}-{####}",
        "fields": [
            {
                "fieldname": "title",
                "label": "Title",
                "fieldtype": "Data",
                "reqd": 1,
                "in_list_view": 1,
                "description": "Counter 1, Counter 2, etc."
            },
            {
                "fieldname": "cashier_name",
                "label": "Cashier Name",
                "fieldtype": "Data",
                "reqd": 1,
                "in_list_view": 1,
                "description": "Actual name of the cashier"
            },
            {
                "fieldname": "pin",
                "label": "PIN",
                "fieldtype": "Password",
                "reqd": 1,
                "in_list_view": 1,
                "length": 4,
                "description": "4-digit login PIN for the POS"
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
                "role": "Sales Master Manager",
                "read": 1,
                "write": 1,
                "create": 1,
                "delete": 1
            }
        ],
        "quick_entry": 1,
        "track_changes": 1,
        "title_field": "title",
        "search_fields": "cashier_name"
    })
    doc.insert(ignore_permissions=True)
    print(f"Successfully created DocType: {doctype_name}")

if __name__ == "__main__":
    frappe.init(site="erpmaster.rnslogic.com", sites_path="/home/frappe/frappe-bench/sites")
    frappe.connect()
    create_doctype()
    frappe.db.commit()
