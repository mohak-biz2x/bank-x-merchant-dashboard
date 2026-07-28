"""
Generate a security cheque for ENCORE CLACK.
Amount: AED 5,500,000.00
IBAN: AE350030012285049920002
Bank: Mashreq Bank (based on IBAN prefix 035)
"""
from fpdf import FPDF
import os

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "security-cheque")
os.makedirs(OUTPUT_DIR, exist_ok=True)

COMPANY = "ENCORE CLACK"
IBAN = "AE350030012285049920002"
ACCOUNT = "012285049920002"
BANK = "Mashreq Bank"
BRANCH = "Business Bay Branch, Dubai"
CHEQUE_NO = "002187"
AMOUNT = 5500000.00
AMOUNT_WORDS = "Five Million Five Hundred Thousand Only"
DATE = "30/06/2026"
PAYEE = "Bank X (Supply Chain Finance)"


class SecurityCheque(FPDF):
    def __init__(self):
        super().__init__(orientation="L", format=(110, 210))  # Cheque size


def generate():
    pdf = SecurityCheque()
    pdf.set_auto_page_break(auto=False)
    pdf.add_page()

    w, h = 210, 110

    # Outer border (double line)
    pdf.set_draw_color(0, 51, 102)
    pdf.set_line_width(1.0)
    pdf.rect(3, 3, w - 6, h - 6)
    pdf.set_line_width(0.4)
    pdf.rect(5, 5, w - 10, h - 10)

    # Bank logo area (top left)
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(0, 51, 102)
    pdf.set_xy(10, 8)
    pdf.cell(80, 8, BANK)

    pdf.set_font("Helvetica", "", 8)
    pdf.set_xy(10, 16)
    pdf.cell(80, 5, BRANCH)

    pdf.set_font("Helvetica", "", 7)
    pdf.set_text_color(80, 80, 80)
    pdf.set_xy(10, 21)
    pdf.cell(80, 4, "Licensed by the Central Bank of the UAE")

    # Cheque number (top right)
    pdf.set_font("Courier", "B", 12)
    pdf.set_text_color(0, 0, 0)
    pdf.set_xy(160, 8)
    pdf.cell(40, 7, CHEQUE_NO, align="R")

    # "SECURITY CHEQUE" label (top center)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(180, 0, 0)
    pdf.set_xy(70, 9)
    pdf.cell(60, 6, "SECURITY CHEQUE", align="C")

    # Date
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(0, 0, 0)
    pdf.set_xy(140, 19)
    pdf.cell(12, 5, "Date:")
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(45, 5, DATE)

    # Pay line
    pdf.set_font("Helvetica", "", 9)
    pdf.set_xy(10, 32)
    pdf.cell(10, 5, "Pay")
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(150, 5, PAYEE)
    pdf.set_draw_color(0, 0, 0)
    pdf.set_line_width(0.2)
    pdf.line(20, 37, 195, 37)

    # Amount in words (line 1)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_xy(10, 41)
    pdf.cell(25, 5, "The sum of")
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(130, 5, f"AED {AMOUNT_WORDS}")
    pdf.line(35, 46, 165, 46)

    # Amount in words (line 2) - continuation line
    pdf.set_font("Helvetica", "", 9)
    pdf.set_xy(10, 49)
    pdf.cell(155, 5, "")
    pdf.line(10, 54, 165, 54)

    # Amount box (right side)
    pdf.set_draw_color(0, 51, 102)
    pdf.set_line_width(0.5)
    pdf.rect(167, 40, 35, 12)
    pdf.set_font("Helvetica", "B", 9)
    pdf.set_text_color(0, 51, 102)
    pdf.set_xy(167, 40)
    pdf.cell(35, 5, "AED", align="C")
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(0, 0, 0)
    pdf.set_xy(167, 45)
    pdf.cell(35, 6, f"{AMOUNT:,.2f}", align="C")

    # Account holder details (bottom left)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(0, 0, 0)
    pdf.set_xy(10, 62)
    pdf.cell(100, 6, COMPANY)

    pdf.set_font("Helvetica", "", 8)
    pdf.set_xy(10, 68)
    pdf.cell(80, 5, f"A/C No: {ACCOUNT}")

    pdf.set_xy(10, 73)
    pdf.cell(100, 5, f"IBAN: {IBAN}")

    # Signature line (bottom right)
    pdf.set_draw_color(0, 0, 0)
    pdf.set_line_width(0.3)
    pdf.line(135, 78, 195, 78)
    pdf.set_font("Helvetica", "", 7)
    pdf.set_text_color(100, 100, 100)
    pdf.set_xy(135, 79)
    pdf.cell(60, 4, "Authorised Signatory", align="C")

    # MICR line (very bottom)
    pdf.set_font("Courier", "", 8)
    pdf.set_text_color(80, 80, 80)
    pdf.set_xy(10, 90)
    pdf.cell(180, 5, f"|:{CHEQUE_NO}|:  03500300|:  {ACCOUNT[-8:]}|:")

    # "NOT NEGOTIABLE" text
    pdf.set_font("Helvetica", "B", 7)
    pdf.set_text_color(180, 0, 0)
    pdf.set_xy(10, 85)
    pdf.cell(50, 4, "NOT NEGOTIABLE")

    # Crossings (two parallel lines top-left to indicate it's a crossed cheque)
    pdf.set_draw_color(0, 51, 102)
    pdf.set_line_width(0.3)
    pdf.line(12, 26, 12, 30)
    pdf.line(14, 26, 14, 30)

    filepath = os.path.join(OUTPUT_DIR, "ENCORE_CLACK_security_cheque_5.5M.pdf")
    pdf.output(filepath)
    print(f"Security cheque generated: {filepath}")
    print(f"  Company: {COMPANY}")
    print(f"  IBAN: {IBAN}")
    print(f"  Bank: {BANK}")
    print(f"  Amount: AED {AMOUNT:,.2f}")
    print(f"  Amount in words: {AMOUNT_WORDS}")
    print(f"  Payee: {PAYEE}")
    print(f"  Cheque No: {CHEQUE_NO}")
    print(f"  Date: {DATE}")


if __name__ == "__main__":
    generate()
