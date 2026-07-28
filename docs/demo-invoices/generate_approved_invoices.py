"""
Generate 5 invoice PDFs that should PASS all MB-44 rule engine rules (APPROVED).

Criteria for approval:
  R1  - Unique invoice numbers (no duplicates in batch)
  R2  - Due date in the future
  R3  - Due date strictly after invoice date
  R5  - Invoice date <= today (not future-dated)
  R6  - Invoice date within contract period
  R7  - Currency is AED
  R8  - Subtotal + VAT = Total (math correct)
  R9  - Seller name matches system exactly
  R10 - Buyer name matches system exactly
  R14 - Valid TRN format (15-digit numeric)
  R15 - TRN matches system records
  R16 - No Shariah restricted goods
  R17 - Non-round amounts (not exact 50k, 100k, etc.)

System records:
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

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "approved-invoices")
os.makedirs(OUTPUT_DIR, exist_ok=True)

PRIMARY = HexColor("#036836")
GRAY_BG = HexColor("#F5F5F5")

invoices = [
    {
        "filename": "APPROVE_01_construction_materials.pdf",
        "number": "ANB-INV-2026-201",
        "date": "18 May 2026",
        "due_date": "16 Aug 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "seller_addr": "Plot 45, Mussafah Industrial Area\nAbu Dhabi, UAE",
        "seller_phone": "+971 2 443 8800",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "buyer_addr": "Office 1201, Business Bay Tower\nDubai, UAE",
        "items": [
            ("Portland Cement OPC 53 Grade 50kg bags", 800, 47.50),
            ("TMT Steel Bars 16mm Fe500D", 1500, 42.00),
            ("AAC Blocks 600x200x150mm", 5000, 8.75),
            ("Waterproofing Compound 20L drum", 120, 195.00),
        ],
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank (ADCB)",
        "iban": "AE290260001015432187690",
        "swift": "ADCBAEAAXXX",
    },
    {
        "filename": "APPROVE_02_electrical_supplies.pdf",
        "number": "ANB-INV-2026-202",
        "date": "20 May 2026",
        "due_date": "18 Aug 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "seller_addr": "Plot 45, Mussafah Industrial Area\nAbu Dhabi, UAE",
        "seller_phone": "+971 2 443 8800",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "buyer_addr": "Office 1201, Business Bay Tower\nDubai, UAE",
        "items": [
            ("Copper Cable 4 sq mm Roll 90m", 200, 285.00),
            ("MCB Circuit Breaker 32A SP", 500, 38.50),
            ("LED Panel Light 40W 600x600mm", 300, 125.00),
            ("PVC Conduit Pipe 25mm 3m length", 2000, 12.50),
            ("Distribution Board 12-Way TPN", 50, 680.00),
        ],
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank (ADCB)",
        "iban": "AE290260001015432187690",
        "swift": "ADCBAEAAXXX",
    },
    {
        "filename": "APPROVE_03_plumbing_materials.pdf",
        "number": "ANB-INV-2026-203",
        "date": "22 May 2026",
        "due_date": "20 Aug 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "seller_addr": "Plot 45, Mussafah Industrial Area\nAbu Dhabi, UAE",
        "seller_phone": "+971 2 443 8800",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "buyer_addr": "Office 1201, Business Bay Tower\nDubai, UAE",
        "items": [
            ("UPVC Pipes 110mm SWR 3m", 400, 78.00),
            ("CPVC Pipes 25mm SDR11 3m", 600, 32.50),
            ("Ball Valve Brass 1 inch", 250, 45.00),
            ("Water Tank HDPE 1000L", 30, 1250.00),
            ("Submersible Pump 1.5HP", 20, 2850.00),
            ("GI Pipe 2 inch Medium Class 6m", 150, 185.00),
        ],
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank (ADCB)",
        "iban": "AE290260001015432187690",
        "swift": "ADCBAEAAXXX",
    },
    {
        "filename": "APPROVE_04_finishing_materials.pdf",
        "number": "ANB-INV-2026-204",
        "date": "25 May 2026",
        "due_date": "23 Aug 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "seller_addr": "Plot 45, Mussafah Industrial Area\nAbu Dhabi, UAE",
        "seller_phone": "+971 2 443 8800",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "buyer_addr": "Office 1201, Business Bay Tower\nDubai, UAE",
        "items": [
            ("Porcelain Floor Tiles 800x800mm Matt", 650, 62.00),
            ("Wall Putty White 40kg bag", 300, 28.50),
            ("Emulsion Paint Interior 20L bucket", 80, 345.00),
            ("Gypsum Plaster Board 12.5mm 2400x1200", 400, 38.00),
            ("Aluminum Window Frame 1200x1500mm", 45, 1450.00),
        ],
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank (ADCB)",
        "iban": "AE290260001015432187690",
        "swift": "ADCBAEAAXXX",
    },
    {
        "filename": "APPROVE_05_safety_equipment.pdf",
        "number": "ANB-INV-2026-205",
        "date": "27 May 2026",
        "due_date": "25 Aug 2026",
        "seller": "Al Noor Building Materials Trading LLC",
        "seller_trn": "300456789012345",
        "seller_addr": "Plot 45, Mussafah Industrial Area\nAbu Dhabi, UAE",
        "seller_phone": "+971 2 443 8800",
        "buyer": "Al Masraf Industries LLC",
        "buyer_trn": "100234567890003",
        "buyer_addr": "Office 1201, Business Bay Tower\nDubai, UAE",
        "items": [
            ("Safety Helmet White ISI Marked", 500, 35.00),
            ("High Visibility Vest Orange", 500, 22.50),
            ("Safety Shoes Steel Toe Size Assorted", 300, 145.00),
            ("Construction Safety Net 10x5m", 80, 320.00),
            ("First Aid Kit Industrial 50-Person", 25, 485.00),
            ("Fire Extinguisher ABC 6kg", 60, 195.00),
        ],
        "currency": "AED",
        "bank": "Abu Dhabi Commercial Bank (ADCB)",
        "iban": "AE290260001015432187690",
        "swift": "ADCBAEAAXXX",
    },
]


def create_invoice_pdf(inv, output_path):
    doc = SimpleDocTemplate(output_path, pagesize=A4,
        topMargin=1.5*cm, bottomMargin=1.5*cm, leftMargin=1.5*cm, rightMargin=1.5*cm)
    styles = getSampleStyleSheet()
    ts = ParagraphStyle('ts', parent=styles['Normal'], fontSize=9, leading=12)
    tr = ParagraphStyle('tr', parent=styles['Normal'], fontSize=9, alignment=TA_RIGHT)
    elements = []

    # Title
    elements.append(Paragraph("<b>TAX INVOICE</b>",
        ParagraphStyle('ti', parent=styles['Heading1'], fontSize=22, textColor=PRIMARY)))
    elements.append(Spacer(1, 3*mm))

    # Header: invoice details left, supplier right
    header_data = [
        [Paragraph(f"<b>Invoice No:</b> {inv['number']}", ts),
         Paragraph(f"<b>From:</b>", ts)],
        [Paragraph(f"<b>Date:</b> {inv['date']}", ts),
         Paragraph(f"{inv['seller']}", ts)],
        [Paragraph(f"<b>Due Date:</b> {inv['due_date']}", ts),
         Paragraph(f"TRN: {inv['seller_trn']}", ts)],
        [Paragraph(f"<b>Currency:</b> {inv['currency']}", ts),
         Paragraph(f"{inv['seller_addr'].replace(chr(10), '<br/>')}", ts)],
        [Paragraph("", ts),
         Paragraph(f"Tel: {inv['seller_phone']}", ts)],
    ]
    ht = Table(header_data, colWidths=[9*cm, 9*cm])
    ht.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 1), ('BOTTOMPADDING', (0,0), (-1,-1), 1)]))
    elements.append(ht)
    elements.append(Spacer(1, 4*mm))

    # Bill To
    elements.append(Paragraph("<b>Bill To:</b>", ParagraphStyle('bh', parent=ts, textColor=PRIMARY)))
    elements.append(Paragraph(f"{inv['buyer']}", ts))
    elements.append(Paragraph(f"{inv['buyer_addr'].replace(chr(10), ', ')}", ts))
    elements.append(Paragraph(f"TRN: {inv['buyer_trn']}", ts))
    elements.append(Spacer(1, 4*mm))

    # Calculate totals
    subtotal = sum(qty * rate for _, qty, rate in inv['items'])
    vat = round(subtotal * 0.05, 2)
    total = round(subtotal + vat, 2)

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

    # Payment details
    elements.append(Paragraph("<b>Payment Details:</b>",
        ParagraphStyle('ph', parent=ts, textColor=PRIMARY)))
    pay_data = [
        ["Bank:", inv['bank']],
        ["Account Name:", inv['seller']],
        ["IBAN:", inv['iban']],
        ["SWIFT:", inv['swift']],
    ]
    pt = Table(pay_data, colWidths=[3.5*cm, 14*cm])
    pt.setStyle(TableStyle([
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('BACKGROUND', (0,0), (-1,-1), HexColor("#E8F5E9")),
        ('BOX', (0,0), (-1,-1), 0.5, PRIMARY),
    ]))
    elements.append(pt)
    elements.append(Spacer(1, 6*mm))

    # Terms
    terms_style = ParagraphStyle('trm', parent=ts, fontSize=8, textColor=HexColor("#666666"))
    elements.append(Paragraph("<b>Terms & Conditions:</b>", terms_style))
    elements.append(Paragraph("1. Payment is due within 90 days of invoice date.", terms_style))
    elements.append(Paragraph("2. Late payments are subject to 2% monthly interest.", terms_style))
    elements.append(Paragraph("3. All disputes must be raised within 7 days of receipt.", terms_style))

    doc.build(elements)
    return subtotal, vat, total


if __name__ == "__main__":
    print("Generating 5 APPROVED invoice PDFs (pass all MB-44 rules)...")
    print(f"Output: {OUTPUT_DIR}\n")
    print(f"{'#':<3} {'File':<45} {'Total (AED)':<15} {'Status'}")
    print("-" * 80)

    for i, inv in enumerate(invoices, 1):
        filepath = os.path.join(OUTPUT_DIR, inv['filename'])
        subtotal, vat, total = create_invoice_pdf(inv, filepath)
        print(f"{i:<3} {inv['filename']:<45} {total:>12,.2f}   APPROVED")

    print(f"\nDone! {len(invoices)} invoices generated in: {OUTPUT_DIR}")
    print("\nAll invoices satisfy:")
    print("  - Unique invoice numbers (R1)")
    print("  - Due date in future (R2)")
    print("  - Due date after invoice date (R3)")
    print("  - Invoice date not future-dated (R5)")
    print("  - Currency is AED (R7)")
    print("  - Math is correct: subtotal + 5% VAT = total (R8)")
    print("  - Seller name matches system exactly (R9)")
    print("  - Buyer name matches system exactly (R10)")
    print("  - Valid 15-digit TRN format (R14)")
    print("  - TRN matches system records (R15)")
    print("  - No Shariah restricted goods (R16)")
    print("  - Non-round amounts (R17)")
