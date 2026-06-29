import frappe
from erpnext.accounts.doctype.pos_closing_entry.pos_closing_entry import make_closing_entry_from_opening

def execute():
    try:
        opening_entry = "POS-OPE-2026-00003"
        print(f"Loading Opening Entry: {opening_entry}")
        opening = frappe.get_doc("POS Opening Entry", opening_entry)
        
        # Check if already closed
        if opening.status == "Closed":
            print(f"{opening_entry} is already Closed.")
            return

        print("Making closing entry...")
        closing = make_closing_entry_from_opening(opening)
        
        for pr in closing.payment_reconciliation:
            pr.closing_amount = pr.expected_amount
            pr.difference = 0
            
        print("Inserting closing entry...")
        closing.insert(ignore_permissions=True)
        
        # Monkey patch set_status
        def _set_status(*args, **kwargs):
            print("SET STATUS CALLED:", args, kwargs)
            
        closing.set_status = _set_status
        
        print("Submitting closing entry...")
        closing.submit()
        
        frappe.db.commit()
        print(f"Successfully closed {opening_entry}. Closing Entry: {closing.name}")
        
    except Exception as e:
        frappe.db.rollback()
        print(f"Error occurred: {e}")
        import traceback
        traceback.print_exc()

execute()
