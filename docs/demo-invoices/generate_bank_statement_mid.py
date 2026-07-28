"""
Generate 12 monthly bank statements for ENCORE CLACK - MID scenario (v2).
RAK Bank format. Same IBAN and business name.

KEY INSIGHT: App counts only ELECTRONIC deposits as "Annual Revenue".
Cash deposits are excluded from revenue calculation.

Targets:
  - Annual Revenue (electronic deposits only): 4,000,000 - 4,500,000 AED
  - Cash Transactions < 40% of TOTAL deposits
  - DBR < 40%: bureau_debt / monthly_net_margin
    Monthly Net Margin = (total_deposits - total_withdrawals) / 12
  - DSCR > 2

Design:
  - Electronic deposits: ~4,250,000/year (~354k/month)
  - Cash deposits: ~2,300,000/year (~192k/month) => 35% of total 6.55M
  - Total withdrawals: ~30,000/year (~2,500/month) - MINIMAL expenses visible
  - Monthly Net Margin = (6,550,000 - 30,000)/12 = ~543,000
  - With bureau debt ~210k: DBR = 210k/543k = 38.7% (<40% OK)
  - DSCR = (6,550,000-30,000)/(210,000*12) = 6,520,000/2,520,000 = 2.59 (>2 OK)
"""
from fpdf import FPDF
import os
import random

random.seed(55)

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "bank-statements-mid")
os.makedirs(OUTPUT_DIR, exist_ok=True)

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

CLIENTS = [
    "NEXGEN BUILDING SOLUTIONS LLC", "GULF STAR CONSTRUCTION ENGI",
    "PLATINUM CONTRACTING LLC", "AL RAHA ENGINEERING SERVICES",
    "CRESCENT INFRASTRUCTURE FZE", "HORIZON TECHNICAL SERVICES",
    "SKYLINE DEVELOPMENTS LLC", "OASIS FACILITIES MANAGEMENT",
]
BANKS = ["ADCB AUH", "EIB DXB", "CBD DXB", "ENBD DXB"]


def generate_month_transactions(month_name, year, num_days, month_idx, opening_bal):
    """Electronic deposits ~354k, cash ~192k, withdrawals ~2.5k."""
    abbr = MONTH_ABBR[month_name]
    all_txns = []

    # === ELECTRONIC DEPOSITS (~354,000/month) ===
    elec_target = random.uniform(345000, 365000)
    num_elec = random.randint(5, 8)
    elec_remaining = elec_target
    for i in range(num_elec):
        if i == num_elec - 1:
            amt = round(elec_remaining, 2)
        else:
            amt = round(random.uniform(25000, 80000), 2)
            amt = min(amt, elec_remaining - (num_elec - i - 1) * 15000)
            elec_remaining -= amt
        day = random.randint(2, num_days - 1)
        client = random.choice(CLIENTS)
        ref = f"SMEI-{random.randint(10000000, 99999999)}-SYSTECH"
        all_txns.append({
            "day": day,
            "desc": f"INWARD T/T\n{client}\n/REF/{ref}",
            "cheque": "", "withdrawal": 0, "deposit": amt, "is_cash": False
        })

    # 1 cheque deposit
    chq_amt = round(random.uniform(10000, 25000), 2)
    all_txns.append({
        "day": random.randint(5, num_days - 5),
        "desc": f"CHEQUE DEPOSIT\n00{random.randint(5000,9999)} {random.choice(BANKS)}",
        "cheque": "", "withdrawal": 0, "deposit": chq_amt, "is_cash": False
    })

    # === CASH DEPOSITS ===
    # App calculates Cash% = cash_deposits / electronic_deposits * 100
    # Target: < 40%, so cash < 0.38 * electronic (~355k) = ~135k/month
    # But need enough total deposits for net margin > 525k/month
    # Need total > 6.3M/year => cash needs to be ~160k/month
    cash_target = random.uniform(155000, 175000)
    num_cash = random.randint(2, 4)
    for i in range(num_cash):
        amt = round(cash_target / num_cash * random.uniform(0.8, 1.2), 2)
        day = random.randint(3, num_days - 3)
        atm_ref = f"500{random.randint(100000000, 999999999)}"
        all_txns.append({
            "day": day,
            "desc": f"ATM CASH DEPOSIT\n{atm_ref} {day:02d}-{month_idx+1:02d}-{year} {random.randint(9,18)}:{random.randint(10,59)}\nAl Quoz Branch 0892",
            "cheque": "", "withdrawal": 0, "deposit": amt, "is_cash": True
        })

    # === WITHDRAWALS (minimal) ===
    # Monthly maintenance fee only
    all_txns.append({
        "day": 2,
        "desc": "CHARGE COLLECTION-INCL. VAT\nBUSBNK_MAINT_FEE_CHRG",
        "cheque": "", "withdrawal": 103.95, "deposit": 0, "is_cash": False
    })

    # 1 small bank charge
    all_txns.append({
        "day": random.randint(5, num_days - 5),
        "desc": f"CHARGE COLLECTION - INCL VAT\nREF:18{random.randint(1000000, 9999999)}",
        "cheque": "", "withdrawal": 3.15, "deposit": 0, "is_cash": False
    })

    # Sort
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
    total_electronic = total_deposits - total_cash
    fees = sum(t["withdrawal_val"] for t in formatted_txns if "CHARGE COLLECTION" in t["desc"])

    return formatted_txns, bal, total_deposits, total_withdrawals, fees, total_cash, total_electronic


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
        for label, value in [("Date Issued:", self.issue_date), ("Statement Period:", f"{self.start_date} to {self.end_date}"), ("Account Type:", ACCOUNT_TYPE), ("Account Number:", ACCOUNT_NUMBER), ("IBAN:", IBAN), ("Branch:", BRANCH), ("Currency:", CURRENCY)]:
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
        self.cell(0, 4, '"RAKBANK"), is a commercial bank regulated and licensed by the Central Bank of the UAE.')

    def draw_summary_page(self, opening_bal, total_deposits, total_withdrawals, fees, closing_bal):
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(0, 51, 153)
        self.cell(95, 8, "Account Summary")
        self.ln(10)
        self.set_text_color(0, 0, 0)
        self.set_font("Helvetica", "", 9)
        for label, value in [("Opening Balance", f"AED  {opening_bal:,.2f}Cr"), ("Total Deposits", f"AED  {total_deposits:,.2f}"), ("Total Withdrawals", f"AED  {total_withdrawals:,.2f}"), ("Total Fees and Charges\n(Incl. VAT)", f"AED  {fees:,.2f}"), ("Overdue Charges (incl.\nVAT)", "AED  0.00"), ("Closing Balance", f"AED  {closing_bal:,.2f}Cr")]:
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
        self.cell(55, 6, "Accrued Interest:"); self.cell(50, 6, "AED 0.00"); self.ln()
        self.cell(55, 6, "Interest Rate(p.a.):"); self.cell(50, 6, "0.00%"); self.ln()
        self.cell(55, 6, "Interest Type:"); self.cell(50, 6, "Fixed"); self.ln(10)
        self.set_font("Helvetica", "B", 8)
        self.cell(0, 6, "Please see the last page of this statement for important information.")

    def draw_transaction_header(self):
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(0, 51, 153)
        self.cell(0, 8, "Your Current Account Transactions", new_x="LMARGIN", new_y="NEXT")
        self.ln(3)
        self.set_text_color(0, 0, 0)
        self.set_font("Helvetica", "B", 8)
        self.cell(22, 6, "Date", border="B"); self.cell(62, 6, "Description", border="B"); self.cell(20, 6, "Cheque", border="B", align="C"); self.cell(28, 6, "Withdrawal", border="B", align="R"); self.cell(28, 6, "Deposit", border="B", align="R"); self.cell(30, 6, "Balance", border="B", align="R"); self.ln()

    def draw_transaction_row(self, txn):
        self.set_font("Helvetica", "", 7.5)
        self.set_text_color(0, 0, 0)
        desc_lines = txn["desc"].split("\n")
        h = 4.5
        self.cell(22, h, txn["date"]); self.cell(62, h, desc_lines[0][:40]); self.cell(20, h, txn["cheque"], align="C"); self.cell(28, h, txn["withdrawal"], align="R"); self.cell(28, h, txn["deposit"], align="R"); self.cell(30, h, txn["balance"], align="R"); self.ln()
        for line in desc_lines[1:]:
            self.cell(22, h, ""); self.cell(62, h, line[:40]); self.ln()
        self.set_draw_color(200, 200, 200); self.set_line_width(0.1); self.line(10, self.get_y(), 200, self.get_y())

    def draw_important_info(self):
        self.set_font("Helvetica", "B", 12); self.set_text_color(0, 51, 153)
        self.cell(0, 10, "Important Information", new_x="LMARGIN", new_y="NEXT"); self.ln(4)
        self.set_text_color(0, 0, 0); self.set_font("Helvetica", "", 9)
        self.multi_cell(0, 5, "Interest rate is applied to your account based on the balances maintained in your account.\n\nFor detailed description of charges, please refer service and price guide section on our website www.rakbank.ae\n\nIf you have any questions or concerns about this statement, please contact us within 30 days of its issue date. If we do not hear from you within 30 days, this statement will be considered final.\n\nGet in touch\nFor queries and feedback, email contactus@rakbank.ae\nFor complaints, email complaints@rakbank.ae\nCall 04 2130000 or chat with us at www.rakbank.ae")


def generate_monthly_statement(month_idx, opening_bal):
    month_name, year, num_days, start_date, end_date, issue_date = MONTHS_DATA[month_idx]
    txns, closing_bal, tot_dep, tot_wd, fees, tot_cash, tot_elec = generate_month_transactions(
        month_name, year, num_days, month_idx, opening_bal)
    pdf = RAKStatement(month_name, year, start_date, end_date, issue_date)
    pdf.set_auto_page_break(auto=False)
    pdf.add_page(); pdf.draw_summary_page(opening_bal, tot_dep, tot_wd, fees, closing_bal)
    pdf.add_page(); pdf.draw_transaction_header()
    for txn in txns:
        desc_lines = txn["desc"].split("\n")
        if pdf.get_y() + 4.5 * len(desc_lines) + 2 > 260:
            pdf.add_page(); pdf.draw_transaction_header()
        pdf.draw_transaction_row(txn)
    pdf.add_page(); pdf.draw_important_info()
    pdf.total_pages = pdf.current_page_num
    filename = f"ENCORE_CLACK_{month_name[:3]}-{year}_statement.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)
    pdf.output(filepath)
    return filepath, closing_bal, tot_dep, tot_wd, tot_cash, tot_elec


def main():
    print("Generating 12 monthly MID-TIER v2 statements for ENCORE CLACK...")
    print(f"IBAN: {IBAN}")
    print(f"Output: {OUTPUT_DIR}\n")

    opening_bal = 125480.50
    total_deposits = 0; total_cash = 0; total_electronic = 0; total_expenses = 0

    print(f"{'#':<3} {'Month':<15} {'Electronic':>12} {'Cash':>10} {'Withdrawals':>12} {'Closing':>14}")
    print("-" * 75)

    for i in range(12):
        filepath, closing_bal, deposits, withdrawals, cash, electronic = generate_monthly_statement(i, opening_bal)
        total_deposits += deposits; total_cash += cash; total_electronic += electronic; total_expenses += withdrawals
        month_name = MONTHS_DATA[i][0]; year = MONTHS_DATA[i][1]
        print(f"{i+1:<3} {month_name} {year:<8} {electronic:>12,.2f} {cash:>10,.2f} {withdrawals:>12,.2f} {closing_bal:>14,.2f}")
        opening_bal = closing_bal

    cash_pct = (total_cash / total_deposits) * 100
    annual_net_margin = total_deposits - total_expenses
    monthly_net_margin = annual_net_margin / 12
    bureau_debt = 210000.0
    dbr = (bureau_debt / monthly_net_margin) * 100
    dscr = annual_net_margin / (bureau_debt * 12)

    print(f"\n{'='*70}")
    print(f"  ENCORE CLACK - MID-TIER v2 - 12 Month Summary")
    print(f"{'='*70}")
    print(f"  Annual Revenue (electronic): AED {total_electronic:,.2f}")
    print(f"  Total Deposits (all):        AED {total_deposits:,.2f}")
    print(f"  Total Cash Deposits:         AED {total_cash:,.2f}")
    print(f"  Total Withdrawals:           AED {total_expenses:,.2f}")
    print(f"  Annual Net Margin:           AED {annual_net_margin:,.2f}")
    print(f"  Monthly Net Margin:          AED {monthly_net_margin:,.2f}")
    print(f"{'='*70}")
    print(f"  Revenue 4-4.5M (electronic): {'OK' if 4000000 <= total_electronic <= 4500000 else 'FAIL'} (AED {total_electronic:,.0f})")
    print(f"  Cash %:                      {cash_pct:.1f}%  (target: <40%) {'OK' if cash_pct < 40 else 'FAIL'}")
    print(f"  DBR (bureau=210k):           {dbr:.1f}%  (target: <40%) {'OK' if dbr < 40 else 'FAIL'}")
    print(f"  DSCR:                        {dscr:.2f}  (target: >2) {'OK' if dscr > 2 else 'FAIL'}")
    print(f"{'='*70}")


if __name__ == "__main__":
    main()
