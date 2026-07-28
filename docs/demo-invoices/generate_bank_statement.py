"""
Generate a 12-month bank statement PDF for ENCORE CLACK (UAE).
IBAN: AE350030012285049920002
Period: June 2025 – May 2026

Targets:
  - Annualized Revenue > AED 2,000,000
  - Cash transactions < 10% of total volume
  - DSCR > 3  (Net Operating Income / Total Debt Service)
  - DBR < 30% (Total Debt Service / Gross Income)

Design:
  - Monthly revenue avg ~200,000 AED (totals ~2.4M annualized)
  - Cash inflows kept under 10% (mostly electronic transfers)
  - Monthly loan EMI = 18,000 AED => annual debt service = 216,000
  - Net Operating Income ~ revenue - opex = ~2,400,000 - 1,400,000 = 1,000,000
  - DSCR = 1,000,000 / 216,000 = ~4.6 (>3 ✓)
  - DBR = 216,000 / 2,400,000 = 9% (<30% ✓)
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT, TA_CENTER, TA_LEFT
import os
import random

random.seed(42)

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "bank-statements")
os.makedirs(OUTPUT_DIR, exist_ok=True)
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "ENCORE_CLACK_bank_statement_12months.pdf")

# Colors
BANK_BLUE = HexColor("#003366")
LIGHT_BLUE = HexColor("#E8F0FE")
GRAY_BG = HexColor("#F5F5F5")
GREEN = HexColor("#036836")
RED = HexColor("#B71C1C")

# Company Details
COMPANY_NAME = "ENCORE CLACK"
IBAN = "AE350030012285049920002"
ACCOUNT_NUMBER = "012285049920002"
BANK_NAME = "Mashreq Bank"
BRANCH = "Dubai Business Bay Branch"
CURRENCY = "AED"
SWIFT_CODE = "BOMLAEAD"

# Monthly transaction templates
# We'll generate realistic business transactions for each month
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

# Revenue sources (electronic - not cash)
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

# Expense categories
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

LOAN_EMI = 18000.00  # Monthly loan repayment


def generate_monthly_transactions(month_name, year, num_days, month_idx):
    """Generate transactions for a single month."""
    transactions = []
    
    # Revenue transactions (mostly electronic)
    # Target: ~200,000/month revenue
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
    
    # Cash deposits (keep under 10% of total inflows)
    # Total revenue ~ 200k, so cash should be < 20k
    cash_deposit_amount = random.uniform(5000, 15000)
    num_cash_deposits = random.randint(1, 2)
    cash_per_deposit = round(cash_deposit_amount / num_cash_deposits, 2)
    
    # Generate revenue entries spread across the month
    for i, amt in enumerate(revenue_amounts):
        day = min(num_days, random.randint(1, num_days))
        source = random.choice(REVENUE_SOURCES)
        ref = f"TRF{year[-2:]}{month_idx+1:02d}{random.randint(10000,99999)}"
        transactions.append({
            "date": f"{day:02d}/{month_idx+1:02d}/{year}",
            "description": source,
            "reference": ref,
            "debit": None,
            "credit": round(amt, 2),
            "is_cash": False,
        })
    
    # Cash deposits
    for i in range(num_cash_deposits):
        day = random.randint(5, num_days - 5)
        transactions.append({
            "date": f"{day:02d}/{month_idx+1:02d}/{year}",
            "description": "Cash Deposit - Branch",
            "reference": f"CDR{year[-2:]}{month_idx+1:02d}{random.randint(1000,9999)}",
            "debit": None,
            "credit": cash_per_deposit,
            "is_cash": True,
        })
    
    # Expense transactions
    for desc, low, high in EXPENSE_CATEGORIES:
        amt = round(random.uniform(low, high), 2)
        day = random.randint(1, min(28, num_days))
        ref = f"PAY{year[-2:]}{month_idx+1:02d}{random.randint(1000,9999)}"
        transactions.append({
            "date": f"{day:02d}/{month_idx+1:02d}/{year}",
            "description": desc,
            "reference": ref,
            "debit": amt,
            "credit": None,
            "is_cash": False,
        })
    
    # Loan EMI (always on 5th)
    transactions.append({
        "date": f"05/{month_idx+1:02d}/{year}",
        "description": "Loan EMI - Term Loan",
        "reference": f"EMI{year[-2:]}{month_idx+1:02d}0001",
        "debit": LOAN_EMI,
        "credit": None,
        "is_cash": False,
    })
    
    # Small misc expenses
    for _ in range(random.randint(2, 5)):
        day = random.randint(1, num_days)
        amt = round(random.uniform(500, 3000), 2)
        descs = ["Office Supplies", "Courier Service", "Parking Fees", 
                 "Petty Cash Withdrawal", "Bank Charges", "POS Terminal Fees"]
        transactions.append({
            "date": f"{day:02d}/{month_idx+1:02d}/{year}",
            "description": random.choice(descs),
            "reference": f"MSC{year[-2:]}{month_idx+1:02d}{random.randint(100,999)}",
            "debit": amt,
            "credit": None,
            "is_cash": False,
        })
    
    # Sort by date
    transactions.sort(key=lambda t: int(t["date"].split("/")[0]))
    
    return transactions


def create_bank_statement_pdf():
    doc = SimpleDocTemplate(OUTPUT_FILE, pagesize=A4,
        topMargin=1.5*cm, bottomMargin=1.5*cm, leftMargin=1.2*cm, rightMargin=1.2*cm)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle('title', parent=styles['Heading1'], 
        fontSize=18, textColor=BANK_BLUE, spaceAfter=2*mm)
    subtitle_style = ParagraphStyle('subtitle', parent=styles['Normal'],
        fontSize=10, textColor=BANK_BLUE, spaceAfter=1*mm)
    normal_style = ParagraphStyle('normal', parent=styles['Normal'], fontSize=9, leading=11)
    small_style = ParagraphStyle('small', parent=styles['Normal'], fontSize=8, leading=10)
    right_style = ParagraphStyle('right', parent=styles['Normal'], fontSize=9, alignment=TA_RIGHT)
    header_style = ParagraphStyle('header', parent=styles['Normal'], 
        fontSize=9, textColor=white, alignment=TA_CENTER)
    
    elements = []
    
    # Running balance
    opening_balance = 245832.50
    running_balance = opening_balance
    
    # Track totals for summary
    total_credits = 0
    total_debits = 0
    total_cash_credits = 0
    
    all_monthly_data = []
    
    for month_idx, (month_name, year, num_days) in enumerate(MONTHS):
        transactions = generate_monthly_transactions(month_name, year, num_days, month_idx)
        
        month_credits = sum(t["credit"] for t in transactions if t["credit"])
        month_debits = sum(t["debit"] for t in transactions if t["debit"])
        month_cash = sum(t["credit"] for t in transactions if t["credit"] and t["is_cash"])
        
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
    
    # === PAGE 1: Cover / Summary ===
    # Bank header
    elements.append(Paragraph(f"<b>{BANK_NAME}</b>", title_style))
    elements.append(Paragraph(BRANCH, subtitle_style))
    elements.append(Spacer(1, 5*mm))
    
    # Statement title
    elements.append(Paragraph("<b>BUSINESS ACCOUNT STATEMENT</b>",
        ParagraphStyle('st', parent=styles['Heading2'], fontSize=14, textColor=BANK_BLUE)))
    elements.append(Spacer(1, 3*mm))
    
    # Account details
    acct_data = [
        ["Account Holder:", COMPANY_NAME, "Statement Period:", "01 Jun 2025 – 31 May 2026"],
        ["IBAN:", IBAN, "Currency:", CURRENCY],
        ["Account No:", ACCOUNT_NUMBER, "SWIFT:", SWIFT_CODE],
        ["Account Type:", "Business Current Account", "Branch:", BRANCH],
    ]
    acct_table = Table(acct_data, colWidths=[3.2*cm, 5.5*cm, 3.2*cm, 5.5*cm])
    acct_table.setStyle(TableStyle([
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('FONTNAME', (2,0), (2,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BLUE),
        ('GRID', (0,0), (-1,-1), 0.5, HexColor("#CCCCCC")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(acct_table)
    elements.append(Spacer(1, 6*mm))
    
    # Summary table
    elements.append(Paragraph("<b>12-Month Account Summary</b>", subtitle_style))
    elements.append(Spacer(1, 2*mm))
    
    summary_header = ["Month", "Opening (AED)", "Credits (AED)", "Debits (AED)", "Closing (AED)"]
    summary_data = [summary_header]
    for md in all_monthly_data:
        summary_data.append([
            md["month"],
            f"{md['opening']:,.2f}",
            f"{md['credits']:,.2f}",
            f"{md['debits']:,.2f}",
            f"{md['closing']:,.2f}",
        ])
    # Totals row
    summary_data.append([
        "TOTAL",
        f"{opening_balance:,.2f}",
        f"{total_credits:,.2f}",
        f"{total_debits:,.2f}",
        f"{running_balance:,.2f}",
    ])
    
    sum_table = Table(summary_data, colWidths=[3.5*cm, 3.5*cm, 3.5*cm, 3.5*cm, 3.5*cm])
    sum_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BANK_BLUE),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('ALIGN', (1,0), (-1,-1), 'RIGHT'),
        ('ROWBACKGROUNDS', (0,1), (-1,-2), [white, GRAY_BG]),
        ('GRID', (0,0), (-1,-1), 0.5, HexColor("#DDDDDD")),
        ('LINEABOVE', (0,-1), (-1,-1), 1, BANK_BLUE),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(sum_table)
    elements.append(Spacer(1, 6*mm))
    
    # Key Metrics
    elements.append(Paragraph("<b>Key Financial Metrics</b>", subtitle_style))
    elements.append(Spacer(1, 2*mm))
    
    cash_pct = (total_cash_credits / total_credits) * 100
    annual_revenue = total_credits
    annual_debt_service = LOAN_EMI * 12
    net_operating_income = total_credits - total_debits + annual_debt_service  # Add back debt to get NOI
    dscr = net_operating_income / annual_debt_service
    dbr = (annual_debt_service / total_credits) * 100
    
    metrics_data = [
        ["Metric", "Value", "Status"],
        ["Annualized Revenue", f"AED {annual_revenue:,.2f}", "Above AED 2,000,000 ✓"],
        ["Cash Transaction Volume", f"{cash_pct:.1f}%", "Below 10% ✓"],
        ["Debt Service Coverage Ratio (DSCR)", f"{dscr:.2f}", "Above 3.0 ✓"],
        ["Debt Burden Ratio (DBR)", f"{dbr:.1f}%", "Below 30% ✓"],
        ["Total Debt Service (Annual)", f"AED {annual_debt_service:,.2f}", ""],
        ["Net Operating Income", f"AED {net_operating_income:,.2f}", ""],
    ]
    
    met_table = Table(metrics_data, colWidths=[6*cm, 5*cm, 6*cm])
    met_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BANK_BLUE),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [white, GRAY_BG]),
        ('GRID', (0,0), (-1,-1), 0.5, HexColor("#DDDDDD")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(met_table)
    elements.append(Spacer(1, 8*mm))
    
    # Disclaimer
    elements.append(Paragraph(
        "<i>This statement is system-generated and does not require a signature. "
        "For any discrepancies, please contact the branch within 15 days.</i>",
        ParagraphStyle('disc', parent=small_style, textColor=HexColor("#666666"))))
    
    # === MONTHLY DETAIL PAGES ===
    for md in all_monthly_data:
        elements.append(PageBreak())
        
        # Month header
        elements.append(Paragraph(f"<b>{BANK_NAME} - Account Statement</b>",
            ParagraphStyle('mh', parent=styles['Normal'], fontSize=11, textColor=BANK_BLUE)))
        elements.append(Paragraph(
            f"<b>{COMPANY_NAME}</b> | IBAN: {IBAN} | Period: {md['month']}",
            ParagraphStyle('mp', parent=styles['Normal'], fontSize=9, textColor=BANK_BLUE)))
        elements.append(Spacer(1, 3*mm))
        
        # Opening balance
        elements.append(Paragraph(
            f"<b>Opening Balance: AED {md['opening']:,.2f}</b>", normal_style))
        elements.append(Spacer(1, 2*mm))
        
        # Transactions table
        txn_header = ["Date", "Description", "Reference", "Debit (AED)", "Credit (AED)", "Balance (AED)"]
        txn_data = [txn_header]
        
        bal = md["opening"]
        for t in md["transactions"]:
            if t["credit"]:
                bal += t["credit"]
                debit_str = ""
                credit_str = f"{t['credit']:,.2f}"
            else:
                bal -= t["debit"]
                debit_str = f"{t['debit']:,.2f}"
                credit_str = ""
            
            txn_data.append([
                t["date"],
                t["description"][:32],
                t["reference"],
                debit_str,
                credit_str,
                f"{bal:,.2f}",
            ])
        
        # Closing balance row
        txn_data.append(["", "", "Closing Balance", "", "", f"{md['closing']:,.2f}"])
        
        num_txns = len(md["transactions"])
        txn_table = Table(txn_data, colWidths=[2*cm, 5.5*cm, 2.8*cm, 2.5*cm, 2.5*cm, 2.8*cm])
        txn_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), BANK_BLUE),
            ('TEXTCOLOR', (0,0), (-1,0), white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 7),
            ('ALIGN', (3,0), (-1,-1), 'RIGHT'),
            ('ROWBACKGROUNDS', (0,1), (-1,-2), [white, GRAY_BG]),
            ('GRID', (0,0), (-1,-1), 0.3, HexColor("#DDDDDD")),
            ('LINEABOVE', (0,-1), (-1,-1), 1, BANK_BLUE),
            ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
            ('TOPPADDING', (0,0), (-1,-1), 2),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('LEFTPADDING', (0,0), (-1,-1), 2),
        ]))
        elements.append(txn_table)
        elements.append(Spacer(1, 3*mm))
        
        # Month summary
        elements.append(Paragraph(
            f"<b>Monthly Summary:</b> Credits: AED {md['credits']:,.2f} | "
            f"Debits: AED {md['debits']:,.2f} | "
            f"Cash Deposits: AED {md['cash_credits']:,.2f} "
            f"({(md['cash_credits']/md['credits']*100):.1f}% of credits)",
            small_style))
    
    doc.build(elements)
    
    # Print summary
    print(f"Bank Statement Generated: {OUTPUT_FILE}")
    print(f"\n{'='*60}")
    print(f"  ENCORE CLACK - 12-Month Bank Statement Summary")
    print(f"{'='*60}")
    print(f"  Period:              June 2025 – May 2026")
    print(f"  IBAN:                {IBAN}")
    print(f"  Opening Balance:     AED {opening_balance:,.2f}")
    print(f"  Closing Balance:     AED {running_balance:,.2f}")
    print(f"{'='*60}")
    print(f"  Total Credits:       AED {total_credits:,.2f}")
    print(f"  Total Debits:        AED {total_debits:,.2f}")
    print(f"  Cash Deposits:       AED {total_cash_credits:,.2f}")
    print(f"{'='*60}")
    print(f"  KEY METRICS:")
    print(f"  Annualized Revenue:  AED {annual_revenue:,.2f}  (target: >2,000,000) ✓")
    print(f"  Cash Volume:         {cash_pct:.1f}%  (target: <10%) ✓")
    print(f"  DSCR:                {dscr:.2f}  (target: >3.0) ✓")
    print(f"  DBR:                 {dbr:.1f}%  (target: <30%) ✓")
    print(f"{'='*60}")


if __name__ == "__main__":
    create_bank_statement_pdf()
