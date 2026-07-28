"""
Generate 12 monthly bank statements for ENCORE CLACK - 40M+ revenue scenario.
RAK Bank format. Same IBAN and business name.

Criteria (from previous calibration + new revenue target):
  - Annual Revenue (electronic deposits) > AED 40,000,000
  - Cash Transactions < 40% (cash/electronic ratio)
  - DBR < 40% (bureau debt ~210k / monthly net margin)
  - DSCR > 2

Design:
  - Electronic deposits: ~3,500,000/month (annual ~42M)
  - Cash deposits: ~35% of electronic = ~1,225,000/month
  - Total deposits: ~4,725,000/month
  - Withdrawals: minimal ~2,000/month
  - Monthly Net Margin = (4,725,000 - 2,000) = ~4,723,000
  - DBR = 210,000 / 4,723,000 = 4.4% (way under 40%)
  - Cash% = 1,225,000 / 3,500,000 = 35% (<40%)
  - DSCR = 56,676,000 / 2,520,000 = 22.5 (>2)
"""
from fpdf import FPDF
import os
import random

random.seed(123)

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "bank-statements-40m")
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
    "BLUESTONE CONSTRUCTION LLC", "ZENITH ENGINEERING SERVICES",
    "PALM TOWER DEVELOPMENTS", "EMERALD BAY CONTRACTING",
    "TITAN INFRASTRUCTURE GROUP", "FALCON STEEL FABRICATION",
    "DESERT ROSE INTERIORS LLC",
]
BANKS = ["ADCB AUH", "EIB DXB", "CBD DXB", "ENBD DXB", "FAB AUH"]


def generate_month_transactions(month_name, year, num_days, month_idx, opening_bal):
    """Electronic ~3.5M, cash ~1.2M (35%), withdrawals minimal."""
    abbr = MONTH_ABBR[month_name]
    all_txns = []

    # Electronic deposits ~3,500,000/month
    elec_target = random.uniform(3400000, 3600000)
    num_elec = random.randint(12, 18)
    elec_remaining = elec_target
    for i in range(num_elec):
        if i == num_elec - 1:
            amt = round(elec_remaining, 2)
        else:
            amt = round(random.uniform(100000, 400000), 2)
            amt = min(amt, elec_remaining - (num_elec - i - 1) * 50000)
            elec_remaining -= amt
        day = random.randint(2, num_days - 1)
        client = random.choice(CLIENTS)
        ref = f"SMEI-{random.randint(10000000, 99999999)}-SYSTECH"
        all_txns.append({
            "day": day, "desc": f"INWARD T/T\n{client}\n/REF/{ref}",
            "cheque": "", "withdrawal": 0, "deposit": amt, "is_cash": False
        })

    # Cheque deposits (part of electronic)
    for _ in range(random.randint(2, 4)):
        amt = round(random.uniform(50000, 150000), 2)
        day = random.randint(3, num_days - 3)
        all_txns.append({
            "day": day, "desc": f"CHEQUE DEPOSIT\n00{random.randint(5000,9999)} {random.choice(BANKS)}",
            "cheque": "", "withdrawal": 0, "deposit": amt, "is_cash": False
        })

    # Cash deposits (~35% of electronic = ~1,225,000)
    cash_target = elec_target * random.uniform(0.33, 0.37)
    num_cash = random.randint(5, 8)
    for i in range(num_cash):
        amt = round(cash_target / num_cash * random.uniform(0.8, 1.2), 2)
        day = random.randint(3, num_days - 3)
        atm_ref = f"500{random.randint(100000000, 999999999)}"
        all_txns.append({
            "day": day, "desc": f"ATM CASH DEPOSIT\n{atm_ref} {day:02d}-{month_idx+1:02d}-{year} {random.randint(9,18)}:{random.randint(10,59)}\nAl Quoz Branch 0892",
            "cheque": "", "withdrawal": 0, "deposit": amt, "is_cash": True
        })

    # Minimal withdrawals
    all_txns.append({"day": 2, "desc": "CHARGE COLLECTION-INCL. VAT\nBUSBNK_MAINT_FEE_CHRG",
        "cheque": "", "withdrawal": 103.95, "deposit": 0, "is_cash": False})
    all_txns.append({"day": random.randint(5, 15),
        "desc": f"CHARGE COLLECTION - INCL VAT\nREF:18{random.randint(1000000,9999999)}",
        "cheque": "", "withdrawal": 3.15, "deposit": 0, "is_cash": False})

    all_txns.sort(key=lambda t: t["day"])

    bal = opening_bal
    formatted_txns = []
    for t in all_txns:
        if t["deposit"] > 0: bal += t["deposit"]
        else: bal -= t["withdrawal"]
        formatted_txns.append({
            "date": f"{t['day']:02d}-{abbr}-{year}", "desc": t["desc"],
            "cheque": t.get("cheque", ""),
            "withdrawal": f"{t['withdrawal']:,.2f}" if t["withdrawal"] > 0 else "",
            "deposit": f"{t['deposit']:,.2f}" if t["deposit"] > 0 else "",
            "balance": f"{abs(bal):,.2f}{'Cr' if bal >= 0 else 'Dr'}",
            "is_cash": t.get("is_cash", False),
            "deposit_val": t["deposit"], "withdrawal_val": t["withdrawal"],
        })

    total_deposits = sum(t["deposit_val"] for t in formatted_txns)
    total_withdrawals = sum(t["withdrawal_val"] for t in formatted_txns)
    total_cash = sum(t["deposit_val"] for t in formatted_txns if t["is_cash"])
    total_electronic = total_deposits - total_cash
    fees = sum(t["withdrawal_val"] for t in formatted_txns if "CHARGE" in t["desc"])
    return formatted_txns, bal, total_deposits, total_withdrawals, fees, total_cash, total_electronic


class RAKStatement(FPDF):
    def __init__(self, month_name, year, start_date, end_date, issue_date):
        super().__init__()
        self.month_name = month_name; self.year = year
        self.start_date = start_date; self.end_date = end_date; self.issue_date = issue_date
        self.total_pages = 1; self.current_page_num = 0

    def header(self):
        self.current_page_num += 1
        self.set_font("Helvetica", "B", 11); self.set_text_color(0, 51, 153)
        self.cell(95, 6, "RAK BANK", align="L")
        self.set_font("Helvetica", "B", 12); self.cell(95, 6, "Your Bank Statement", align="R"); self.ln(8)
        self.set_draw_color(0, 51, 153); self.set_line_width(0.5); self.line(10, self.get_y(), 200, self.get_y()); self.ln(5)
        self.set_text_color(0, 0, 0); self.set_font("Helvetica", "B", 9)
        y_start = self.get_y()
        self.cell(95, 5, COMPANY, new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "", 8)
        for line in [PLOT, UNIT, STREET, CITY]:
            self.cell(95, 5, line, new_x="LMARGIN", new_y="NEXT")
        y_end = self.get_y()
        self.set_y(y_start)
        for label, value in [("Date Issued:", self.issue_date), ("Statement Period:", f"{self.start_date} to {self.end_date}"), ("Account Type:", ACCOUNT_TYPE), ("Account Number:", ACCOUNT_NUMBER), ("IBAN:", IBAN), ("Branch:", BRANCH), ("Currency:", CURRENCY)]:
            self.set_x(105); self.set_font("Helvetica", "B", 8); self.cell(30, 5, label)
            self.set_font("Helvetica", "", 8); self.cell(60, 5, value); self.ln()
        self.set_y(max(y_end, self.get_y()) + 4)
        self.set_draw_color(0, 51, 153); self.line(10, self.get_y(), 200, self.get_y()); self.ln(6)

    def footer(self):
        self.set_y(-20); self.set_draw_color(0, 51, 153); self.line(10, self.get_y(), 200, self.get_y()); self.ln(3)
        self.set_font("Helvetica", "", 7); self.set_text_color(0, 0, 0)
        self.cell(95, 4, 'The National Bank of Ras Al Khaimah (P.S.C) (the "Bank" or')
        self.cell(95, 4, f"Page [{self.current_page_num}] of [{self.total_pages}]", align="R")

    def draw_summary(self, opening, deposits, withdrawals, fees, closing):
        self.set_font("Helvetica", "B", 12); self.set_text_color(0, 51, 153)
        self.cell(95, 8, "Account Summary"); self.ln(10)
        self.set_text_color(0, 0, 0); self.set_font("Helvetica", "", 9)
        for label, val in [("Opening Balance", f"AED  {opening:,.2f}Cr"), ("Total Deposits", f"AED  {deposits:,.2f}"), ("Total Withdrawals", f"AED  {withdrawals:,.2f}"), ("Total Fees and Charges (Incl. VAT)", f"AED  {fees:,.2f}"), ("Overdue Charges (incl. VAT)", "AED  0.00"), ("Closing Balance", f"AED  {closing:,.2f}Cr")]:
            self.cell(60, 6, label); self.cell(50, 6, val); self.ln(); self.ln(1)
        self.ln(5); self.set_font("Helvetica", "B", 9)
        self.cell(0, 6, "Your Account Interest Rates", new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "", 9)
        self.cell(55, 6, "Accrued Interest:"); self.cell(50, 6, "AED 0.00"); self.ln()
        self.cell(55, 6, "Interest Rate(p.a.):"); self.cell(50, 6, "0.00%"); self.ln()
        self.cell(55, 6, "Interest Type:"); self.cell(50, 6, "Fixed")

    def draw_txn_header(self):
        self.set_font("Helvetica", "B", 11); self.set_text_color(0, 51, 153)
        self.cell(0, 8, "Your Current Account Transactions", new_x="LMARGIN", new_y="NEXT"); self.ln(3)
        self.set_text_color(0, 0, 0); self.set_font("Helvetica", "B", 8)
        self.cell(22, 6, "Date", border="B"); self.cell(62, 6, "Description", border="B")
        self.cell(20, 6, "Cheque", border="B", align="C"); self.cell(28, 6, "Withdrawal", border="B", align="R")
        self.cell(28, 6, "Deposit", border="B", align="R"); self.cell(30, 6, "Balance", border="B", align="R"); self.ln()

    def draw_txn_row(self, txn):
        self.set_font("Helvetica", "", 7.5); self.set_text_color(0, 0, 0)
        desc_lines = txn["desc"].split("\n"); h = 4.5
        self.cell(22, h, txn["date"]); self.cell(62, h, desc_lines[0][:40]); self.cell(20, h, txn["cheque"], align="C")
        self.cell(28, h, txn["withdrawal"], align="R"); self.cell(28, h, txn["deposit"], align="R")
        self.cell(30, h, txn["balance"], align="R"); self.ln()
        for line in desc_lines[1:]:
            self.cell(22, h, ""); self.cell(62, h, line[:40]); self.ln()
        self.set_draw_color(200, 200, 200); self.set_line_width(0.1); self.line(10, self.get_y(), 200, self.get_y())

    def draw_info(self):
        self.set_font("Helvetica", "B", 12); self.set_text_color(0, 51, 153)
        self.cell(0, 10, "Important Information", new_x="LMARGIN", new_y="NEXT"); self.ln(4)
        self.set_text_color(0, 0, 0); self.set_font("Helvetica", "", 9)
        self.multi_cell(0, 5, "Interest rate is applied to your account based on the balances maintained.\n\nFor charges, refer to www.rakbank.ae\n\nContact us within 30 days for any concerns. Otherwise this statement is final.\n\nGet in touch: contactus@rakbank.ae | complaints@rakbank.ae | 04 2130000")


def generate_statement(month_idx, opening_bal):
    month_name, year, num_days, start_date, end_date, issue_date = MONTHS_DATA[month_idx]
    txns, closing, deposits, withdrawals, fees, cash, electronic = generate_month_transactions(month_name, year, num_days, month_idx, opening_bal)
    pdf = RAKStatement(month_name, year, start_date, end_date, issue_date)
    pdf.set_auto_page_break(auto=False)
    pdf.add_page(); pdf.draw_summary(opening_bal, deposits, withdrawals, fees, closing)
    pdf.add_page(); pdf.draw_txn_header()
    for txn in txns:
        if pdf.get_y() + 4.5 * len(txn["desc"].split("\n")) + 2 > 260:
            pdf.add_page(); pdf.draw_txn_header()
        pdf.draw_txn_row(txn)
    pdf.add_page(); pdf.draw_info()
    pdf.total_pages = pdf.current_page_num
    filepath = os.path.join(OUTPUT_DIR, f"ENCORE_CLACK_{month_name[:3]}-{year}_statement.pdf")
    pdf.output(filepath)
    return filepath, closing, deposits, withdrawals, cash, electronic


def main():
    print("Generating 12 monthly statements (40M+ revenue)...")
    print(f"IBAN: {IBAN}\nOutput: {OUTPUT_DIR}\n")
    opening = 2850000.00
    tot_rev = 0; tot_cash = 0; tot_elec = 0; tot_exp = 0
    print(f"{'#':<3} {'Month':<15} {'Electronic':>14} {'Cash':>12} {'Closing':>16}")
    print("-" * 65)
    for i in range(12):
        _, closing, dep, wd, cash, elec = generate_statement(i, opening)
        tot_rev += dep; tot_cash += cash; tot_elec += elec; tot_exp += wd
        print(f"{i+1:<3} {MONTHS_DATA[i][0]} {MONTHS_DATA[i][1]:<6} {elec:>14,.2f} {cash:>12,.2f} {closing:>16,.2f}")
        opening = closing

    cash_pct = (tot_cash / tot_elec) * 100
    monthly_net = (tot_rev - tot_exp) / 12
    dbr = (210000 / monthly_net) * 100
    dscr = (tot_rev - tot_exp) / (210000 * 12)
    print(f"\n{'='*65}")
    print(f"  Revenue (electronic): AED {tot_elec:,.0f}  (target: >40M) {'OK' if tot_elec > 40000000 else 'FAIL'}")
    print(f"  Cash %:               {cash_pct:.1f}%  (target: <40%) {'OK' if cash_pct < 40 else 'FAIL'}")
    print(f"  DBR (bureau=210k):    {dbr:.1f}%  (target: <40%) {'OK' if dbr < 40 else 'FAIL'}")
    print(f"  DSCR:                 {dscr:.2f}  (target: >2) {'OK' if dscr > 2 else 'FAIL'}")
    print(f"{'='*65}")

if __name__ == "__main__":
    main()
