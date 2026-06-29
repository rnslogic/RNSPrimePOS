import frappe

def run():
    try:
        companies = frappe.get_all("Company", pluck="name")
        if not companies:
            print("No company found! Please complete the setup wizard first.")
            return
        company = companies[0]
        print(f"Setting up for Company: {company}")

        # 1. Create Default Customer
        if not frappe.db.exists("Customer", "Walk-in Customer"):
            doc = frappe.new_doc("Customer")
            doc.customer_name = "Walk-in Customer"
            doc.customer_group = "Commercial"
            doc.customer_type = "Company"
            doc.territory = "Pakistan" if frappe.db.exists("Territory", "Pakistan") else "All Territories"
            doc.insert(ignore_permissions=True)
            print("Created Customer: Walk-in Customer")

        # 2. Create Items
        items = [
            {"item_code": "Tyre", "item_name": "Car Tyre 15 inch", "standard_rate": 15000},
            {"item_code": "Tube", "item_name": "Car Tube 15 inch", "standard_rate": 2000},
            {"item_code": "Rim", "item_name": "Alloy Rim 15 inch", "standard_rate": 12000}
        ]
        
        item_group = "Products" if frappe.db.exists("Item Group", "Products") else "All Item Groups"

        for item in items:
            if not frappe.db.exists("Item", item["item_code"]):
                doc = frappe.new_doc("Item")
                doc.item_code = item["item_code"]
                doc.item_name = item["item_name"]
                doc.item_group = item_group
                doc.is_stock_item = 1
                doc.valuation_rate = item["standard_rate"] * 0.7
                doc.standard_rate = item["standard_rate"]
                doc.insert(ignore_permissions=True)
                print(f"Created Item: {item['item_code']}")
                
                price = frappe.new_doc("Item Price")
                price.item_code = item["item_code"]
                price.price_list = "Standard Selling"
                price.price_list_rate = item["standard_rate"]
                price.insert(ignore_permissions=True)
                print(f"Set price for: {item['item_code']}")

        # 3. Add Opening Stock
        abbr = frappe.db.get_value("Company", company, "abbr")
        warehouse = f"Stores - {abbr}"
        if not frappe.db.exists("Warehouse", warehouse):
            warehouses = frappe.get_all("Warehouse", filters={"company": company}, pluck="name")
            if warehouses:
                warehouse = warehouses[0]

        stock_entry = frappe.new_doc("Stock Entry")
        stock_entry.purpose = "Material Receipt"
        stock_entry.company = company
        for item in items:
            stock_entry.append("items", {
                "item_code": item["item_code"],
                "t_warehouse": warehouse,
                "qty": 50,
                "basic_rate": item["standard_rate"] * 0.7
            })
        stock_entry.insert(ignore_permissions=True)
        stock_entry.submit()
        print("Added 50 Qty opening stock for Tyre, Tube, and Rim!")

        # 4. Setup POS Profile
        if not frappe.db.exists("POS Profile", "Main POS"):
            profile = frappe.new_doc("POS Profile")
            profile.name = "Main POS"
            profile.company = company
            profile.warehouse = warehouse
            profile.campaign = ""
            profile.selling_price_list = "Standard Selling"
            profile.currency = frappe.db.get_value("Company", company, "default_currency")
            profile.write_off_account = frappe.db.get_value("Company", company, "default_expense_account")
            profile.write_off_cost_center = frappe.db.get_value("Company", company, "cost_center")
            profile.customer = "Walk-in Customer"
            
            mode_of_payment = "Cash"
            if not frappe.db.exists("Mode of Payment", "Cash"):
                mop = frappe.get_all("Mode of Payment", pluck="name")
                if mop: mode_of_payment = mop[0]
            
            cash_account = frappe.db.get_value("Company", company, "default_cash_account")
            if not cash_account:
                accounts = frappe.get_all("Account", filters={"company": company, "account_type": "Cash"}, pluck="name")
                cash_account = accounts[0] if accounts else None
                
            if cash_account:
                profile.append("payments", {
                    "mode_of_payment": mode_of_payment,
                    "default": 1,
                    "allow_in_returns": 1,
                    "account": cash_account
                })
                profile.insert(ignore_permissions=True)
                print("Created POS Profile: Main POS")
            else:
                print("Could not create POS Profile: No Cash account found.")

        # In ERPNext v15+, POS Profile isn't directly on User doctype unless custom.
        # But we don't need to set it anyway, they can select it in the POS App.
        frappe.db.commit()
        print("Setup Completed Successfully!")
    except Exception as e:
        frappe.db.rollback()
        print(f"Error occurred: {str(e)}")
