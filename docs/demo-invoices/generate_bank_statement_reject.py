"""
Generate 12 monthly bank statements for ENCORE CLACK - REJECTION scenario.
RAK Bank format. Same IBAN and business name.

Company: ENCORE CLACK
IBAN: AE350030012285049920002
Period: June 2025 - May 2026

REJECTION CRITERIA (all must fail):
  - DBR > 80%  (high debt burden relative to income)
  - Cash Transactions > 70% of total deposits
  - DSCR < 0.8 (cannot cover debt service)
  - Annual Revenue < AED 100,000

Design:
  - Annual Revenue (total deposits): ~90,000 AED (~7,500/month)
  - Cash deposits: ~75% of total (~5,600/month cash, ~1,900 electronic)
  - Monthly expenses: ~7,000 (barely break-even or slight loss)
  - Monthly Net Margin: ~500 AED
  - Bureau debt ~210,000/month => DBR = 210,000/500 = 42,000% (way over 80%)
    Actually with such low net margin even a small bureau debt gives huge DBR.
    Let's target net margin ~250/month => DBR with bureau debt of even 1000 = 400%
  - DSCR = annual_net_margin / annual_debt_service
    If net margin = 3,000/year and debt service = 12,000/year => DSCR = 0.25 (<0.8)
"""
from fpdf import FPDF
import os
import random

random.seed(77)

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "bank-statements-reject")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Company details (same as passing scenario)
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

PAYEES = [
    "MOHAMMED ALI HASSAN", "ABDUL BASITH", "IMAD EL KHOURY",
    "JAILANI BASHEER", "AHMAD FAROUK SALEM",
]


def generate_month_transactions(month_name, year, num_days, month_idx, opening_bal):
    """Generate transactions for a low-revenue, cash-heavy month.
    Target: ~7,500 deposits (75%+ cash), ~7,200 withdrawals, net ~300.
    """
    abbr = MONTH_ABBR[month_name]
    all_txns = []

    # === DEPOSITS ===
    # Total target: ~7,000-8,000/month, 75%+ must be cash
    target_deposits = random.uniform(7000, 8500)
    cash_ratio = random.uniform(0.72, 0.80)
    cash_amount = target_deposits * cash_ratio
    electronic_amount = target_deposits - cash_amount

    # Cash deposits (ATM) - 2-4 small deposits
    num_cash = random.randint(2, 4)
    for i in range(num_cash):
        if i == num_cash - 1:
            amt = round(cash_amount - sum(t["deposit"] for t in all_txns if t.get("is_cash")), 2)
        else:
            amt = round(cash_amount / num_cash * random.uniform(0.7, 1.3), 2)
        day = random.randint(3, num_days - 3)
        atm_ref = f"500{random.randint(100000000, 999999999)}"
        all_txns.append({
            "day": day,
            "desc": f"ATM CASH DEPOSIT\n{atm_ref} {day:02d}-{month_idx+1:02d}-{year} {random.randint(9,20)}:{random.randint(10,59)}\nAl Quoz Branch 0892",
            "cheque": "", "withdrawal": 0, "deposit": max(amt, 500), "is_cash": True
        })

    # 1 small electronic deposit (INWARD T/T or CHEQUE DEPOSIT)
    if electronic_amount > 500:
        day = random.randint(5, num_days - 5)
        all_txns.append({
            "day": day,
            "desc": f"INWARD T/T\nSMALL CLIENT PAYMENT\n/REF/SMEI-{random.randint(10000, 99999)}",
            "cheque": "", "withdrawal": 0, "deposit": round(electronic_amount, 2), "is_cash": False
        })

    # === WITHDRAWALS ===
    # Target: slightly less than deposits (net margin ~300-500)
    total_dep = sum(t["deposit"] for t in all_txns)
    target_withdrawals = total_dep - random.uniform(200, 500)

    # Rent payment (largest expense)
    rent = round(random.uniform(2500, 3500), 2)
    all_txns.append({
        "day": random.randint(1, 5),
        "desc": f"AANI TO {random.choice(PAYEES)}\n1.0000\n18{random.randint(1000000, 9999999)}",
        "cheque": "", "withdrawal": rent, "deposit": 0, "is_cash": False
    })

    # Utility/telecom
    utility = round(random.uniform(300, 600), 2)
    all_txns.append({
        "day": random.randint(5, 15),
        "desc": f"AANI TO DEWA PAYMENT\n1.0000\n18{random.randint(1000000, 9999999)}",
        "cheque": "", "withdrawal": utility, "deposit": 0, "is_cash": False
    })

    # Small miscellaneous withdrawals
    remaining_wd = target_withdrawals - rent - utility - 103.95
    num_misc = random.randint(2, 4)
    for _ in range(num_misc):
        amt = round(remaining_wd / num_misc * random.uniform(0.6, 1.4), 2)
        amt = max(amt, 100)
        day = random.randint(3, num_days - 2)
        desc_choices = [
            f"OUTWARD T/T\n{random.choice(PAYEES)}\n1.00",
            "CLG CHQ.DRAWN",
            f"AANI TO {random.choice(PAYEES)}\n1.0000\n18{random.randint(1000000, 9999999)}",
        ]
        all_txns.append({
            "day": day,
            "desc": random.choice(desc_choices),
            "cheque": f"001{random.randint(200,399)}" if "CLG" in desc_choices[1] else "",
            "withdrawal": amt, "deposit": 0, "is_cash": False
        })

    # Monthly maintenance fee
    all_txns.append({
        "day": 2,
        "desc": "CHARGE COLLECTION-INCL. VAT\nBUSBNK_MAINT_FEE_CHRG",
        "cheque": "", "withdrawal": 103.95, "deposit": 0, "is_cash": False
    })

    # Sort by day
    all_txns.sort(key=lambda t: t["day"])

    # Calculate running balance
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
            "cheque": t.get("cheque", ""),
            "withdrawal": f"{t['withdrawal']:,.2f}" if t["withdrawal"] > 0 else "",
            "deposit": f"{t['deposit']:,.2f}" if t["deposit"] > 0 else "",
            "balance": bal_str,
            "is_cash": t.get("is_cash", False),
            "deposit_val": t["deposit"],
            "withdrawal_val": t["withdrawal"],
        })

    total_deposits = sum(t["deposit_val"] for t in formatted_txns)
    total_withdrawals = sum(t["withdrawal_val"] for t in formatted_txns)
    total_cash = sum(t["deposit_val"] for t in formatted_txns if t["is_cash"])
    fees = sum(t["withdrawal_val"] for t in formatted_txns if "CHARGE COLLECTION" in t["desc"])

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

    pdf.add_page()
    pdf.draw_summary_page(opening_bal, tot_dep, tot_wd, fees, closing_bal)

    pdf.add_page()
    pdf.draw_transaction_header()
    for txn in txns:
        desc_lines = txn["desc"].split("\n")
        needed_height = 4.5 * len(desc_lines) + 2
        if pdf.get_y() + needed_height > 260:
            pdf.add_page()
            pdf.draw_transaction_header()
        pdf.draw_transaction_row(txn)

    pdf.add_page()
    pdf.draw_important_info()

    pdf.total_pages = pdf.current_page_num
    filename = f"ENCORE_CLACK_{month_name[:3]}-{year}_statement.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)
    pdf.output(filepath)
    return filepath, closing_bal, tot_dep, tot_wd, tot_cash


def main():
    print("Generating 12 monthly REJECTION statements for ENCORE CLACK...")
    print(f"IBAN: {IBAN}")
    print(f"Output: {OUTPUT_DIR}\n")

    opening_bal = 3250.75  # Low starting balance
    total_revenue = 0
    total_cash = 0
    total_expenses = 0

    print(f"{'#':<3} {'Month':<15} {'Opening':>10} {'Deposits':>10} {'Withdrawals':>12} {'Closing':>10}")
    print("-" * 68)

    for i in range(12):
        filepath, closing_bal, deposits, withdrawals, cash = generate_monthly_statement(i, opening_bal)
        total_revenue += deposits
        total_cash += cash
        total_expenses += withdrawals

        month_name = MONTHS_DATA[i][0]
        year = MONTHS_DATA[i][1]
        print(f"{i+1:<3} {month_name} {year:<8} {opening_bal:>10,.2f} {deposits:>10,.2f} {withdrawals:>12,.2f} {closing_bal:>10,.2f}")
        opening_bal = closing_bal

    # Metrics
    cash_pct = (total_cash / total_revenue) * 100
    annual_net_margin = total_revenue - total_expenses
    monthly_net_margin = annual_net_margin / 12

    # With bureau debt of 210k/month, DBR would be astronomical
    bureau_debt = 210000.0
    dbr = (bureau_debt / monthly_net_margin) * 100 if monthly_net_margin > 0 else 99999

    # DSCR = annual net margin / annual debt service
    annual_debt_service = bureau_debt * 12
    dscr = annual_net_margin / annual_debt_service if annual_debt_service > 0 else 0

    print(f"\n{'='*70}")
    print(f"  ENCORE CLACK - REJECTION SCENARIO - 12 Month Summary")
    print(f"{'='*70}")
    print(f"  Annual Revenue:              AED {total_revenue:,.2f}")
    print(f"  Annual Expenses:             AED {total_expenses:,.2f}")
    print(f"  Annual Net Margin:           AED {annual_net_margin:,.2f}")
    print(f"  Monthly Net Margin (avg):    AED {monthly_net_margin:,.2f}")
    print(f"{'='*70}")
    print(f"  Cash Deposits:               AED {total_cash:,.2f}")
    print(f"  Cash %:                      {cash_pct:.1f}%  (target: >70%) {'OK' if cash_pct > 70 else 'FAIL'}")
    print(f"{'='*70}")
    print(f"  Revenue < 100k:              {'OK' if total_revenue < 100000 else 'FAIL'} (AED {total_revenue:,.0f})")
    print(f"  DBR (bureau=210k):           {dbr:.0f}%  (target: >80%) {'OK' if dbr > 80 else 'FAIL'}")
    print(f"  DSCR:                        {dscr:.4f}  (target: <0.8) {'OK' if dscr < 0.8 else 'FAIL'}")
    print(f"{'='*70}")


if __name__ == "__main__":
    main()
