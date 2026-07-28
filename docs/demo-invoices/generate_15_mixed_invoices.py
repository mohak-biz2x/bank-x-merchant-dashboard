"""
Generate 15 invoices: 5 Approved, 5 Rejected, 5 Refer per MB-44 rules.
All dates use 2026. System records:
  Seller: Al Noor Building Materials Trading LLC | TRN: 300456789012345
  Buyer:  Al Masraf Industries LLC               | TRN: 100234567890003
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT
import os

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mixed-15-invoices")
os.makedirs(OUTPUT_DIR, exist_ok=True)

GREEN = HexColor("#036836")
RED = HexColor("#B71C1C")
ORANGE = HexColor("#E65100")
GRAY_BG = HexColor("#F5F5F5")

# ===================== 5 APPROVED INVOICES =====================
approved = [
    {
        "filename": "01_APPROVED_cement_steel.pdf",
        "label": "APPROVED",
        "rule_note": "All rules pass",
        "number": "ANB-INV-2026-301",
        "date": "10 May 2026",
        "due_date": "08 Aug 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Portland Cement OPC 53 Grade 50kg", 600, 47.50),
            ("TMT Steel Bars 12mm Fe500D", 1800, 39.75),
            ("Concrete Blocks 400x200x200mm", 4000, 9.25),
        ],
        "currency": "AED",
    },
    {
        "filename": "02_APPROVED_electrical.pdf",
        "label": "APPROVED",
        "rule_note": "All rules pass",
        "number": "ANB-INV-2026-302",
        "date": "12 May 2026",
        "due_date": "10 Aug 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Copper Cable 4sqmm Roll 90m", 150, 295.00),
            ("MCB Circuit Breaker 32A", 400, 42.50),
            ("LED Panel Light 40W 600x600", 250, 128.00),
            ("DB Box 12-Way TPN", 35, 715.00),
        ],
        "currency": "AED",
    },
    {
        "filename": "03_APPROVED_plumbing.pdf",
        "label": "APPROVED",
        "rule_note": "All rules pass",
        "number": "ANB-INV-2026-303",
        "date": "15 May 2026",
        "due_date": "13 Aug 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("UPVC Pipe 110mm SWR 3m", 350, 82.00),
            ("Ball Valve Brass 1in", 200, 48.50),
            ("Water Tank HDPE 500L", 25, 875.00),
            ("Submersible Pump 1HP", 15, 2650.00),
        ],
        "currency": "AED",
    },
    {
        "filename": "04_APPROVED_tiles_paint.pdf",
        "label": "APPROVED",
        "rule_note": "All rules pass",
        "number": "ANB-INV-2026-304",
        "date": "18 May 2026",
        "due_date": "16 Aug 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Porcelain Floor Tiles 600x600mm", 500, 58.00),
            ("Wall Putty White 40kg", 250, 29.75),
            ("Exterior Paint Weathershield 20L", 60, 365.00),
            ("Gypsum Board 12.5mm 2400x1200", 350, 41.00),
        ],
        "currency": "AED",
    },
    {
        "filename": "05_APPROVED_safety.pdf",
        "label": "APPROVED",
        "rule_note": "All rules pass",
        "number": "ANB-INV-2026-305",
        "date": "20 May 2026",
        "due_date": "18 Aug 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Safety Helmet White ISI", 400, 36.50),
            ("Hi-Vis Vest Orange Class 2", 400, 24.75),
            ("Safety Shoes Steel Toe", 250, 152.00),
            ("Fire Extinguisher ABC 6kg", 50, 198.00),
            ("First Aid Kit 50-Person", 20, 495.00),
        ],
        "currency": "AED",
    },
]

# ===================== 5 REJECTED INVOICES =====================
rejected = [
    {
        "filename": "06_REJECTED_R2_past_due.pdf",
        "label": "REJECTED",
        "rule_note": "R2: Due date in the past (Mar 2025)",
        "number": "ANB-INV-2026-306",
        "date": "10 Jan 2025",
        "due_date": "10 Mar 2025",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Waterproofing Membrane Roll 20m", 120, 195.00),
            ("Bitumen Primer 20L drum", 80, 145.00),
        ],
        "currency": "AED",
    },
    {
        "filename": "07_REJECTED_R3_due_before_date.pdf",
        "label": "REJECTED",
        "rule_note": "R3: Due date (Apr 2026) before invoice date (Jun 2026)",
        "number": "ANB-INV-2026-307",
        "date": "15 Jun 2026",
        "due_date": "10 Apr 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Aluminum Composite Panel 4mm", 180, 335.00),
            ("Glass Panel 10mm Tempered sqm", 60, 310.00),
        ],
        "currency": "AED",
    },
    {
        "filename": "08_REJECTED_R7_currency_SAR.pdf",
        "label": "REJECTED",
        "rule_note": "R7: Currency is SAR (must be AED)",
        "number": "ANB-INV-2026-308",
        "date": "05 May 2026",
        "due_date": "03 Aug 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Imported Marble Slabs 20mm", 100, 450.00),
            ("Granite Kitchen Countertop Custom", 40, 1250.00),
        ],
        "currency": "SAR",
    },
    {
        "filename": "09_REJECTED_R16_alcohol.pdf",
        "label": "REJECTED",
        "rule_note": "R16: Shariah restricted - Alcohol products",
        "number": "ANB-INV-2026-309",
        "date": "08 May 2026",
        "due_date": "06 Aug 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Premium Scotch Whiskey 750ml Case/12", 150, 520.00),
            ("French Red Wine Bordeaux Case/6", 200, 385.00),
            ("Craft Beer IPA Kegs 30L", 80, 275.00),
        ],
        "currency": "AED",
    },
    {
        "filename": "10_REJECTED_R16_gambling.pdf",
        "label": "REJECTED",
        "rule_note": "R16: Shariah restricted - Gambling equipment",
        "number": "ANB-INV-2026-310",
        "date": "10 May 2026",
        "due_date": "08 Aug 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Casino Roulette Table Professional", 5, 18500.00),
            ("Slot Machine Model Vegas-X Pro", 15, 12000.00),
            ("Sports Betting Terminal Kiosk", 8, 9500.00),
        ],
        "currency": "AED",
    },
]

# ===================== 5 REFER INVOICES =====================
refer = [
    {
        "filename": "11_REFER_R5_future_dated.pdf",
        "label": "REFER",
        "rule_note": "R5: Invoice date (Dec 2026) is in the future",
        "number": "ANB-INV-2026-311",
        "date": "15 Dec 2026",
        "due_date": "15 Mar 2027",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Pre-fab Steel Structure Kit", 8, 32500.00),
            ("Industrial Epoxy Paint 20L", 150, 475.00),
        ],
        "currency": "AED",
    },
    {
        "filename": "12_REFER_R8_math_error.pdf",
        "label": "REFER",
        "rule_note": "R8: Subtotal + VAT != Total (math mismatch)",
        "number": "ANB-INV-2026-312",
        "date": "12 May 2026",
        "due_date": "10 Aug 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Ceramic Wall Tiles 300x600mm", 700, 48.00),
            ("Tile Adhesive 25kg bag", 400, 22.50),
            ("Grout Epoxy 5kg bucket", 200, 85.00),
        ],
        "currency": "AED",
        "override_total": 72000.00,  # Wrong! Correct would be ~63,787.50
    },
    {
        "filename": "13_REFER_R9_seller_mismatch.pdf",
        "label": "REFER",
        "rule_note": "R9: Seller name differs from system (abbreviated)",
        "number": "ANB-INV-2026-313",
        "date": "14 May 2026",
        "due_date": "12 Aug 2026",
        "seller": "Al Noor Bldg Mat. Trading",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Ready Mix Concrete C40 per cbm", 45, 465.00),
            ("Scaffolding Pipes 48mm 6m", 250, 92.00),
            ("Safety Net 10x5m roll", 60, 340.00),
        ],
        "currency": "AED",
    },
    {
        "filename": "14_REFER_R14_invalid_trn.pdf",
        "label": "REFER",
        "rule_note": "R14: Invalid TRN format (non-numeric, wrong length)",
        "number": "ANB-INV-2026-314",
        "date": "16 May 2026",
        "due_date": "14 Aug 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "TRN-INVALID-99",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "XYZ-00-WRONG",
        "items": [
            ("Plywood Marine Grade 18mm 8x4ft", 300, 125.00),
            ("MDF Board 12mm 8x4ft", 200, 68.00),
            ("Timber Beam 100x100mm 3m", 150, 95.00),
        ],
        "currency": "AED",
    },
    {
        "filename": "15_REFER_R17_round_number.pdf",
        "label": "REFER",
        "rule_note": "R17: Total is exact round number AED 200,000",
        "number": "ANB-INV-2026-315",
        "date": "19 May 2026",
        "due_date": "17 Aug 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "items": [
            ("Bulk Construction Package Premium", 1, 190476.19),
        ],
        "currency": "AED",
        "override_subtotal": 190476.19,
        "override_vat": 9523.81,
        "override_total": 200000.00,
    },
]

all_invoices = approved + rejected + refer


# ===================== PDF GENERATION =====================

def create_invoice_pdf(inv, output_path):
    color_map = {"APPROVED": GREEN, "REJECTED": RED, "REFER": ORANGE}
    label_color = color_map.get(inv["label"], GREEN)

    doc = SimpleDocTemplate(output_path, pagesize=A4,
        topMargin=1.5*cm, bottomMargin=1.5*cm, leftMargin=1.5*cm, rightMargin=1.5*cm)
    styles = getSampleStyleSheet()
    ts = ParagraphStyle('ts', parent=styles['Normal'], fontSize=9, leading=12)
    tr = ParagraphStyle('tr', parent=styles['Normal'], fontSize=9, alignment=TA_RIGHT)
    elements = []

    # Status banner
    banner = Table([[Paragraph(
        f"<b>{inv['label']}</b> | {inv['rule_note']}",
        ParagraphStyle('b', parent=ts, fontSize=8, textColor=white)
    )]], colWidths=[18*cm])
    banner.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), label_color),
        ('TOPPADDING', (0,0), (-1,-1), 4), ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(banner)
    elements.append(Spacer(1, 4*mm))

    # Title
    elements.append(Paragraph("<b>TAX INVOICE</b>",
        ParagraphStyle('ti', parent=styles['Heading1'], fontSize=22, textColor=GREEN)))
    elements.append(Spacer(1, 3*mm))

    # Header
    header_data = [
        [Paragraph(f"<b>Invoice No:</b> {inv['number']}", ts),
         Paragraph(f"<b>From:</b> {inv['seller']}", ts)],
        [Paragraph(f"<b>Date:</b> {inv['date']}", ts),
         Paragraph(f"TRN: {inv['seller_trn']}", ts)],
        [Paragraph(f"<b>Due Date:</b> {inv['due_date']}", ts),
         Paragraph(f"IBAN: AE290260001015432187690", ts)],
        [Paragraph(f"<b>Currency:</b> {inv['currency']}", ts),
         Paragraph(f"SWIFT: ADCBAEAAXXX", ts)],
    ]
    ht = Table(header_data, colWidths=[9*cm, 9*cm])
    ht.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 1), ('BOTTOMPADDING', (0,0), (-1,-1), 1)]))
    elements.append(ht)
    elements.append(Spacer(1, 4*mm))

    # Bill To
    elements.append(Paragraph(f"<b>Bill To:</b> {inv['buyer']} | TRN: {inv['buyer_trn']}", ts))
    elements.append(Spacer(1, 4*mm))

    # Calculate amounts
    subtotal = inv.get("override_subtotal", sum(qty * rate for _, qty, rate in inv['items']))
    vat = inv.get("override_vat", round(subtotal * 0.05, 2))
    total = inv.get("override_total", round(subtotal + vat, 2))

    # Items table
    data = [["#", "Description", "Qty", f"Rate ({inv['currency']})", f"Amount ({inv['currency']})"]]
    for i, (desc, qty, rate) in enumerate(inv['items'], 1):
        amt = qty * rate
        data.append([str(i), desc, str(qty), f"{rate:,.2f}", f"{amt:,.2f}"])

    data.append(["", "", "", Paragraph("<b>Subtotal</b>", tr), f"{subtotal:,.2f}"])
    data.append(["", "", "", Paragraph("<b>VAT (5%)</b>", tr), f"{vat:,.2f}"])
    data.append(["", "", "", Paragraph(f"<b>TOTAL ({inv['currency']})</b>", tr), f"{total:,.2f}"])

    num_items = len(inv['items'])
    t = Table(data, colWidths=[1*cm, 8.5*cm, 2*cm, 3*cm, 3.5*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), GREEN),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('ALIGN', (2,1), (2,-1), 'CENTER'),
        ('ALIGN', (3,1), (-1,-1), 'RIGHT'),
        ('ROWBACKGROUNDS', (0,1), (-1,num_items), [white, GRAY_BG]),
        ('GRID', (0,0), (-1,num_items), 0.5, HexColor("#DDDDDD")),
        ('LINEBELOW', (0,0), (-1,0), 1, GREEN),
        ('LINEABOVE', (3,-1), (-1,-1), 1.5, GREEN),
        ('FONTNAME', (4,-1), (4,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (4,-1), (4,-1), 11),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 6*mm))

    # Terms
    terms_style = ParagraphStyle('trm', parent=ts, fontSize=8, textColor=HexColor("#666666"))
    elements.append(Paragraph("<b>Terms:</b> Net 90 days. Late payment: 2%/month interest.", terms_style))

    doc.build(elements)
    return subtotal, vat, total


if __name__ == "__main__":
    print("Generating 15 invoices (5 Approved, 5 Rejected, 5 Refer)...")
    print(f"Output: {OUTPUT_DIR}\n")
    print(f"{'#':<3} {'File':<42} {'Status':<10} {'Rule':<45} {'Total'}")
    print("-" * 120)

    for i, inv in enumerate(all_invoices, 1):
        filepath = os.path.join(OUTPUT_DIR, inv['filename'])
        sub, vat, total = create_invoice_pdf(inv, filepath)
        print(f"{i:<3} {inv['filename']:<42} {inv['label']:<10} {inv['rule_note']:<45} {inv['currency']} {total:>12,.2f}")

    print(f"\nDone! 15 invoices in: {OUTPUT_DIR}")
