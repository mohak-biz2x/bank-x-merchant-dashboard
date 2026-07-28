"""
Generate 15 invoice PDFs specifically designed to test MB-44 Rule Engine rules.

Rules tested:
  REJECT:
    R1  - Invoice Number unique within request (duplicate invoice numbers)
    R2  - Payment Due Date not in the past
    R3  - Payment Due Date after Invoice Date
    R7  - Currency must be AED
    R16 - Shariah compliance (restricted goods/services)

  REFER:
    R4  - Invoice Number unique per seller (cross-request duplicate)
    R5  - Invoice Date <= Submission Date (future-dated invoice)
    R6  - Invoice Date <= Contract Period
    R8  - Subtotal + VAT != Invoice Gross Amount (math mismatch)
    R9  - Seller name mismatch (parsed vs system)
    R10 - Buyer name mismatch (parsed vs entered)
    R11 - Tamper flag (overwriting detected)
    R12 - Duplicate invoice detection (cross-request)
    R13 - Parsed vs entered values inconsistency
    R14 - TRN validity (invalid format)
    R15 - TRN match with system (mismatch)
    R17 - Round-number bias (exact round figures)

Each invoice is labeled with which rule(s) it should trigger.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
import os

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "rule-engine-test-invoices")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# All invoices use AED and a consistent seller/buyer to simulate a real batch submission
# The "system" merchant is: Al Masraf Industries LLC (TLN: TL-100200, TRN: 100234567890003)
# The "system" supplier is: Al Noor Building Materials Trading LLC (TLN: TL-789012, TRN: 300456789012345)

invoices = [
    # ===== CLEAN INVOICE (should APPROVE) =====
    {
        "filename": "01_APPROVE_clean_invoice.pdf",
        "test_label": "APPROVE - All rules pass",
        "rules_tested": "None (baseline - should approve)",
        "number": "ANB-INV-2025-101",
        "date": "15 May 2025",
        "due_date": "13 Aug 2025",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Portland Cement 50kg bags Grade 42.5", 500, 45.00),
            ("Steel Reinforcement Bars 12mm", 2000, 38.50),
            ("Concrete Blocks 400x200x200mm", 3000, 12.00),
        ],
        "subtotal": 135500.00,
        "vat": 6775.00,
        "total": 142275.00,
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank",
        "iban": "AE290260001015432187690",
    },

    # ===== R2: Due date in the past =====
    {
        "filename": "02_REJECT_R2_past_due_date.pdf",
        "test_label": "REJECT R2 - Due date in the past",
        "rules_tested": "R2: Payment Due Date not in the past",
        "number": "ANB-INV-2025-102",
        "date": "10 Jan 2024",
        "due_date": "10 Mar 2024",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Waterproofing Membrane Roll", 150, 185.00),
            ("Sand Fine Grade per ton", 80, 95.00),
        ],
        "subtotal": 35350.00,
        "vat": 1767.50,
        "total": 37117.50,
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank",
        "iban": "AE290260001015432187690",
    },

    # ===== R3: Due date BEFORE invoice date =====
    {
        "filename": "03_REJECT_R3_due_before_invoice.pdf",
        "test_label": "REJECT R3 - Due date before invoice date",
        "rules_tested": "R3: Payment Due Date must be after Invoice Date",
        "number": "ANB-INV-2025-103",
        "date": "20 Jun 2025",
        "due_date": "15 May 2025",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Aluminum Composite Panels 4mm", 200, 320.00),
        ],
        "subtotal": 64000.00,
        "vat": 3200.00,
        "total": 67200.00,
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank",
        "iban": "AE290260001015432187690",
    },

    # ===== R7: Non-AED currency =====
    {
        "filename": "04_REJECT_R7_wrong_currency_USD.pdf",
        "test_label": "REJECT R7 - Currency is USD (not AED)",
        "rules_tested": "R7: Currency must be AED",
        "number": "ANB-INV-2025-104",
        "date": "01 Jun 2025",
        "due_date": "30 Aug 2025",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Imported Marble Tiles 600x600mm", 400, 125.00),
            ("Granite Countertops Custom Cut", 50, 890.00),
        ],
        "subtotal": 94500.00,
        "vat": 4725.00,
        "total": 99225.00,
        "currency": "USD",
        "bank": "Citibank N.A. Dubai",
        "iban": "AE070331234567890123456",
    },

    # ===== R16: Shariah restricted - Alcohol =====
    {
        "filename": "05_REJECT_R16_shariah_alcohol.pdf",
        "test_label": "REJECT R16 - Shariah restricted (Alcohol)",
        "rules_tested": "R16: Shariah compliance - goods match restricted list",
        "number": "ANB-INV-2025-105",
        "date": "05 Jun 2025",
        "due_date": "03 Sep 2025",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Premium Whiskey Bottles 750ml Case/12", 200, 480.00),
            ("Imported Wine Red Bordeaux Case/6", 150, 360.00),
            ("Beer Kegs 50L Draught", 100, 220.00),
        ],
        "subtotal": 172000.00,
        "vat": 8600.00,
        "total": 180600.00,
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank",
        "iban": "AE290260001015432187690",
    },

    # ===== R16: Shariah restricted - Tobacco =====
    {
        "filename": "06_REJECT_R16_shariah_tobacco.pdf",
        "test_label": "REJECT R16 - Shariah restricted (Tobacco)",
        "rules_tested": "R16: Shariah compliance - tobacco products",
        "number": "ANB-INV-2025-106",
        "date": "08 Jun 2025",
        "due_date": "06 Sep 2025",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Cigarette Manufacturing Equipment", 5, 45000.00),
            ("Tobacco Leaf Raw Material 100kg", 50, 1200.00),
            ("E-Cigarette Vape Liquid Nicotine 1L", 500, 85.00),
        ],
        "subtotal": 327500.00,
        "vat": 16375.00,
        "total": 343875.00,
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank",
        "iban": "AE290260001015432187690",
    },

    # ===== R16: Shariah restricted - Gambling =====
    {
        "filename": "07_REJECT_R16_shariah_gambling.pdf",
        "test_label": "REJECT R16 - Shariah restricted (Gambling)",
        "rules_tested": "R16: Shariah compliance - gambling equipment",
        "number": "ANB-INV-2025-107",
        "date": "10 Jun 2025",
        "due_date": "08 Sep 2025",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Casino Slot Machines Model X500", 20, 15000.00),
            ("Sports Betting Terminal Kiosk", 10, 8500.00),
            ("Online Gambling Platform License", 1, 250000.00),
        ],
        "subtotal": 635000.00,
        "vat": 31750.00,
        "total": 666750.00,
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank",
        "iban": "AE290260001015432187690",
    },

    # ===== R5: Future-dated invoice (REFER) =====
    {
        "filename": "08_REFER_R5_future_dated.pdf",
        "test_label": "REFER R5 - Invoice date is in the future",
        "rules_tested": "R5: Invoice Date must be <= Submission Date",
        "number": "ANB-INV-2025-108",
        "date": "15 Dec 2026",
        "due_date": "15 Mar 2027",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Pre-fabricated Steel Structure Kit", 10, 28000.00),
            ("Industrial Paint Epoxy 20L drums", 200, 450.00),
        ],
        "subtotal": 370000.00,
        "vat": 18500.00,
        "total": 388500.00,
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank",
        "iban": "AE290260001015432187690",
    },

    # ===== R8: Math mismatch (subtotal + VAT != total) =====
    {
        "filename": "09_REFER_R8_math_mismatch.pdf",
        "test_label": "REFER R8 - Subtotal + VAT != Total",
        "rules_tested": "R8: Subtotal + VAT = Invoice Gross Amount",
        "number": "ANB-INV-2025-109",
        "date": "20 May 2025",
        "due_date": "18 Aug 2025",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Ceramic Floor Tiles 600x600mm", 800, 55.00),
            ("Plumbing Pipes PPR 20mm", 600, 28.00),
            ("Electrical Conduit PVC 25mm 3m", 1500, 18.00),
        ],
        "subtotal": 87800.00,
        "vat": 4390.00,
        # Intentionally WRONG total (should be 92190, showing 95000)
        "total": 95000.00,
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank",
        "iban": "AE290260001015432187690",
    },

    # ===== R9: Seller name mismatch =====
    {
        "filename": "10_REFER_R9_seller_name_mismatch.pdf",
        "test_label": "REFER R9 - Seller name on invoice differs from system",
        "rules_tested": "R9: Seller name exact match (parsed vs system)",
        "number": "ANB-INV-2025-110",
        "date": "22 May 2025",
        "due_date": "20 Aug 2025",
        # Slightly different seller name (typo/abbreviation)
        "seller": "Al Noor Bldg Materials Trading",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Ready Mix Concrete Grade C40", 50, 450.00),
            ("Scaffolding Pipes 48mm 6m", 300, 85.00),
        ],
        "subtotal": 48000.00,
        "vat": 2400.00,
        "total": 50400.00,
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank",
        "iban": "AE290260001015432187690",
    },

    # ===== R10: Buyer name mismatch =====
    {
        "filename": "11_REFER_R10_buyer_name_mismatch.pdf",
        "test_label": "REFER R10 - Buyer name on invoice differs from entered",
        "rules_tested": "R10: Buyer name exact match (parsed vs entered)",
        "number": "ANB-INV-2025-111",
        "date": "25 May 2025",
        "due_date": "23 Aug 2025",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        # Different buyer name than what's in the system
        "buyer": "Al Masraf Industrial Group PJSC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Glass Panels 10mm Tempered", 80, 290.00),
            ("Gypsum Board 12.5mm 1200x2400", 500, 42.00),
        ],
        "subtotal": 44200.00,
        "vat": 2210.00,
        "total": 46410.00,
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank",
        "iban": "AE290260001015432187690",
    },

    # ===== R14: Invalid TRN format =====
    {
        "filename": "12_REFER_R14_invalid_trn.pdf",
        "test_label": "REFER R14 - Invalid TRN format",
        "rules_tested": "R14: TRN validity (invalid format)",
        "number": "ANB-INV-2025-112",
        "date": "28 May 2025",
        "due_date": "26 Aug 2025",
        "seller": "Al Noor Building Materials Trading LLC",
        # Invalid TRN format (too short, has letters)
        "seller_trn": "TRN-INVALID-XYZ",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "ABC123",
        "items": [
            ("Safety Netting per roll 50m", 40, 220.00),
            ("Paint Exterior Weather Shield 20L", 100, 380.00),
        ],
        "subtotal": 46800.00,
        "vat": 2340.00,
        "total": 49140.00,
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank",
        "iban": "AE290260001015432187690",
    },

    # ===== R15: TRN mismatch with system =====
    {
        "filename": "13_REFER_R15_trn_system_mismatch.pdf",
        "test_label": "REFER R15 - TRN does not match system records",
        "rules_tested": "R15: TRN match with system (parsed != system TRN)",
        "number": "ANB-INV-2025-113",
        "date": "30 May 2025",
        "due_date": "28 Aug 2025",
        "seller": "Al Noor Building Materials Trading LLC",
        # Valid format but WRONG TRN (doesn't match system record)
        "seller_trn": "300999888777666",
        "buyer": "Al Masraf Industries LLC",
        # Valid format but wrong buyer TRN
        "buyer_trn": "100999888777555",
        "items": [
            ("Insulation Foam Spray 500ml cans", 2000, 18.00),
            ("Roofing Sheets Corrugated 3m", 400, 95.00),
            ("Door Frames Wooden Standard", 200, 280.00),
        ],
        "subtotal": 130000.00,
        "vat": 6500.00,
        "total": 136500.00,
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank",
        "iban": "AE290260001015432187690",
    },

    # ===== R17: Round number bias =====
    {
        "filename": "14_REFER_R17_round_number.pdf",
        "test_label": "REFER R17 - Exact round number amount",
        "rules_tested": "R17: Round-number bias (exact round figures)",
        "number": "ANB-INV-2025-114",
        "date": "01 Jun 2025",
        "due_date": "30 Aug 2025",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Bulk Construction Materials Package A", 1, 95238.10),
        ],
        # Exact round number total
        "subtotal": 95238.10,
        "vat": 4761.90,
        "total": 100000.00,
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank",
        "iban": "AE290260001015432187690",
    },

    # ===== R1 + R17: Duplicate invoice number + round number =====
    {
        "filename": "15_REJECT_R1_duplicate_number_in_batch.pdf",
        "test_label": "REJECT R1 + REFER R17 - Duplicate inv# in batch + round amount",
        "rules_tested": "R1: Duplicate invoice number in same batch; R17: Round number",
        # Same number as invoice #14 above - duplicate within batch!
        "number": "ANB-INV-2025-114",
        "date": "02 Jun 2025",
        "due_date": "31 Aug 2025",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Bulk Construction Materials Package B", 1, 47619.05),
        ],
        "subtotal": 47619.05,
        "vat": 2380.95,
        "total": 50000.00,
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank",
        "iban": "AE290260001015432187690",
    },
]


# ============================================================
# PDF GENERATION
# ============================================================

PRIMARY = HexColor("#036836")
LIGHT_GREEN = HexColor("#E8F5E9")
GRAY_BG = HexColor("#F5F5F5")
RED = HexColor("#B71C1C")
ORANGE = HexColor("#E65100")


def create_invoice_pdf(inv, output_path):
    doc = SimpleDocTemplate(output_path, pagesize=A4,
        topMargin=1.5*cm, bottomMargin=1.5*cm, leftMargin=1.5*cm, rightMargin=1.5*cm)
    styles = getSampleStyleSheet()
    ts = ParagraphStyle('ts', parent=styles['Normal'], fontSize=9, leading=12)
    tr = ParagraphStyle('tr', parent=styles['Normal'], fontSize=9, alignment=TA_RIGHT)
    elements = []

    # Test label banner (for QA reference - would not be on real invoice)
    label_color = RED if "REJECT" in inv['test_label'] else (ORANGE if "REFER" in inv['test_label'] else PRIMARY)
    banner = Table([[Paragraph(f"<b>TEST: {inv['test_label']}</b>",
        ParagraphStyle('b', parent=ts, fontSize=8, textColor=white))]], colWidths=[18*cm])
    banner.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), label_color),
        ('TOPPADDING', (0,0), (-1,-1), 3), ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(banner)
    elements.append(Spacer(1, 1*mm))
    elements.append(Paragraph(f"<i>Rules: {inv['rules_tested']}</i>",
        ParagraphStyle('r', parent=ts, fontSize=7, textColor=HexColor("#666666"))))
    elements.append(Spacer(1, 4*mm))

    # Invoice header
    elements.append(Paragraph("<b>TAX INVOICE</b>",
        ParagraphStyle('ti', parent=styles['Heading1'], fontSize=22, textColor=PRIMARY)))
    elements.append(Spacer(1, 3*mm))

    # Two-column header
    header_data = [
        [Paragraph(f"<b>Invoice No:</b> {inv['number']}", ts),
         Paragraph(f"<b>From:</b> {inv['seller']}", ts)],
        [Paragraph(f"<b>Date:</b> {inv['date']}", ts),
         Paragraph(f"TRN: {inv['seller_trn']}", ts)],
        [Paragraph(f"<b>Due Date:</b> {inv['due_date']}", ts),
         Paragraph(f"Bank: {inv['bank']}", ts)],
        [Paragraph(f"<b>Currency:</b> {inv['currency']}", ts),
         Paragraph(f"IBAN: {inv['iban']}", ts)],
    ]
    ht = Table(header_data, colWidths=[9*cm, 9*cm])
    ht.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 1), ('BOTTOMPADDING', (0,0), (-1,-1), 1)]))
    elements.append(ht)
    elements.append(Spacer(1, 4*mm))

    # Bill To
    elements.append(Paragraph(f"<b>Bill To:</b> {inv['buyer']}", ts))
    elements.append(Paragraph(f"Buyer TRN: {inv['buyer_trn']}", ts))
    elements.append(Spacer(1, 4*mm))

    # Items table
    data = [["#", "Description", "Qty", f"Rate ({inv['currency']})", f"Amount ({inv['currency']})"]]
    for i, (desc, qty, rate) in enumerate(inv['items'], 1):
        amt = qty * rate
        data.append([str(i), desc, str(qty), f"{rate:,.2f}", f"{amt:,.2f}"])

    data.append(["", "", "", Paragraph("<b>Subtotal</b>", tr), f"{inv['subtotal']:,.2f}"])
    data.append(["", "", "", Paragraph(f"<b>VAT (5%)</b>", tr), f"{inv['vat']:,.2f}"])
    data.append(["", "", "", Paragraph(f"<b>TOTAL ({inv['currency']})</b>", tr), f"{inv['total']:,.2f}"])

    num_items = len(inv['items'])
    t = Table(data, colWidths=[1*cm, 8.5*cm, 2*cm, 3*cm, 3.5*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('ALIGN', (2,1), (2,-1), 'CENTER'),
        ('ALIGN', (3,1), (-1,-1), 'RIGHT'),
        ('ROWBACKGROUNDS', (0,1), (-1,num_items), [white, GRAY_BG]),
        ('GRID', (0,0), (-1,num_items), 0.5, HexColor("#DDDDDD")),
        ('LINEBELOW', (0,0), (-1,0), 1, PRIMARY),
        ('LINEABOVE', (3,-1), (-1,-1), 1.5, PRIMARY),
        ('FONTNAME', (4,-1), (4,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (4,-1), (4,-1), 11),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 6*mm))

    # Terms
    terms_style = ParagraphStyle('trm', parent=ts, fontSize=8, textColor=HexColor("#666666"))
    elements.append(Paragraph("<b>Terms:</b> Payment due within 90 days. Late payments subject to 2% monthly interest.", terms_style))

    doc.build(elements)


if __name__ == "__main__":
    print("Generating 15 Rule Engine Test Invoice PDFs (MB-44)...")
    print(f"Output: {OUTPUT_DIR}\n")
    print(f"{'#':<3} {'Filename':<45} {'Expected Outcome'}")
    print("-" * 95)

    for i, inv in enumerate(invoices, 1):
        filepath = os.path.join(OUTPUT_DIR, inv['filename'])
        create_invoice_pdf(inv, filepath)
        print(f"{i:<3} {inv['filename']:<45} {inv['test_label']}")

    print(f"\nDone! {len(invoices)} invoices generated.")
    print("\n" + "=" * 95)
    print("RULE COVERAGE MATRIX:")
    print("=" * 95)
    print("""
REJECT Rules:
  R1  - Duplicate invoice # in batch     -> Invoice #15 (same # as #14)
  R2  - Due date in the past             -> Invoice #02
  R3  - Due date before invoice date     -> Invoice #03
  R7  - Non-AED currency                 -> Invoice #04 (USD)
  R16 - Shariah restricted goods         -> Invoices #05 (alcohol), #06 (tobacco), #07 (gambling)

REFER Rules:
  R4  - Cross-request duplicate          -> Use invoice #01 number in a second submission
  R5  - Future-dated invoice             -> Invoice #08 (Dec 2026)
  R6  - Invoice date > contract period   -> Use invoice #08 with short contract
  R8  - Math mismatch                    -> Invoice #09 (total != subtotal + VAT)
  R9  - Seller name mismatch            -> Invoice #10 (abbreviated name)
  R10 - Buyer name mismatch             -> Invoice #11 (different entity name)
  R11 - Tamper flag                      -> Simulate via system flag (not in PDF)
  R12 - Cross-request duplicate          -> Submit invoice #01 twice
  R13 - Parsed vs entered mismatch      -> Enter different values than parsed
  R14 - Invalid TRN format              -> Invoice #12 (malformed TRNs)
  R15 - TRN system mismatch             -> Invoice #13 (valid format, wrong number)
  R17 - Round number bias               -> Invoices #14, #15 (AED 100,000 / 50,000)

APPROVE:
  All rules pass                         -> Invoice #01 (clean baseline)
""")
