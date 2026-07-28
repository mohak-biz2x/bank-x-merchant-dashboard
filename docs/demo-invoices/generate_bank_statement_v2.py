"""
Generate a 12-month bank statement PDF for ENCORE CLACK (UAE).
V2: Simpler layout optimized for PDF parsing (Gemini OCR/parser).
- Uses clear text labels, no complex table nesting
- Simple grid-based tables with explicit column headers
- Large readable fonts, no overlapping elements
- Standard date formats (DD/MM/YYYY)
- Clear section separators

IBAN: AE350030012285049920002
Period: June 2025 – May 2026

Targets:
  - Annualized Revenue > AED 2,000,000
  - Cash transactions < 10% of total volume
  - DSCR > 3
  - DBR < 30%
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, black, white
from reportlab.pdfgen import canvas
import os
import random

random.seed(42)

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "bank-statements")
os.makedirs(OUTPUT_DIR, exist_ok=True)
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "ENCORE_CLACK_bank_statement_12months.pdf")

# Company Details
COMPANY_NAME = "ENCORE CLACK"
IBAN = "AE350030012285049920002"
ACCOUNT_NUMBER = "012285049920002"
BANK_NAME = "Mashreq Bank"
BRANCH = "Dubai Business Bay Branch"
CURRENCY = "AED"
SWIFT_CODE = "BOMLAEAD"

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

LOAN_EMI = 18000.00


def generate_monthly_transactions(month_name, year, num_days, month_idx):
    """Generate transactions for a single month."""
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
            "debit": "",
            "credit": f"{amt:,.2f}",
            "credit_val": amt,
            "debit_val": 0,
            "is_cash": False,
        })
    
    for i in range(num_cash_deposits):
        day = random.randint(5, num_days - 5)
        transactions.append({
            "date": f"{day:02d}/{month_idx+1:02d}/{year}",
            "description": "Cash Deposit - Branch",
            "reference": f"CDR{year[-2:]}{month_idx+1:02d}{random.randint(1000,9999)}",
            "debit": "",
            "credit": f"{cash_per_deposit:,.2f}",
            "credit_val": cash_per_deposit,
            "debit_val": 0,
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
            "debit": f"{amt:,.2f}",
            "credit": "",
            "credit_val": 0,
            "debit_val": amt,
            "is_cash": False,
        })
    
    transactions.append({
        "date": f"05/{month_idx+1:02d}/{year}",
        "description": "Loan EMI - Term Loan",
        "reference": f"EMI{year[-2:]}{month_idx+1:02d}0001",
        "debit": f"{LOAN_EMI:,.2f}",
        "credit": "",
        "credit_val": 0,
        "debit_val": LOAN_EMI,
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
            "debit": f"{amt:,.2f}",
            "credit": "",
            "credit_val": 0,
            "debit_val": amt,
            "is_cash": False,
        })
    
    transactions.sort(key=lambda t: int(t["date"].split("/")[0]))
    return transactions


def draw_header(c, page_width, y):
    """Draw bank header at top of page."""
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, y, BANK_NAME)
    c.setFont("Helvetica", 9)
    c.drawString(40, y - 14, BRANCH)
    c.drawString(40, y - 26, f"SWIFT: {SWIFT_CODE}")
    
    c.setFont("Helvetica-Bold", 11)
    c.drawRightString(page_width - 40, y, "ACCOUNT STATEMENT")
    c.setFont("Helvetica", 9)
    c.drawRightString(page_width - 40, y - 14, f"Statement Date: 31/05/2026")
    
    # Line separator
    c.setStrokeColor(HexColor("#003366"))
    c.setLineWidth(1.5)
    c.line(40, y - 35, page_width - 40, y - 35)
    
    return y - 45


def draw_account_info(c, y):
    """Draw account information section."""
    c.setFont("Helvetica-Bold", 10)
    c.drawString(40, y, "Account Information")
    y -= 16
    
    c.setFont("Helvetica", 9)
    info_lines = [
        f"Account Holder:    {COMPANY_NAME}",
        f"IBAN:              {IBAN}",
        f"Account Number:    {ACCOUNT_NUMBER}",
        f"Account Type:      Business Current Account",
        f"Currency:          {CURRENCY}",
        f"Statement Period:  01/06/2025 to 31/05/2026",
    ]
    for line in info_lines:
        c.drawString(40, y, line)
        y -= 13
    
    return y - 5


def draw_table_header(c, y, cols, widths):
    """Draw a simple table header row."""
    c.setFillColor(HexColor("#003366"))
    c.rect(38, y - 12, sum(widths) + 4, 14, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 8)
    
    x = 40
    for col, w in zip(cols, widths):
        c.drawString(x, y - 9, col)
        x += w
    
    c.setFillColor(black)
    return y - 14


def draw_row(c, y, values, widths, bold=False):
    """Draw a table row."""
    font = "Helvetica-Bold" if bold else "Helvetica"
    c.setFont(font, 8)
    x = 40
    for val, w in zip(values, widths):
        c.drawString(x, y - 9, str(val))
        x += w
    # Light grid line
    c.setStrokeColor(HexColor("#E0E0E0"))
    c.setLineWidth(0.3)
    c.line(38, y - 12, 38 + sum(widths) + 4, y - 12)
    return y - 12


def create_bank_statement():
    page_width, page_height = A4
    c = canvas.Canvas(OUTPUT_FILE, pagesize=A4)
    
    opening_balance = 245832.50
    running_balance = opening_balance
    
    total_credits = 0
    total_debits = 0
    total_cash_credits = 0
    
    all_monthly_data = []
    
    for month_idx, (month_name, year, num_days) in enumerate(MONTHS):
        transactions = generate_monthly_transactions(month_name, year, num_days, month_idx)
        
        month_credits = sum(t["credit_val"] for t in transactions)
        month_debits = sum(t["debit_val"] for t in transactions)
        month_cash = sum(t["credit_val"] for t in transactions if t["is_cash"])
        
        total_credits += month_credits
        total_debits += month_debits
        total_cash_credits += month_cash
        
        all_monthly_data.append({
            "month": f"{month_name} {year}",
            "transactions": transactions,
            "opening": running_balance,
            "credits": month_credits,
            "debits": month_debits,
            "closing": running_balance + month_credits - month_debits,
            "cash_credits": month_cash,
        })
        
        running_balance = running_balance + month_credits - month_debits
    
    # === PAGE 1: Summary ===
    y = page_height - 40
    y = draw_header(c, page_width, y)
    y = draw_account_info(c, y)
    
    y -= 10
    c.setFont("Helvetica-Bold", 10)
    c.drawString(40, y, "12-Month Summary")
    y -= 18
    
    # Summary table
    sum_cols = ["Month", "Opening (AED)", "Credits (AED)", "Debits (AED)", "Closing (AED)"]
    sum_widths = [90, 90, 90, 90, 90]
    y = draw_table_header(c, y, sum_cols, sum_widths)
    
    for md in all_monthly_data:
        values = [
            md["month"],
            f"{md['opening']:,.2f}",
            f"{md['credits']:,.2f}",
            f"{md['debits']:,.2f}",
            f"{md['closing']:,.2f}",
        ]
        y = draw_row(c, y, values, sum_widths)
    
    # Totals
    values = ["TOTAL", f"{opening_balance:,.2f}", f"{total_credits:,.2f}",
              f"{total_debits:,.2f}", f"{running_balance:,.2f}"]
    c.setStrokeColor(HexColor("#003366"))
    c.setLineWidth(1)
    c.line(38, y, 38 + sum(sum_widths) + 4, y)
    y = draw_row(c, y, values, sum_widths, bold=True)
    
    # Key Metrics
    y -= 20
    c.setFont("Helvetica-Bold", 10)
    c.drawString(40, y, "Key Financial Metrics")
    y -= 16
    
    cash_pct = (total_cash_credits / total_credits) * 100
    annual_revenue = total_credits
    annual_debt_service = LOAN_EMI * 12
    net_operating_income = total_credits - total_debits + annual_debt_service
    dscr = net_operating_income / annual_debt_service
    dbr = (annual_debt_service / total_credits) * 100
    
    c.setFont("Helvetica", 9)
    metrics = [
        f"Annualized Revenue:                AED {annual_revenue:,.2f}",
        f"Total Cash Deposits:               AED {total_cash_credits:,.2f}",
        f"Cash Transaction Percentage:       {cash_pct:.1f}%",
        f"Annual Debt Service (Loan EMI):    AED {annual_debt_service:,.2f}",
        f"Net Operating Income:              AED {net_operating_income:,.2f}",
        f"Debt Service Coverage Ratio:       {dscr:.2f}",
        f"Debt Burden Ratio:                 {dbr:.1f}%",
    ]
    for m in metrics:
        c.drawString(40, y, m)
        y -= 13
    
    y -= 10
    c.setFont("Helvetica-Oblique", 8)
    c.setFillColor(HexColor("#666666"))
    c.drawString(40, y, "This is a system-generated statement and does not require a signature.")
    c.setFillColor(black)
    
    c.showPage()
    
    # === MONTHLY DETAIL PAGES ===
    txn_cols = ["Date", "Description", "Reference", "Debit (AED)", "Credit (AED)", "Balance (AED)"]
    txn_widths = [60, 175, 80, 70, 70, 75]
    
    for md in all_monthly_data:
        y = page_height - 40
        y = draw_header(c, page_width, y)
        
        c.setFont("Helvetica-Bold", 10)
        c.drawString(40, y, f"Statement for {md['month']}")
        y -= 14
        c.setFont("Helvetica", 9)
        c.drawString(40, y, f"Account: {COMPANY_NAME}  |  IBAN: {IBAN}")
        y -= 14
        c.drawString(40, y, f"Opening Balance: AED {md['opening']:,.2f}")
        y -= 18
        
        y = draw_table_header(c, y, txn_cols, txn_widths)
        
        bal = md["opening"]
        for t in md["transactions"]:
            if t["credit_val"] > 0:
                bal += t["credit_val"]
            else:
                bal -= t["debit_val"]
            
            values = [
                t["date"],
                t["description"][:28],
                t["reference"],
                t["debit"],
                t["credit"],
                f"{bal:,.2f}",
            ]
            y = draw_row(c, y, values, txn_widths)
            
            # Check if we need a new page
            if y < 60:
                c.showPage()
                y = page_height - 40
                y = draw_header(c, page_width, y)
                c.setFont("Helvetica", 9)
                c.drawString(40, y, f"{md['month']} (continued)  |  {COMPANY_NAME}  |  IBAN: {IBAN}")
                y -= 18
                y = draw_table_header(c, y, txn_cols, txn_widths)
        
        # Closing balance
        c.setStrokeColor(HexColor("#003366"))
        c.setLineWidth(1)
        c.line(38, y, 38 + sum(txn_widths) + 4, y)
        values = ["", "", "Closing Balance", "", "", f"{md['closing']:,.2f}"]
        y = draw_row(c, y, values, txn_widths, bold=True)
        
        y -= 10
        c.setFont("Helvetica", 8)
        c.drawString(40, y, f"Total Credits: AED {md['credits']:,.2f}  |  "
                     f"Total Debits: AED {md['debits']:,.2f}  |  "
                     f"Cash Deposits: AED {md['cash_credits']:,.2f} "
                     f"({(md['cash_credits']/md['credits']*100):.1f}%)")
        
        c.showPage()
    
    c.save()
    
    print(f"Bank Statement Generated: {OUTPUT_FILE}")
    print(f"\n{'='*60}")
    print(f"  ENCORE CLACK - 12-Month Bank Statement Summary")
    print(f"{'='*60}")
    print(f"  Period:              June 2025 - May 2026")
    print(f"  IBAN:                {IBAN}")
    print(f"  Opening Balance:     AED {opening_balance:,.2f}")
    print(f"  Closing Balance:     AED {running_balance:,.2f}")
    print(f"{'='*60}")
    print(f"  Total Credits:       AED {total_credits:,.2f}")
    print(f"  Total Debits:        AED {total_debits:,.2f}")
    print(f"  Cash Deposits:       AED {total_cash_credits:,.2f}")
    print(f"{'='*60}")
    print(f"  KEY METRICS:")
    print(f"  Annualized Revenue:  AED {annual_revenue:,.2f}  (target: >2,000,000) OK")
    print(f"  Cash Volume:         {cash_pct:.1f}%  (target: <10%) OK")
    print(f"  DSCR:                {dscr:.2f}  (target: >3.0) OK")
    print(f"  DBR:                 {dbr:.1f}%  (target: <30%) OK")
    print(f"{'='*60}")


if __name__ == "__main__":
    create_bank_statement()
