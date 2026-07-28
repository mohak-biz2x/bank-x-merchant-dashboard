"""
Generate sample cancelled cheques for 3 demo suppliers.
Mimics UAE bank cheque layout with "CANCELLED" watermark.
"""
from fpdf import FPDF
import os

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cancelled-cheques")
os.makedirs(OUTPUT_DIR, exist_ok=True)

SUPPLIERS = [
    {
        "name": "Al Noor Building Materials Trading LLC",
        "bank": "Abu Dhabi Commercial Bank",
        "bank_short": "ADCB",
        "branch": "Al Quoz Industrial Branch, Dubai",
        "account": "1015432187690",
        "iban": "AE290260001015432187690",
        "cheque_no": "000451",
        "filename": "cancelled_cheque_al_noor.pdf",
    },
    {
        "name": "Gulf Star Construction Engineering LLC",
        "bank": "National Bank of Abu Dhabi",
        "bank_short": "NBAD",
        "branch": "DIFC Branch, Dubai",
        "account": "0012987654001",
        "iban": "AE450330000012987654001",
        "cheque_no": "000892",
        "filename": "cancelled_cheque_gulf_star.pdf",
    },
    {
        "name": "Crescent Infrastructure FZE",
        "bank": "Mashreq Bank",
        "bank_short": "MASHREQ",
        "branch": "Jebel Ali Free Zone Branch, Dubai",
        "account": "0006789012345",
        "iban": "AE120350000006789012345",
        "cheque_no": "001203",
        "filename": "cancelled_cheque_crescent.pdf",
    },
]


def generate_cheque(supplier):
    """Generate a cancelled cheque PDF in landscape A5-ish size."""
    pdf = FPDF(orientation="L", format=(100, 200))  # Cheque-sized
    pdf.set_auto_page_break(auto=False)
    pdf.add_page()

    # Background border
    pdf.set_draw_color(0, 51, 102)
    pdf.set_line_width(0.8)
    pdf.rect(3, 3, 194, 94)
    pdf.set_line_width(0.3)
    pdf.rect(5, 5, 190, 90)

    # Bank name (top left)
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(0, 51, 102)
    pdf.set_xy(10, 8)
    pdf.cell(100, 7, supplier["bank"])

    # Bank branch (below bank name)
    pdf.set_font("Helvetica", "", 8)
    pdf.set_xy(10, 15)
    pdf.cell(100, 5, supplier["branch"])

    # Cheque number (top right)
    pdf.set_font("Courier", "B", 11)
    pdf.set_text_color(0, 0, 0)
    pdf.set_xy(155, 8)
    pdf.cell(35, 7, supplier["cheque_no"], align="R")

    # Date line (top right area)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_xy(130, 18)
    pdf.cell(15, 5, "Date:")
    pdf.set_draw_color(100, 100, 100)
    pdf.set_line_width(0.2)
    pdf.line(145, 23, 190, 23)

    # "Pay" line
    pdf.set_xy(10, 30)
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(12, 5, "Pay")
    pdf.line(22, 35, 190, 35)

    # "The sum of" line
    pdf.set_xy(10, 40)
    pdf.cell(25, 5, "The sum of")
    pdf.line(35, 45, 155, 45)
    # Currency box
    pdf.set_font("Helvetica", "B", 9)
    pdf.set_xy(158, 38)
    pdf.cell(10, 5, "AED")
    pdf.rect(155, 37, 37, 9)

    # Second amount line
    pdf.line(10, 53, 155, 53)

    # Account holder name (bottom left)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(0, 0, 0)
    pdf.set_xy(10, 60)
    pdf.cell(100, 6, supplier["name"])

    # Account number
    pdf.set_font("Helvetica", "", 8)
    pdf.set_xy(10, 67)
    pdf.cell(60, 5, f"A/C No: {supplier['account']}")

    # IBAN
    pdf.set_xy(10, 72)
    pdf.cell(100, 5, f"IBAN: {supplier['iban']}")

    # MICR line at bottom (simulated)
    pdf.set_font("Courier", "", 9)
    pdf.set_text_color(80, 80, 80)
    pdf.set_xy(10, 82)
    micr = f"|:{supplier['cheque_no']}|: {supplier['account'][:6]}|: {supplier['iban'][-8:]}"
    pdf.cell(180, 5, micr)

    # Signature line (bottom right)
    pdf.set_draw_color(100, 100, 100)
    pdf.line(130, 75, 185, 75)
    pdf.set_font("Helvetica", "", 7)
    pdf.set_text_color(100, 100, 100)
    pdf.set_xy(130, 76)
    pdf.cell(55, 4, "Authorised Signatory", align="C")

    # CANCELLED watermark (large, diagonal, red)
    pdf.set_font("Helvetica", "B", 40)
    pdf.set_text_color(200, 0, 0)
    # Draw it rotated using multiple positioned letters
    pdf.set_xy(30, 35)
    with pdf.rotation(angle=-25, x=100, y=50):
        pdf.set_xy(35, 45)
        pdf.cell(130, 15, "CANCELLED", align="C")

    # Second CANCELLED line for visibility
    pdf.set_font("Helvetica", "B", 40)
    pdf.set_text_color(200, 0, 0)
    with pdf.rotation(angle=-25, x=100, y=50):
        pdf.set_xy(35, 60)
        pdf.cell(130, 15, "CANCELLED", align="C")

    filepath = os.path.join(OUTPUT_DIR, supplier["filename"])
    pdf.output(filepath)
    return filepath


if __name__ == "__main__":
    print("Generating cancelled cheques for 3 suppliers...")
    print(f"Output: {OUTPUT_DIR}\n")

    for s in SUPPLIERS:
        path = generate_cheque(s)
        print(f"  {s['name']}")
        print(f"    Bank: {s['bank']} | IBAN: {s['iban']}")
        print(f"    File: {os.path.basename(path)}")
        print()

    print("Done!")
