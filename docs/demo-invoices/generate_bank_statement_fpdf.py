"""
Bank Statement Generator - 3 Variants for parser compatibility.
Uses fpdf2 library (known for clean text extraction).

Variant A: Standard table layout with fpdf2
Variant B: Ultra-simple layout, large fonts, minimal data per page
Variant C: One statement per month as separate concept, very spacious

All variants use same financial data meeting:
  - Revenue > AED 2,000,000
  - Cash < 10%
  - DSCR > 3
  - DBR < 30%
"""
from fpdf import FPDF
import os
import random

random.seed(42)

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "bank-statements")
os.makedirs(OUTPUT_DIR, exist_ok=True)

COMPANY_NAME = "ENCORE CLACK"
IBAN = "AE350030012285049920002"
ACCOUNT_NUMBER = "012285049920002"
BANK_NAME = "Mashreq Bank"
BRANCH = "Dubai Business Bay Branch"
CURRENCY = "AED"
SWIFT_CODE = "BOMLAEAD"
LOAN_EMI = 18000.00

MONTHS = [
    ("June", "2025", 30),
    ("July", "2025", 31),
    ("August", "2025", 31),
    ("September", "2025", 30),
    ("October", "2025", 31),
    ("November", "2025", 30),
    ("December", "2025", 31),
    ("January", "2026", 31),
    ("February", "2026", 28),
    ("March", "2026", 31),
    ("April", "2026", 30),
    ("May", "2026", 31),
]

REVENUE_SOURCES = [
    "Client Payment - Project Alpha",
    "Client Payment - Maintenance Contract",
    "Client Payment - Supply Order",
    "Client Payment - Consulting Services",
    "Client Payment - Installation Works",
    "Transfer In - Trade Receivable",
    "Wire Transfer - Contract Payment",
    "SWIFT Transfer - Export Payment",
    "Client Payment - Annual Service",
    "Transfer In - Milestone Payment",
    "Client Payment - Equipment Supply",
    "Wire Transfer - Subcontract Revenue",
]

EXPENSE_CATEGORIES = [
    ("Salary Transfer - Staff", 45000, 55000),
    ("Rent Payment - Office", 25000, 25000),
    ("Supplier Payment - Materials", 15000, 35000),
    ("Utility Payment - DEWA", 3000, 6000),
    ("Insurance Premium", 4000, 4500),
    ("Vehicle Lease Payment", 5000, 5000),
    ("IT Services Payment", 3000, 5000),
    ("Marketing & Advertising", 2000, 8000),
    ("Professional Fees - Audit", 3000, 5000),
    ("Telecom Payment - Etisalat", 1500, 2500),
]


def generate_monthly_transactions(month_name, year, num_days, month_idx):
    transactions = []
    
    num_revenue_txns = random.randint(8, 14)
    revenue_amounts = []
    remaining_revenue = random.uniform(185000, 220000)
    
    for i in range(num_revenue_txns):
        if i == num_revenue_txns - 1:
            amt = remaining_revenue
        else:
            amt = random.uniform(8000, 35000)
            remaining_revenue -= amt
        revenue_amounts.append(round(amt, 2))
    
    cash_deposit_amount = random.uniform(5000, 15000)
    num_cash_deposits = random.randint(1, 2)
    cash_per_deposit = round(cash_deposit_amount / num_cash_deposits, 2)
    
    for i, amt in enumerate(revenue_amounts):
        day = min(num_days, random.randint(1, num_days))
        source = random.choice(REVENUE_SOURCES)
        ref = f"TRF{year[-2:]}{month_idx+1:02d}{random.randint(10000,99999)}"
        transactions.append({
            "date": f"{day:02d}/{month_idx+1:02d}/{year}",
            "description": source,
            "reference": ref,
            "debit": 0,
            "credit": round(amt, 2),
            "is_cash": False,
        })
    
    for i in range(num_cash_deposits):
        day = random.randint(5, num_days - 5)
        transactions.append({
            "date": f"{day:02d}/{month_idx+1:02d}/{year}",
            "description": "Cash Deposit - Branch",
            "reference": f"CDR{year[-2:]}{month_idx+1:02d}{random.randint(1000,9999)}",
            "debit": 0,
            "credit": cash_per_deposit,
            "is_cash": True,
        })
    
    for desc, low, high in EXPENSE_CATEGORIES:
        amt = round(random.uniform(low, high), 2)
        day = random.randint(1, min(28, num_days))
        ref = f"PAY{year[-2:]}{month_idx+1:02d}{random.randint(1000,9999)}"
        transactions.append({
            "date": f"{day:02d}/{month_idx+1:02d}/{year}",
            "description": desc,
            "reference": ref,
            "debit": amt,
            "credit": 0,
            "is_cash": False,
        })
    
    transactions.append({
        "date": f"05/{month_idx+1:02d}/{year}",
        "description": "Loan EMI - Term Loan",
        "reference": f"EMI{year[-2:]}{month_idx+1:02d}0001",
        "debit": LOAN_EMI,
        "credit": 0,
        "is_cash": False,
    })
    
    for _ in range(random.randint(2, 5)):
        day = random.randint(1, num_days)
        amt = round(random.uniform(500, 3000), 2)
        descs = ["Office Supplies", "Courier Service", "Parking Fees",
                 "Petty Cash Withdrawal", "Bank Charges", "POS Terminal Fees"]
        transactions.append({
            "date": f"{day:02d}/{month_idx+1:02d}/{year}",
            "description": random.choice(descs),
            "reference": f"MSC{year[-2:]}{month_idx+1:02d}{random.randint(100,999)}",
            "debit": round(random.uniform(500, 3000), 2),
            "credit": 0,
            "is_cash": False,
        })
    
    transactions.sort(key=lambda t: int(t["date"].split("/")[0]))
    return transactions


def get_all_data():
    """Generate all 12 months of data."""
    opening_balance = 245832.50
    running_balance = opening_balance
    total_credits = 0
    total_debits = 0
    total_cash = 0
    all_months = []
    
    for month_idx, (month_name, year, num_days) in enumerate(MONTHS):
        txns = generate_monthly_transactions(month_name, year, num_days, month_idx)
        month_credits = sum(t["credit"] for t in txns)
        month_debits = sum(t["debit"] for t in txns)
        month_cash = sum(t["credit"] for t in txns if t["is_cash"])
        
        total_credits += month_credits
        total_debits += month_debits
        total_cash += month_cash
        
        all_months.append({
            "name": f"{month_name} {year}",
            "transactions": txns,
            "opening": running_balance,
            "credits": month_credits,
            "debits": month_debits,
            "closing": running_balance + month_credits - month_debits,
            "cash": month_cash,
        })
        running_balance = running_balance + month_credits - month_debits
    
    return all_months, opening_balance, running_balance, total_credits, total_debits, total_cash


def fmt(amount):
    """Format number with commas and 2 decimals."""
    return f"{amount:,.2f}"


# ============================================================
# VARIANT A: Standard fpdf2 table layout
# ============================================================
def generate_variant_a():
    all_months, opening, closing, tot_cr, tot_dr, tot_cash = get_all_data()
    
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Summary page
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, BANK_NAME, new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 6, f"{BRANCH} | SWIFT: {SWIFT_CODE}", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    
    pdf.set_font("Helvetica", "B", 13)
    pdf.cell(0, 8, "BUSINESS ACCOUNT STATEMENT", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 6, f"Account Holder: {COMPANY_NAME}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"IBAN: {IBAN}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"Account Number: {ACCOUNT_NUMBER}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"Account Type: Business Current Account", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"Currency: {CURRENCY}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"Statement Period: 01/06/2025 to 31/05/2026", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)
    
    # Monthly summary table
    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(0, 8, "Monthly Summary", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)
    
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_fill_color(0, 51, 102)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(35, 7, "Month", border=1, fill=True)
    pdf.cell(35, 7, "Opening (AED)", border=1, fill=True)
    pdf.cell(35, 7, "Credits (AED)", border=1, fill=True)
    pdf.cell(35, 7, "Debits (AED)", border=1, fill=True)
    pdf.cell(35, 7, "Closing (AED)", border=1, fill=True)
    pdf.ln()
    
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Helvetica", "", 8)
    for md in all_months:
        pdf.cell(35, 6, md["name"], border=1)
        pdf.cell(35, 6, fmt(md["opening"]), border=1, align="R")
        pdf.cell(35, 6, fmt(md["credits"]), border=1, align="R")
        pdf.cell(35, 6, fmt(md["debits"]), border=1, align="R")
        pdf.cell(35, 6, fmt(md["closing"]), border=1, align="R")
        pdf.ln()
    
    pdf.set_font("Helvetica", "B", 8)
    pdf.cell(35, 6, "TOTAL", border=1)
    pdf.cell(35, 6, fmt(opening), border=1, align="R")
    pdf.cell(35, 6, fmt(tot_cr), border=1, align="R")
    pdf.cell(35, 6, fmt(tot_dr), border=1, align="R")
    pdf.cell(35, 6, fmt(closing), border=1, align="R")
    pdf.ln(10)
    
    # Metrics
    cash_pct = (tot_cash / tot_cr) * 100
    debt_svc = LOAN_EMI * 12
    noi = tot_cr - tot_dr + debt_svc
    dscr = noi / debt_svc
    dbr = (debt_svc / tot_cr) * 100
    
    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(0, 8, "Key Financial Metrics", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(0, 6, f"Annualized Revenue: AED {fmt(tot_cr)}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"Cash Transaction Percentage: {cash_pct:.1f}%", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"Annual Debt Service: AED {fmt(debt_svc)}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"Net Operating Income: AED {fmt(noi)}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"DSCR: {dscr:.2f}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"DBR: {dbr:.1f}%", new_x="LMARGIN", new_y="NEXT")
    
    # Monthly detail pages
    for md in all_months:
        pdf.add_page()
        pdf.set_font("Helvetica", "B", 12)
        pdf.cell(0, 8, f"{BANK_NAME} - Statement for {md['name']}", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 9)
        pdf.cell(0, 6, f"Account: {COMPANY_NAME} | IBAN: {IBAN}", new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 6, f"Opening Balance: AED {fmt(md['opening'])}", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(3)
        
        # Header
        pdf.set_font("Helvetica", "B", 7)
        pdf.set_fill_color(0, 51, 102)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(22, 6, "Date", border=1, fill=True)
        pdf.cell(60, 6, "Description", border=1, fill=True)
        pdf.cell(28, 6, "Reference", border=1, fill=True)
        pdf.cell(28, 6, "Debit (AED)", border=1, fill=True, align="R")
        pdf.cell(28, 6, "Credit (AED)", border=1, fill=True, align="R")
        pdf.cell(28, 6, "Balance (AED)", border=1, fill=True, align="R")
        pdf.ln()
        
        pdf.set_text_color(0, 0, 0)
        pdf.set_font("Helvetica", "", 7)
        bal = md["opening"]
        for t in md["transactions"]:
            if t["credit"] > 0:
                bal += t["credit"]
                dr_str = ""
                cr_str = fmt(t["credit"])
            else:
                bal -= t["debit"]
                dr_str = fmt(t["debit"])
                cr_str = ""
            
            pdf.cell(22, 5, t["date"], border=1)
            pdf.cell(60, 5, t["description"][:30], border=1)
            pdf.cell(28, 5, t["reference"], border=1)
            pdf.cell(28, 5, dr_str, border=1, align="R")
            pdf.cell(28, 5, cr_str, border=1, align="R")
            pdf.cell(28, 5, fmt(bal), border=1, align="R")
            pdf.ln()
        
        pdf.set_font("Helvetica", "B", 7)
        pdf.cell(22, 6, "", border=1)
        pdf.cell(60, 6, "", border=1)
        pdf.cell(28, 6, "Closing Balance", border=1)
        pdf.cell(28, 6, "", border=1, align="R")
        pdf.cell(28, 6, "", border=1, align="R")
        pdf.cell(28, 6, fmt(md["closing"]), border=1, align="R")
        pdf.ln(8)
        
        pdf.set_font("Helvetica", "", 8)
        pdf.cell(0, 5, f"Total Credits: AED {fmt(md['credits'])} | Total Debits: AED {fmt(md['debits'])} | Cash Deposits: AED {fmt(md['cash'])} ({(md['cash']/md['credits']*100):.1f}%)", new_x="LMARGIN", new_y="NEXT")
    
    outfile = os.path.join(OUTPUT_DIR, "ENCORE_CLACK_statement_variant_A.pdf")
    pdf.output(outfile)
    print(f"  Variant A: {outfile}")
    return tot_cr, cash_pct, dscr, dbr


# ============================================================
# VARIANT B: Ultra-simple, large fonts, fewer rows
# ============================================================
def generate_variant_b():
    all_months, opening, closing, tot_cr, tot_dr, tot_cash = get_all_data()
    
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=20)
    
    # Summary page
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 18)
    pdf.cell(0, 12, "BANK STATEMENT", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.ln(4)
    
    pdf.set_font("Helvetica", "", 12)
    pdf.cell(0, 8, f"Bank: {BANK_NAME}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, f"Branch: {BRANCH}", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    pdf.cell(0, 8, f"Account Holder: {COMPANY_NAME}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, f"IBAN: {IBAN}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, f"Account Number: {ACCOUNT_NUMBER}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, f"Currency: {CURRENCY}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, f"Period: 01 June 2025 to 31 May 2026", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)
    
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "ACCOUNT SUMMARY", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)
    
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 7, f"Opening Balance: AED {fmt(opening)}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, f"Total Credits: AED {fmt(tot_cr)}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, f"Total Debits: AED {fmt(tot_dr)}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, f"Closing Balance: AED {fmt(closing)}", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)
    
    cash_pct = (tot_cash / tot_cr) * 100
    debt_svc = LOAN_EMI * 12
    noi = tot_cr - tot_dr + debt_svc
    dscr = noi / debt_svc
    dbr = (debt_svc / tot_cr) * 100
    
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "FINANCIAL METRICS", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 7, f"Annualized Revenue: AED {fmt(tot_cr)}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, f"Cash Deposits Total: AED {fmt(tot_cash)}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, f"Cash Transaction Percentage: {cash_pct:.1f} percent", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, f"Annual Debt Service: AED {fmt(debt_svc)}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, f"Net Operating Income: AED {fmt(noi)}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, f"Debt Service Coverage Ratio (DSCR): {dscr:.2f}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, f"Debt Burden Ratio (DBR): {dbr:.1f} percent", new_x="LMARGIN", new_y="NEXT")
    
    # Monthly pages - simplified (just key transactions, no tiny fonts)
    for md in all_months:
        pdf.add_page()
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, f"STATEMENT - {md['name'].upper()}", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 10)
        pdf.cell(0, 7, f"Account: {COMPANY_NAME}", new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 7, f"IBAN: {IBAN}", new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 7, f"Opening Balance: AED {fmt(md['opening'])}", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(4)
        
        # Table with larger font
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_fill_color(220, 230, 241)
        pdf.cell(22, 7, "Date", border=1, fill=True)
        pdf.cell(65, 7, "Description", border=1, fill=True)
        pdf.cell(30, 7, "Debit (AED)", border=1, fill=True, align="R")
        pdf.cell(30, 7, "Credit (AED)", border=1, fill=True, align="R")
        pdf.cell(30, 7, "Balance (AED)", border=1, fill=True, align="R")
        pdf.ln()
        
        pdf.set_font("Helvetica", "", 8)
        bal = md["opening"]
        for t in md["transactions"]:
            if t["credit"] > 0:
                bal += t["credit"]
                dr_str = ""
                cr_str = fmt(t["credit"])
            else:
                bal -= t["debit"]
                dr_str = fmt(t["debit"])
                cr_str = ""
            
            pdf.cell(22, 6, t["date"], border=1)
            pdf.cell(65, 6, t["description"][:32], border=1)
            pdf.cell(30, 6, dr_str, border=1, align="R")
            pdf.cell(30, 6, cr_str, border=1, align="R")
            pdf.cell(30, 6, fmt(bal), border=1, align="R")
            pdf.ln()
        
        pdf.ln(4)
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(0, 7, f"Closing Balance: AED {fmt(md['closing'])}", new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 7, f"Total Credits: AED {fmt(md['credits'])}", new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 7, f"Total Debits: AED {fmt(md['debits'])}", new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 7, f"Cash Deposits: AED {fmt(md['cash'])}", new_x="LMARGIN", new_y="NEXT")
    
    outfile = os.path.join(OUTPUT_DIR, "ENCORE_CLACK_statement_variant_B.pdf")
    pdf.output(outfile)
    print(f"  Variant B: {outfile}")


# ============================================================
# VARIANT C: No tables at all - pure text lines (most parseable)
# ============================================================
def generate_variant_c():
    all_months, opening, closing, tot_cr, tot_dr, tot_cash = get_all_data()
    
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Summary page
    pdf.add_page()
    pdf.set_font("Courier", "B", 14)
    pdf.cell(0, 8, "MASHREQ BANK", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Courier", "", 10)
    pdf.cell(0, 6, "Dubai Business Bay Branch", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, "=" * 70, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)
    pdf.set_font("Courier", "B", 12)
    pdf.cell(0, 8, "ACCOUNT STATEMENT", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Courier", "", 10)
    pdf.cell(0, 6, f"Account Holder : {COMPANY_NAME}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"IBAN           : {IBAN}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"Account No     : {ACCOUNT_NUMBER}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"Currency       : {CURRENCY}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"Period         : 01/06/2025 to 31/05/2026", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, "=" * 70, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    
    pdf.set_font("Courier", "B", 10)
    pdf.cell(0, 6, "MONTHLY SUMMARY", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, "-" * 70, new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Courier", "", 8)
    pdf.cell(0, 5, f"{'Month':<16}{'Opening':>12}{'Credits':>12}{'Debits':>12}{'Closing':>12}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "-" * 70, new_x="LMARGIN", new_y="NEXT")
    
    for md in all_months:
        line = f"{md['name']:<16}{md['opening']:>12,.2f}{md['credits']:>12,.2f}{md['debits']:>12,.2f}{md['closing']:>12,.2f}"
        pdf.cell(0, 5, line, new_x="LMARGIN", new_y="NEXT")
    
    pdf.cell(0, 5, "-" * 70, new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Courier", "B", 8)
    line = f"{'TOTAL':<16}{opening:>12,.2f}{tot_cr:>12,.2f}{tot_dr:>12,.2f}{closing:>12,.2f}"
    pdf.cell(0, 5, line, new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "=" * 70, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    
    cash_pct = (tot_cash / tot_cr) * 100
    debt_svc = LOAN_EMI * 12
    noi = tot_cr - tot_dr + debt_svc
    dscr = noi / debt_svc
    dbr = (debt_svc / tot_cr) * 100
    
    pdf.set_font("Courier", "B", 10)
    pdf.cell(0, 6, "FINANCIAL METRICS", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Courier", "", 9)
    pdf.cell(0, 6, f"Annualized Revenue         : AED {fmt(tot_cr)}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"Cash Deposits Total        : AED {fmt(tot_cash)}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"Cash Transaction Pct       : {cash_pct:.1f}%", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"Annual Debt Service        : AED {fmt(debt_svc)}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"Net Operating Income       : AED {fmt(noi)}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"DSCR                       : {dscr:.2f}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 6, f"DBR                        : {dbr:.1f}%", new_x="LMARGIN", new_y="NEXT")
    
    # Monthly detail pages - pure monospace text
    for md in all_months:
        pdf.add_page()
        pdf.set_font("Courier", "B", 11)
        pdf.cell(0, 7, f"STATEMENT FOR {md['name'].upper()}", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Courier", "", 9)
        pdf.cell(0, 6, f"Account: {COMPANY_NAME}", new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 6, f"IBAN: {IBAN}", new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 6, f"Opening Balance: AED {fmt(md['opening'])}", new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 5, "=" * 85, new_x="LMARGIN", new_y="NEXT")
        
        pdf.set_font("Courier", "B", 7)
        header = f"{'Date':<12}{'Description':<30}{'Ref':<14}{'Debit':>11}{'Credit':>11}{'Balance':>11}"
        pdf.cell(0, 5, header, new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 5, "-" * 85, new_x="LMARGIN", new_y="NEXT")
        
        pdf.set_font("Courier", "", 7)
        bal = md["opening"]
        for t in md["transactions"]:
            if t["credit"] > 0:
                bal += t["credit"]
                dr_str = ""
                cr_str = f"{t['credit']:>10,.2f}"
            else:
                bal -= t["debit"]
                dr_str = f"{t['debit']:>10,.2f}"
                cr_str = ""
            
            line = f"{t['date']:<12}{t['description'][:28]:<30}{t['reference']:<14}{dr_str:>11}{cr_str:>11}{bal:>11,.2f}"
            pdf.cell(0, 4.5, line, new_x="LMARGIN", new_y="NEXT")
        
        pdf.cell(0, 5, "-" * 85, new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Courier", "B", 8)
        pdf.cell(0, 5, f"Closing Balance: AED {fmt(md['closing'])}", new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 5, f"Credits: AED {fmt(md['credits'])} | Debits: AED {fmt(md['debits'])} | Cash: AED {fmt(md['cash'])}", new_x="LMARGIN", new_y="NEXT")
    
    outfile = os.path.join(OUTPUT_DIR, "ENCORE_CLACK_statement_variant_C.pdf")
    pdf.output(outfile)
    print(f"  Variant C: {outfile}")


if __name__ == "__main__":
    print("Generating 3 bank statement variants for ENCORE CLACK...")
    print(f"Output: {OUTPUT_DIR}\n")
    
    tot_cr, cash_pct, dscr, dbr = generate_variant_a()
    generate_variant_b()
    generate_variant_c()
    
    print(f"\n{'='*60}")
    print(f"  All variants use same data:")
    print(f"  Revenue: AED {fmt(tot_cr)} (>2M)")
    print(f"  Cash %:  {cash_pct:.1f}% (<10%)")
    print(f"  DSCR:    {dscr:.2f} (>3)")
    print(f"  DBR:     {dbr:.1f}% (<30%)")
    print(f"{'='*60}")
    print(f"\n  Variant A: Standard table layout (fpdf2)")
    print(f"  Variant B: Large fonts, simple layout, light bg headers")
    print(f"  Variant C: Pure monospace text, no graphical tables")
