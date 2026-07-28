"""
Generate 5 sample UAE Trade License documents as PDFs.
Covers the 4 demo suppliers + buyer (ENCORE CLACK).
"""
from fpdf import FPDF
import os

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "trade-licenses")
os.makedirs(OUTPUT_DIR, exist_ok=True)

LICENSES = [
    {
        "company": "ENCORE CLACK",
        "license_no": "TL-876543",
        "legal_form": "Limited Liability Company (LLC)",
        "activities": ["General Trading", "Supply Chain Management", "Import & Export of Building Materials"],
        "partners": [("Hassan Al Maktoum", "UAE National", "51%"), ("James Richardson", "British", "49%")],
        "address": "Office 204, Building B, Business Bay Tower, Al Abraj Street, Dubai",
        "po_box": "P.O. Box 45892, Dubai, UAE",
        "issue_date": "15-Mar-2025",
        "expiry_date": "14-Mar-2026",
        "capital": "1,000,000",
        "authority": "Department of Economic Development - Dubai",
        "filename": "trade_license_encore_clack.pdf",
    },
    {
        "company": "Al Noor Building Materials Trading LLC",
        "license_no": "TL-678432",
        "legal_form": "Limited Liability Company (LLC)",
        "activities": ["Building Materials Trading", "Construction Supplies Wholesale", "Hardware Trading"],
        "partners": [("Mohammed Al Rashid", "UAE National", "51%"), ("Suresh Patel", "Indian", "49%")],
        "address": "Warehouse 14, Al Quoz Industrial Area 3, Dubai",
        "po_box": "P.O. Box 28734, Dubai, UAE",
        "issue_date": "01-Jan-2025",
        "expiry_date": "31-Dec-2025",
        "capital": "2,000,000",
        "authority": "Department of Economic Development - Dubai",
        "filename": "trade_license_al_noor.pdf",
    },
    {
        "company": "Gulf Star Construction Engineering LLC",
        "license_no": "TL-812956",
        "legal_form": "Limited Liability Company (LLC)",
        "activities": ["MEP Contracting", "Civil Engineering", "Electrical Installation Services"],
        "partners": [("Ahmed Al Hosani", "UAE National", "51%"), ("Sanjay Krishnan", "Indian", "49%")],
        "address": "Office 901, Burj Gate Tower, DIFC, Dubai",
        "po_box": "P.O. Box 67123, Dubai, UAE",
        "issue_date": "10-Feb-2025",
        "expiry_date": "09-Feb-2026",
        "capital": "3,000,000",
        "authority": "Department of Economic Development - Dubai",
        "filename": "trade_license_gulf_star.pdf",
    },
    {
        "company": "Crescent Infrastructure FZE",
        "license_no": "FZ-45231",
        "legal_form": "Free Zone Establishment (FZE)",
        "activities": ["Infrastructure Equipment Supply", "Heavy Machinery Rental", "Project Logistics"],
        "partners": [("Fatima Al Hosani", "UAE National", "100%")],
        "address": "JAFZA One Tower, Block A, Office 412, Jebel Ali Free Zone, Dubai",
        "po_box": "P.O. Box 18290, Jebel Ali, Dubai, UAE",
        "issue_date": "20-Apr-2025",
        "expiry_date": "19-Apr-2026",
        "capital": "5,000,000",
        "authority": "Jebel Ali Free Zone Authority (JAFZA)",
        "filename": "trade_license_crescent.pdf",
    },
    {
        "company": "Titan MEP Solutions LLC",
        "license_no": "TL-934782",
        "legal_form": "Limited Liability Company (LLC)",
        "activities": ["Mechanical Contracting", "Electrical Contracting", "Plumbing & Fire Fighting Installation"],
        "partners": [("Khalid Bin Saeed", "UAE National", "51%"), ("Rajesh Nair", "Indian", "49%")],
        "address": "Unit 12, Warehouse Complex, Al Quoz Industrial 4, Dubai",
        "po_box": "P.O. Box 93456, Dubai, UAE",
        "issue_date": "05-May-2025",
        "expiry_date": "04-May-2026",
        "capital": "1,500,000",
        "authority": "Department of Economic Development - Dubai",
        "filename": "trade_license_titan_mep.pdf",
    },
]


def generate_trade_license(lic):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Header - Authority
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(0, 51, 102)
    pdf.cell(0, 8, lic["authority"], align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 5, "United Arab Emirates", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # Title
    pdf.set_draw_color(0, 51, 102)
    pdf.set_line_width(0.8)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(4)

    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(0, 51, 102)
    pdf.cell(0, 12, "TRADE LICENSE", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 6, "Commercial License / Business Registration", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.set_line_width(0.8)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(8)

    # License details
    def field(label, value, bold_value=False):
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(55, 7, label)
        pdf.set_font("Helvetica", "B" if bold_value else "", 10)
        pdf.cell(0, 7, value, new_x="LMARGIN", new_y="NEXT")

    field("License Number:", lic["license_no"], bold_value=True)
    field("Company Name:", lic["company"], bold_value=True)
    field("Legal Form:", lic["legal_form"])
    field("Registered Address:", lic["address"])
    field("P.O. Box:", lic["po_box"])
    field("Paid-Up Capital:", f"AED {lic['capital']}")
    field("Date of Issue:", lic["issue_date"])
    field("Date of Expiry:", lic["expiry_date"])
    pdf.ln(6)

    # Business Activities
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(0, 51, 102)
    pdf.cell(0, 8, "Licensed Business Activities", new_x="LMARGIN", new_y="NEXT")
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Helvetica", "", 10)
    for i, activity in enumerate(lic["activities"], 1):
        pdf.cell(10, 6, f"{i}.")
        pdf.cell(0, 6, activity, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    # Partners/Shareholders
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(0, 51, 102)
    pdf.cell(0, 8, "Partners / Shareholders", new_x="LMARGIN", new_y="NEXT")
    pdf.set_text_color(0, 0, 0)

    # Table header
    pdf.set_font("Helvetica", "B", 9)
    pdf.set_fill_color(230, 240, 250)
    pdf.cell(60, 7, "Name", border=1, fill=True)
    pdf.cell(50, 7, "Nationality", border=1, fill=True)
    pdf.cell(40, 7, "Share %", border=1, fill=True)
    pdf.ln()

    pdf.set_font("Helvetica", "", 9)
    for name, nationality, share in lic["partners"]:
        pdf.cell(60, 7, name, border=1)
        pdf.cell(50, 7, nationality, border=1)
        pdf.cell(40, 7, share, border=1)
        pdf.ln()

    pdf.ln(10)

    # Conditions
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(0, 51, 102)
    pdf.cell(0, 7, "Conditions:", new_x="LMARGIN", new_y="NEXT")
    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Helvetica", "", 8)
    conditions = [
        "This license is valid only for the activities mentioned above.",
        "The licensee must comply with all UAE federal and local laws and regulations.",
        "This license must be renewed before the expiry date.",
        "Any change in business activity, partners, or address requires prior approval.",
        "This license is non-transferable without written approval from the authority.",
    ]
    for c in conditions:
        pdf.cell(5, 5, "-")
        pdf.cell(0, 5, c, new_x="LMARGIN", new_y="NEXT")

    pdf.ln(10)

    # Signature area
    pdf.set_draw_color(0, 0, 0)
    pdf.set_line_width(0.3)

    pdf.set_font("Helvetica", "", 9)
    pdf.cell(95, 5, "Authorised Signatory", align="C")
    pdf.cell(95, 5, "Official Stamp", align="C")
    pdf.ln(2)
    pdf.line(30, pdf.get_y(), 80, pdf.get_y())
    pdf.line(130, pdf.get_y(), 180, pdf.get_y())
    pdf.ln(8)

    # Footer
    pdf.set_font("Helvetica", "I", 7)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 4, "This is an electronically generated document. No physical signature is required.", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 4, f"Verification: https://verify.{lic['authority'].split('-')[-1].strip().lower().replace(' ', '')}.gov.ae/license/{lic['license_no']}", align="C")

    filepath = os.path.join(OUTPUT_DIR, lic["filename"])
    pdf.output(filepath)
    return filepath


if __name__ == "__main__":
    print("Generating 5 sample Trade License documents...")
    print(f"Output: {OUTPUT_DIR}\n")

    for lic in LICENSES:
        path = generate_trade_license(lic)
        print(f"  {lic['company']}")
        print(f"    License No: {lic['license_no']} | Expiry: {lic['expiry_date']}")
        print(f"    Activities: {', '.join(lic['activities'])}")
        print(f"    File: {os.path.basename(path)}")
        print()

    print("Done!")
