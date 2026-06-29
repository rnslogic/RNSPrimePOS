import frappe

def execute():
    try:
        frappe.session.user = "Administrator"
        from pos_prime.api.drafts import delete_draft_invoice
        result = delete_draft_invoice("ACC-PSINV-2026-00018")
        print("DELETE RESULT:", result)
        frappe.db.commit()
    except Exception as e:
        print("DELETE FAILED!")
        import traceback
        traceback.print_exc()
