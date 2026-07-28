"""
Generate 12 monthly bank statements for ENCORE CLACK in RAK Bank format.
Mimics the exact layout of RAK Bank e-statements that parse correctly.

Company: ENCORE CLACK
IBAN: AE350030012285049920002
Period: June 2025 - May 2026 (12 separate monthly PDFs)

Targets:
  - Annual Revenue > AED 15,000,000
  - Cash transactions < 10% of total deposit volume
  - DSCR > 3
  - DBR < 20% where:
    DBR = (bureau debt obligations) / Monthly Net Margin
    Bureau debt obligations are ~AED 210,000/month (from bureau, not statement)
    Monthly Net Margin must be > 210,000/0.20 = 1,050,000 to get DBR < 20%

Design (calibrated for DBR < 20% with bureau debt of ~210k):
  - Monthly Revenue (Deposits): ~1,600,000 (annual ~19.2M > 15M)
  - Monthly Expenses (Withdrawals): ~200,000
  - Monthly Net Margin: ~1,400,000
  - DBR = 210,000 / 1,400,000 = 15% (<20% OK)
  - Annual Net Margin = 16,800,000
  - Cash deposits ~80k/month vs 1.6M total => ~5% (<10% OK)
"""
from fpdf import FPDF
import os
import random

random.seed(99)

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "bank-statements")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Company details
COMPANY = "ENCORE CLACK"
PLOT = "Office 204, Building B"
UNIT = "Business Bay Tower"
STREET = "Al Abraj Street"
CITY = "DUBAI,  UNITED ARAB EMIRATES"
IBAN = "AE350030012285049920002"
ACCOUNT_NUMBER = "XXXXXXX420001"
BRANCH = "BUSINESS BAY, DUBAI"
CURRENCY = "AED"
ACCOUNT_TYPE = "CURRENT ACCOUNT"

# Financial parameters (bureau-sourced values shown for reference only)
# These do NOT appear in the bank statement - they come from bureau
# LOAN_EMI = 25,000; CC_LIMIT = 100,000; OD_LIMIT = 200,000
# Bureau monthly debt obligation ~210,000
# The bank statement only controls Monthly Net Margin (deposits - withdrawals)

MONTHS_DATA = [
    ("June", 2025, 30, "01-Jun-2025", "30-Jun-2025", "01-Jul-2025"),
    ("July", 2025, 31, "01-Jul-2025", "31-Jul-2025", "01-Aug-2025"),
    ("August", 2025, 31, "01-Aug-2025", "31-Aug-2025", "01-Sep-2025"),
    ("September", 2025, 30, "01-Sep-2025", "30-Sep-2025", "01-Oct-2025"),
    ("October", 2025, 31, "01-Oct-2025", "31-Oct-2025", "01-Nov-2025"),
    ("November", 2025, 30, "01-Nov-2025", "30-Nov-2025", "01-Dec-2025"),
    ("December", 2025, 31, "30-Nov-2025", "31-Dec-2025", "01-Jan-2026"),
    ("January", 2026, 31, "01-Jan-2026", "31-Jan-2026", "01-Feb-2026"),
    ("February", 2026, 28, "01-Feb-2026", "28-Feb-2026", "01-Mar-2026"),
    ("March", 2026, 31, "01-Mar-2026", "31-Mar-2026", "01-Apr-2026"),
    ("April", 2026, 30, "01-Apr-2026", "30-Apr-2026", "01-May-2026"),
    ("May", 2026, 31, "01-May-2026", "31-May-2026", "01-Jun-2026"),
]

MONTH_ABBR = {
    "June": "JUN", "July": "JUL", "August": "AUG", "September": "SEP",
    "October": "OCT", "November": "NOV", "December": "DEC",
    "January": "JAN", "February": "FEB", "March": "MAR",
    "April": "APR", "May": "MAY"
}

CLIENTS = [
    "NEXGEN BUILDING SOLUTIONS LLC",
    "GULF STAR CONSTRUCTION ENGI",
    "PLATINUM CONTRACTING LLC",
    "AL RAHA ENGINEERING SERVICES",
    "CRESCENT INFRASTRUCTURE FZE",
    "HORIZON TECHNICAL SERVICES",
    "SKYLINE DEVELOPMENTS LLC",
    "OASIS FACILITIES MANAGEMENT",
    "FALCON STEEL FABRICATION",
    "DESERT ROSE INTERIORS LLC",
    "BLUESTONE CONSTRUCTION LLC",
    "ZENITH ENGINEERING SERVICES",
    "PALM TOWER DEVELOPMENTS",
    "EMERALD BAY CONTRACTING",
    "TITAN INFRASTRUCTURE GROUP",
]

PAYEES = [
    "MOHAMMED ALI HASSAN", "ABDUL BASITH", "IMAD EL KHOURY",
    "MARWAN AZAR", "SANJIV V KAVATHEKAR", "ISMAIL UMAIR MOHAMMED",
    "SHOUKAT ALI NAZIR HUSSAIN", "JAILANI BASHEER", "AHMAD FAROUK SALEM",
    "RASHID AL MAKTOUM TRADING", "AL FUTTAIM SUPPLIES", "DRAKE & SCULL INT",
]

SUPPLIERS = [
    "EPIPHAN SYSTEMS INC", "AL BADER EXCHANGE", "CONSOLIDATED SHIPPING",
    "MALEK EL GHOR TRADING", "WATER IN MOTION LLC", "FARNEK SERVICES LLC",
]

BANKS = ["ADCB AUH", "EIB DXB", "CBD DXB", "ABL DXB", "ENBD DXB", "ARBIFT AAN"]


def generate_month_transactions(month_name, year, num_days, month_idx, opening_bal):
    """Generate realistic transactions for one month.
    Target: deposits ~1,600,000, withdrawals ~200,000, net margin ~1,400,000.
    """
    abbr = MONTH_ABBR[month_name]
    all_txns = []

    # === DEPOSITS (Revenue) ===
    # Target: ~1,600,000/month total deposits
    target_revenue = random.uniform(1550000, 1680000)

    # Large project payments (INWARD T/T) - 8-12 large ones
    num_large = random.randint(8, 12)
    large_amounts = []
    remaining = target_revenue * 0.88  # 88% from wire transfers
    for i in range(num_large):
        if i == num_large - 1:
            large_amounts.append(round(remaining, 2))
        else:
            amt = round(random.uniform(60000, 250000), 2)
            amt = min(amt, remaining - (num_large - i - 1) * 40000)
            large_amounts.append(amt)
            remaining -= amt

    for amt in large_amounts:
        day = random.randint(2, num_days - 1)
        client = random.choice(CLIENTS)
        ref = f"SMEI-{random.randint(10000000, 99999999)}-SYSTECH"
        all_txns.append({
            "day": day,
            "desc": f"INWARD T/T\n{client}\n/REF/{ref}",
            "cheque": "", "withdrawal": 0, "deposit": amt, "is_cash": False
        })

    # Cheque deposits - 3-5 medium ones (~7% of revenue)
    cheque_target = target_revenue * 0.07
    num_cheques = random.randint(3, 5)
    for i in range(num_cheques):
        amt = round(cheque_target / num_cheques * random.uniform(0.7, 1.3), 2)
        day = random.randint(3, num_days - 2)
        bank = random.choice(BANKS)
        chq = f"00{random.randint(5000, 9999)}"
        all_txns.append({
            "day": day,
            "desc": f"CHEQUE DEPOSIT\n{chq} {bank}",
            "cheque": "", "withdrawal": 0, "deposit": amt, "is_cash": False
        })

    # ATM Cash deposits (< 10% of total, target ~5%)
    cash_target = target_revenue * random.uniform(0.03, 0.05)
    num_cash = random.randint(1, 2)
    for _ in range(num_cash):
        amt = round(cash_target / num_cash, 2)
        day = random.randint(5, num_days - 5)
        atm_ref = f"500{random.randint(100000000, 999999999)}"
        all_txns.append({
            "day": day,
            "desc": f"ATM CASH DEPOSIT\n{atm_ref} {day:02d}-{month_idx+1:02d}-{year} {random.randint(9,17)}:{random.randint(10,59)}\nAl Quoz Branch 0892",
            "cheque": "", "withdrawal": 0, "deposit": amt, "is_cash": True
        })

    # === WITHDRAWALS (Expenses) ===
    # Target TOTAL withdrawals: ~200,000/month (to achieve net margin ~1,400,000)

    # Commodity Delivery / Loan EMI (on 2nd)
    all_txns.append({
        "day": 2,
        "desc": f"COMMODITY DELIVERY\n20692122/00000008901\nValue date 01-{abbr}-{year}",
        "cheque": "", "withdrawal": 25000.00, "deposit": 0, "is_cash": False
    })

    # Staff salary payments (AANI TO) - 5-7 employees
    num_staff = random.randint(5, 7)
    for _ in range(num_staff):
        amt = round(random.uniform(3000, 12000), 2)
        day = random.randint(2, num_days - 1)
        payee = random.choice(PAYEES)
        ref = f"18{random.randint(1000000, 9999999)}"
        all_txns.append({
            "day": day,
            "desc": f"AANI TO {payee}\n1.0000\n{ref}",
            "cheque": "", "withdrawal": amt, "deposit": 0, "is_cash": False
        })

    # CLG CHQ.DRAWN - 2-3 cheques
    num_clg = random.randint(2, 3)
    for _ in range(num_clg):
        amt = round(random.uniform(8000, 25000), 2)
        day = random.randint(3, num_days - 1)
        chq = f"001{random.randint(200, 399)}"
        all_txns.append({
            "day": day,
            "desc": "CLG CHQ.DRAWN",
            "cheque": chq, "withdrawal": amt, "deposit": 0, "is_cash": False
        })

    # HOUSE CHEQUE - 1-2
    for _ in range(random.randint(1, 2)):
        amt = round(random.uniform(5000, 15000), 2)
        day = random.randint(5, num_days - 3)
        chq = f"001{random.randint(200, 399)}"
        all_txns.append({
            "day": day,
            "desc": "HOUSE CHEQUE",
            "cheque": chq, "withdrawal": amt, "deposit": 0, "is_cash": False
        })

    # One supplier payment (OUTWARD T/T)
    all_txns.append({
        "day": random.randint(10, 20),
        "desc": f"OUTWARD T/T\n{random.choice(SUPPLIERS)}\n1.00",
        "cheque": "", "withdrawal": round(random.uniform(15000, 40000), 2),
        "deposit": 0, "is_cash": False
    })

    # Credit card payment
    all_txns.append({
        "day": random.randint(15, 25),
        "desc": "PAYMENT TO OTHER RAKBANK\nCREDIT CARD\n5362727757612592 MALEK EL GHOR",
        "cheque": "", "withdrawal": round(random.uniform(3000, 5000), 2),
        "deposit": 0, "is_cash": False
    })

    # Bank charges
    num_charges = random.randint(4, 8)
    for _ in range(num_charges):
        day = random.randint(2, num_days - 1)
        ref = f"18{random.randint(1000000, 9999999)}"
        fee = random.choice([3.15, 3.15, 4.20, 4.20, 26.25])
        all_txns.append({
            "day": day,
            "desc": f"CHARGE COLLECTION - INCL VAT\nREF:{ref}",
            "cheque": "", "withdrawal": fee, "deposit": 0, "is_cash": False
        })

    # Monthly maintenance fee
    all_txns.append({
        "day": 2,
        "desc": "CHARGE COLLECTION-INCL. VAT\nBUSBNK_MAINT_FEE_CHRG",
        "cheque": "", "withdrawal": 103.95, "deposit": 0, "is_cash": False
    })

    # Personal Takaful
    all_txns.append({
        "day": 2,
        "desc": f"PERSONAL TAKAFUL RECOVERY-INCL.\nVAT\n20692122/00000008901\nValue date 01-{abbr}-{year}",
        "cheque": "", "withdrawal": 198.06, "deposit": 0, "is_cash": False
    })

    # Sort by day
    all_txns.sort(key=lambda t: t["day"])

    # Calculate running balance and format
    bal = opening_bal
    formatted_txns = []
    for t in all_txns:
        if t["deposit"] > 0:
            bal += t["deposit"]
        else:
            bal -= t["withdrawal"]

        bal_str = f"{abs(bal):,.2f}{'Cr' if bal >= 0 else 'Dr'}"

        formatted_txns.append({
            "date": f"{t['day']:02d}-{abbr}-{year}",
            "desc": t["desc"],
            "cheque": t["cheque"],
            "withdrawal": f"{t['withdrawal']:,.2f}" if t["withdrawal"] > 0 else "",
            "deposit": f"{t['deposit']:,.2f}" if t["deposit"] > 0 else "",
            "balance": bal_str,
            "is_cash": t["is_cash"],
            "deposit_val": t["deposit"],
            "withdrawal_val": t["withdrawal"],
        })

    total_deposits = sum(t["deposit_val"] for t in formatted_txns)
    total_withdrawals = sum(t["withdrawal_val"] for t in formatted_txns)
    total_cash = sum(t["deposit_val"] for t in formatted_txns if t["is_cash"])
    fees = sum(t["withdrawal_val"] for t in formatted_txns
               if "CHARGE COLLECTION" in t["desc"] or "TAKAFUL" in t["desc"])

    return formatted_txns, bal, total_deposits, total_withdrawals, fees, total_cash


class RAKStatement(FPDF):
    def __init__(self, month_name, year, start_date, end_date, issue_date):
        super().__init__()
        self.month_name = month_name
        self.year = year
        self.start_date = start_date
        self.end_date = end_date
        self.issue_date = issue_date
        self.total_pages = 1
        self.current_page_num = 0

    def header(self):
        self.current_page_num += 1
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(0, 51, 153)
        self.cell(95, 6, "RAK BANK", align="L")
        self.set_font("Helvetica", "B", 12)
        self.cell(95, 6, "Your Bank Statement", align="R")
        self.ln(8)

        self.set_draw_color(0, 51, 153)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)

        self.set_text_color(0, 0, 0)
        self.set_font("Helvetica", "B", 9)

        y_start = self.get_y()
        self.cell(95, 5, COMPANY, new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "", 8)
        self.cell(95, 5, PLOT, new_x="LMARGIN", new_y="NEXT")
        self.cell(95, 5, UNIT, new_x="LMARGIN", new_y="NEXT")
        self.cell(95, 5, STREET, new_x="LMARGIN", new_y="NEXT")
        self.cell(95, 5, CITY, new_x="LMARGIN", new_y="NEXT")
        y_end = self.get_y()

        self.set_y(y_start)
        details = [
            ("Date Issued:", self.issue_date),
            ("Statement Period:", f"{self.start_date} to {self.end_date}"),
            ("Account Type:", ACCOUNT_TYPE),
            ("Account Number:", ACCOUNT_NUMBER),
            ("IBAN:", IBAN),
            ("Branch:", BRANCH),
            ("Currency:", CURRENCY),
        ]
        for label, value in details:
            self.set_x(105)
            self.set_font("Helvetica", "B", 8)
            self.cell(30, 5, label)
            self.set_font("Helvetica", "", 8)
            self.cell(60, 5, value)
            self.ln()

        self.set_y(max(y_end, self.get_y()) + 4)
        self.set_draw_color(0, 51, 153)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(6)

    def footer(self):
        self.set_y(-20)
        self.set_draw_color(0, 51, 153)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(3)
        self.set_font("Helvetica", "", 7)
        self.set_text_color(0, 0, 0)
        self.cell(95, 4, 'The National Bank of Ras Al Khaimah (P.S.C) (the "Bank" or')
        self.cell(95, 4, f"Page [{self.current_page_num}] of [{self.total_pages}]", align="R")
        self.ln()
        self.cell(0, 4, '"RAKBANK"), is a commercial bank regulated and licensed by the')
        self.ln()
        self.cell(0, 4, "Central Bank of the UAE.")

    def draw_summary_page(self, opening_bal, total_deposits, total_withdrawals, fees, closing_bal):
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(0, 51, 153)
        self.cell(95, 8, "Account Summary")
        self.ln(10)

        self.set_text_color(0, 0, 0)
        self.set_font("Helvetica", "", 9)

        items = [
            ("Opening Balance", f"AED  {opening_bal:,.2f}Cr"),
            ("Total Deposits", f"AED  {total_deposits:,.2f}"),
            ("Total Withdrawals", f"AED  {total_withdrawals:,.2f}"),
            ("Total Fees and Charges\n(Incl. VAT)", f"AED  {fees:,.2f}"),
            ("Overdue Charges (incl.\nVAT)", "AED  0.00"),
            ("Closing Balance", f"AED  {closing_bal:,.2f}Cr"),
        ]

        for label, value in items:
            lines = label.split("\n")
            self.cell(55, 6, lines[0])
            self.cell(50, 6, value)
            self.ln()
            if len(lines) > 1:
                self.cell(55, 5, lines[1])
                self.ln()
            self.ln(2)

        self.ln(5)
        self.set_font("Helvetica", "B", 9)
        self.cell(0, 6, "Your Account Interest Rates", new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "", 9)
        self.cell(55, 6, "Accrued Interest:")
        self.cell(50, 6, "AED 0.00")
        self.ln()
        self.cell(55, 6, "Interest Rate(p.a.):")
        self.cell(50, 6, "0.00%")
        self.ln()
        self.cell(55, 6, "Interest Type:")
        self.cell(50, 6, "Fixed")
        self.ln(10)
        self.set_font("Helvetica", "B", 8)
        self.cell(0, 6, "Please see the last page of this statement for important information.", new_x="LMARGIN", new_y="NEXT")

    def draw_transaction_header(self):
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(0, 51, 153)
        self.cell(0, 8, "Your Current Account Transactions", new_x="LMARGIN", new_y="NEXT")
        self.ln(3)
        self.set_text_color(0, 0, 0)
        self.set_font("Helvetica", "B", 8)
        self.cell(22, 6, "Date", border="B")
        self.cell(62, 6, "Description", border="B")
        self.cell(20, 6, "Cheque", border="B", align="C")
        self.cell(28, 6, "Withdrawal", border="B", align="R")
        self.cell(28, 6, "Deposit", border="B", align="R")
        self.cell(30, 6, "Balance", border="B", align="R")
        self.ln()

    def draw_transaction_row(self, txn):
        self.set_font("Helvetica", "", 7.5)
        self.set_text_color(0, 0, 0)
        desc_lines = txn["desc"].split("\n")
        row_height = 4.5

        self.cell(22, row_height, txn["date"])
        self.cell(62, row_height, desc_lines[0][:40])
        self.cell(20, row_height, txn["cheque"], align="C")
        self.cell(28, row_height, txn["withdrawal"], align="R")
        self.cell(28, row_height, txn["deposit"], align="R")
        self.cell(30, row_height, txn["balance"], align="R")
        self.ln()

        for line in desc_lines[1:]:
            self.cell(22, row_height, "")
            self.cell(62, row_height, line[:40])
            self.ln()

        self.set_draw_color(200, 200, 200)
        self.set_line_width(0.1)
        self.line(10, self.get_y(), 200, self.get_y())

    def draw_important_info(self):
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(0, 51, 153)
        self.cell(0, 10, "Important Information", new_x="LMARGIN", new_y="NEXT")
        self.ln(4)
        self.set_text_color(0, 0, 0)
        self.set_font("Helvetica", "B", 9)
        self.cell(0, 6, "Interest rate: ", new_x="END")
        self.set_font("Helvetica", "", 9)
        self.multi_cell(0, 5, "Interest rate is applied to your account based on the\nbalances maintained in your account.")
        self.ln(4)
        self.set_font("Helvetica", "", 9)
        self.multi_cell(0, 5, "For detailed description of charges, please refer service and price\nguide section on our website www.rakbank.ae")
        self.ln(4)
        self.multi_cell(0, 5, "If you have any questions or concerns about this statement, please\ncontact us within 30 days of its issue date. If we do not hear from\nyou within 30 days, this statement will be considered final.")
        self.ln(6)
        self.set_font("Helvetica", "B", 9)
        self.cell(0, 6, "Get in touch", new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "", 9)
        self.cell(0, 5, "For queries and feedback, email contactus@rakbank.ae", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 5, "For complaints, email complaints@rakbank.ae", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 5, "Call 04 2130000 or chat with us at www.rakbank.ae", new_x="LMARGIN", new_y="NEXT")
        self.ln(3)
        self.cell(0, 5, "We aim to respond to your emails within one working day.", new_x="LMARGIN", new_y="NEXT")


def generate_monthly_statement(month_idx, opening_bal):
    month_name, year, num_days, start_date, end_date, issue_date = MONTHS_DATA[month_idx]

    txns, closing_bal, tot_dep, tot_wd, fees, tot_cash = generate_month_transactions(
        month_name, year, num_days, month_idx, opening_bal)

    pdf = RAKStatement(month_name, year, start_date, end_date, issue_date)
    pdf.set_auto_page_break(auto=False)

    # Page 1: Summary
    pdf.add_page()
    pdf.draw_summary_page(opening_bal, tot_dep, tot_wd, fees, closing_bal)

    # Transaction pages
    pdf.add_page()
    pdf.draw_transaction_header()

    for txn in txns:
        desc_lines = txn["desc"].split("\n")
        needed_height = 4.5 * len(desc_lines) + 2
        if pdf.get_y() + needed_height > 260:
            pdf.add_page()
            pdf.draw_transaction_header()
        pdf.draw_transaction_row(txn)

    # Last page: Important Info
    pdf.add_page()
    pdf.draw_important_info()

    pdf.total_pages = pdf.current_page_num

    filename = f"ENCORE_CLACK_{month_name[:3]}-{year}_statement.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)
    pdf.output(filepath)

    return filepath, closing_bal, tot_dep, tot_wd, tot_cash


def main():
    print("Generating 12 monthly RAK Bank statements for ENCORE CLACK...")
    print(f"IBAN: {IBAN}")
    print(f"Output: {OUTPUT_DIR}\n")

    opening_bal = 485632.50
    total_revenue = 0
    total_cash = 0
    total_expenses = 0

    print(f"{'#':<3} {'Month':<15} {'Opening':>12} {'Deposits':>14} {'Withdrawals':>14} {'Closing':>14}")
    print("-" * 80)

    for i in range(12):
        filepath, closing_bal, deposits, withdrawals, cash = generate_monthly_statement(i, opening_bal)
        total_revenue += deposits
        total_cash += cash
        total_expenses += withdrawals

        month_name = MONTHS_DATA[i][0]
        year = MONTHS_DATA[i][1]

        print(f"{i+1:<3} {month_name} {year:<8} {opening_bal:>12,.2f} {deposits:>14,.2f} {withdrawals:>14,.2f} {closing_bal:>14,.2f}")
        opening_bal = closing_bal

    # Summary metrics
    cash_pct = (total_cash / total_revenue) * 100
    annual_net_margin = total_revenue - total_expenses
    monthly_net_margin = annual_net_margin / 12
    
    # DBR from bureau perspective:
    # Bureau debt obligation is external (~210k/month based on DBR=84% with old 250k margin)
    # What matters is the monthly net margin from the statement
    # DBR = bureau_debt / monthly_net_margin
    # With ~1.4M monthly net margin, even 210k bureau debt => 15% DBR
    
    bureau_debt_assumed = 210000.0  # This comes from bureau, shown here for reference
    dbr_estimated = (bureau_debt_assumed / monthly_net_margin) * 100

    print(f"\n{'='*70}")
    print(f"  ENCORE CLACK - 12 Month Financial Summary")
    print(f"{'='*70}")
    print(f"  Annual Revenue (Deposits):   AED {total_revenue:,.2f}")
    print(f"  Annual Expenses:             AED {total_expenses:,.2f}")
    print(f"  Annual Net Margin:           AED {annual_net_margin:,.2f}")
    print(f"  Monthly Net Margin (avg):    AED {monthly_net_margin:,.2f}")
    print(f"{'='*70}")
    print(f"  Cash Deposits:               AED {total_cash:,.2f}")
    print(f"  Cash %:                      {cash_pct:.1f}%  (target: <10%) {'OK' if cash_pct < 10 else 'FAIL'}")
    print(f"{'='*70}")
    print(f"  Monthly Net Margin:          AED {monthly_net_margin:,.2f}")
    print(f"  Estimated DBR (bureau=210k): {dbr_estimated:.1f}%  (target: <20%) {'OK' if dbr_estimated < 20 else 'FAIL'}")
    print(f"{'='*70}")
    print(f"  Revenue > 15M:               {'OK' if total_revenue > 15000000 else 'FAIL'} ({total_revenue:,.0f})")
    print(f"{'='*70}")


if __name__ == "__main__":
    main()
