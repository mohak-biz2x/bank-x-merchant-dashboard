"""
Generate 5 small-value APPROVED invoices (AED 10,000–30,000 total).
Invoice numbers: ANB-INV-2026-431 to ANB-INV-2026-435
All rules pass. Dates: May/Jun 2026 invoice, Aug/Sep 2026 due.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT
import os

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mixed-30-invoices")
os.makedirs(OUTPUT_DIR, exist_ok=True)

GREEN   = HexColor("#036836")
GRAY_BG = HexColor("#F5F5F5")

SELLER     = "Al Noor Building Materials Trading LLC"
SELLER_TRN = "300456789012345"
BUYER      = "Al Masraf Industries LLC"
BUYER_TRN  = "100234567890003"
IBAN       = "AE290260001015432187690"
SWIFT      = "ADCBAEAAXXX"

invoices = [
    {
        "filename": "31_APPROVED_small_hardware_supplies.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-431", "date": "02 Jun 2026", "due_date": "01 Sep 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Stainless Steel Screws M6x50 Box/200", 30, 48.50),
            ("Wall Plugs Nylon 8mm Box/100", 50, 22.00),
            ("Masonry Drill Bit Set 5-12mm", 20, 185.00),
            ("Spirit Level 1200mm Aluminium", 15, 245.00),
            ("Measuring Tape 10m Steel", 25, 68.00),
        ],
        "currency": "AED",
        # Subtotal = 1455+1100+3700+3675+1700 = 11,630 → Total ~12,211.50
    },
    {
        "filename": "32_APPROVED_small_paint_consumables.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-432", "date": "05 Jun 2026", "due_date": "04 Sep 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Paint Roller 9in with Frame", 40, 38.50),
            ("Paint Brush Set 1-4in 5-piece", 30, 65.00),
            ("Masking Tape 48mm x 50m", 60, 18.50),
            ("Sandpaper Assorted Grit Pack/10", 50, 28.00),
            ("Paint Tray Plastic Large", 40, 22.50),
            ("Drop Sheet Canvas 3x4m", 20, 145.00),
        ],
        "currency": "AED",
        # Subtotal ~10,960 → Total ~11,508
    },
    {
        "filename": "33_APPROVED_small_electrical_fittings.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-433", "date": "08 Jun 2026", "due_date": "07 Sep 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Single Socket Outlet 13A White", 80, 28.50),
            ("Single Switch 1-Gang 10A White", 60, 22.00),
            ("Junction Box 100x100mm IP55", 40, 45.00),
            ("Cable Tie 300mm Pack/100", 30, 18.50),
            ("PVC Electrical Tape 19mm x 20m", 50, 12.00),
            ("Conduit Clip 25mm Box/50", 40, 35.00),
        ],
        "currency": "AED",
        # Subtotal ~7,870 → Total ~8,263.50 — bump qty to hit range
        # Adjusted: socket 80→150, switch 60→120
    },
    {
        "filename": "34_APPROVED_small_plumbing_fittings.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-434", "date": "10 Jun 2026", "due_date": "09 Sep 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("UPVC Elbow 90deg 50mm", 100, 12.50),
            ("UPVC Tee 50mm", 80, 15.00),
            ("UPVC End Cap 50mm", 60, 8.50),
            ("Teflon Thread Seal Tape 12mm x 12m", 100, 6.50),
            ("Pipe Wrench 14in Aluminium", 15, 185.00),
            ("Plumber Putty 500g Tub", 40, 28.50),
            ("Compression Fitting 15mm Straight", 120, 18.00),
        ],
        "currency": "AED",
        # Subtotal ~8,755 → Total ~9,192.75 — bump to range
    },
    {
        "filename": "35_APPROVED_small_safety_consumables.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-435", "date": "12 Jun 2026", "due_date": "11 Sep 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Disposable Dust Mask FFP2 Box/20", 60, 85.00),
            ("Safety Goggles Clear Lens", 80, 28.50),
            ("Nitrile Gloves Medium Box/100", 40, 65.00),
            ("Ear Plugs Foam Pair Box/50", 30, 38.50),
            ("Knee Pads Construction Grade Pair", 25, 125.00),
            ("Reflective Armband Set/2", 50, 22.00),
        ],
        "currency": "AED",
        # Subtotal ~14,240 → Total ~14,952
    },
]

# Override items for invoices that need qty adjustment to hit 10k-30k range
# Invoice 33: boost socket/switch quantities
invoices[2]["items"] = [
    ("Single Socket Outlet 13A White", 150, 28.50),
    ("Single Switch 1-Gang 10A White", 120, 22.00),
    ("Junction Box 100x100mm IP55", 40, 45.00),
    ("Cable Tie 300mm Pack/100", 30, 18.50),
    ("PVC Electrical Tape 19mm x 20m", 50, 12.00),
    ("Conduit Clip 25mm Box/50", 40, 35.00),
]
# Invoice 34: boost quantities
invoices[3]["items"] = [
    ("UPVC Elbow 90deg 50mm", 200, 12.50),
    ("UPVC Tee 50mm", 150, 15.00),
    ("UPVC End Cap 50mm", 100, 8.50),
    ("Teflon Thread Seal Tape 12mm x 12m", 150, 6.50),
    ("Pipe Wrench 14in Aluminium", 15, 185.00),
    ("Plumber Putty 500g Tub", 60, 28.50),
    ("Compression Fitting 15mm Straight", 200, 18.00),
]


def create_invoice_pdf(inv, output_path):
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
        ('BACKGROUND', (0,0), (-1,-1), GREEN),
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
         Paragraph(f"IBAN: {IBAN}", ts)],
        [Paragraph(f"<b>Currency:</b> {inv['currency']}", ts),
         Paragraph(f"SWIFT: {SWIFT}", ts)],
    ]
    ht = Table(header_data, colWidths=[9*cm, 9*cm])
    ht.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 1), ('BOTTOMPADDING', (0,0), (-1,-1), 1)]))
    elements.append(ht)
    elements.append(Spacer(1, 4*mm))

    elements.append(Paragraph(
        f"<b>Bill To:</b> {inv['buyer']} | TRN: {inv['buyer_trn']}", ts))
    elements.append(Spacer(1, 4*mm))

    subtotal = sum(qty * rate for _, qty, rate in inv['items'])
    vat   = round(subtotal * 0.05, 2)
    total = round(subtotal + vat, 2)

    data = [["#", "Description", "Qty", f"Rate ({inv['currency']})", f"Amount ({inv['currency']})"]]
    for i, (desc, qty, rate) in enumerate(inv['items'], 1):
        data.append([str(i), desc, str(qty), f"{rate:,.2f}", f"{qty*rate:,.2f}"])
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

    terms_style = ParagraphStyle('trm', parent=ts, fontSize=8, textColor=HexColor("#666666"))
    elements.append(Paragraph(
        "<b>Terms:</b> Net 90 days. Late payment: 2%/month interest.", terms_style))

    doc.build(elements)
    return subtotal, vat, total


if __name__ == "__main__":
    print("Generating 5 small-value APPROVED invoices (AED 10,000–30,000)...")
    print(f"Output: {OUTPUT_DIR}\n")
    print(f"{'#':<3} {'File':<48} {'Status':<10} {'Total (AED)':>14}")
    print("-" * 80)

    for i, inv in enumerate(invoices, 1):
        filepath = os.path.join(OUTPUT_DIR, inv['filename'])
        sub, vat, total = create_invoice_pdf(inv, filepath)
        in_range = "✓" if 10000 <= total <= 30000 else "✗ OUT OF RANGE"
        print(f"{i:<3} {inv['filename']:<48} {inv['label']:<10} {total:>12,.2f}  {in_range}")

    print(f"\nDone! 5 invoices added to: {OUTPUT_DIR}")
