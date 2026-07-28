"""
Generate 10 APPROVED invoices for Supplier 4: Titan MEP Solutions LLC.
Buyer: ENCORE CLACK (TRN: MFJSK1K3)
Supplier IBAN: AE350030012285049920002
Invoice numbers: TMS-INV-2026-901..910
Amounts: 10,000 - 30,000 AED range
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT
import os

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "supplier-invoices", "supplier4_titan_mep")
os.makedirs(OUTPUT_DIR, exist_ok=True)

GREEN   = HexColor("#036836")
GRAY_BG = HexColor("#F5F5F5")

SELLER      = "Titan MEP Solutions LLC"
SELLER_TRN  = "300912345678901"
SELLER_IBAN = "AE350030012285049920002"
SELLER_SWIFT = "BOMLAEAD"

BUYER       = "ENCORE CLACK"
BUYER_TRN   = "MFJSK1K3"

invoices = [
    {
        "filename": "01_APPROVED_TMS-INV-2026-901.pdf",
        "number": "TMS-INV-2026-901", "date": "02 May 2026", "due_date": "31 Jul 2026",
        "items": [
            ("Copper Pipe 15mm Type B 3m", 200, 42.00),
            ("Pipe Insulation 15mm 2m length", 300, 18.50),
            ("Soldering Flux 250g Tin", 50, 28.00),
        ],
    },
    {
        "filename": "02_APPROVED_TMS-INV-2026-902.pdf",
        "number": "TMS-INV-2026-902", "date": "04 May 2026", "due_date": "02 Aug 2026",
        "items": [
            ("MCB 20A Single Pole Box/12", 40, 285.00),
            ("RCD 40A 30mA 2-Pole", 30, 185.00),
            ("Consumer Unit 12-Way Metal", 10, 485.00),
        ],
    },
    {
        "filename": "03_APPROVED_TMS-INV-2026-903.pdf",
        "number": "TMS-INV-2026-903", "date": "06 May 2026", "due_date": "04 Aug 2026",
        "items": [
            ("Duct Tape Aluminium 50mm 50m", 100, 28.00),
            ("GI Duct 400x200mm per metre", 80, 125.00),
            ("Flexible Connection 200mm 1m", 50, 65.00),
        ],
    },
    {
        "filename": "04_APPROVED_TMS-INV-2026-904.pdf",
        "number": "TMS-INV-2026-904", "date": "08 May 2026", "due_date": "06 Aug 2026",
        "items": [
            ("Basin Mixer Tap Chrome", 30, 385.00),
            ("Angle Valve 1/2 inch Chrome", 60, 48.00),
            ("Flexible Hose 300mm Pair", 60, 28.00),
            ("P-Trap 32mm Chrome", 30, 65.00),
        ],
    },
    {
        "filename": "05_APPROVED_TMS-INV-2026-905.pdf",
        "number": "TMS-INV-2026-905", "date": "10 May 2026", "due_date": "08 Aug 2026",
        "items": [
            ("Split AC Indoor Unit 2T", 8, 1850.00),
            ("Refrigerant R410A 11.3kg", 10, 485.00),
            ("AC Bracket Wall-Mount Heavy", 8, 125.00),
        ],
    },
    {
        "filename": "06_APPROVED_TMS-INV-2026-906.pdf",
        "number": "TMS-INV-2026-906", "date": "12 May 2026", "due_date": "10 Aug 2026",
        "items": [
            ("Cable Tray 150x50mm 3m Galv", 60, 95.00),
            ("Tray Cover 150mm 3m", 60, 48.00),
            ("Tray Coupler Set", 100, 18.00),
            ("Earth Bar Copper 12-Way", 10, 485.00),
        ],
    },
    {
        "filename": "07_APPROVED_TMS-INV-2026-907.pdf",
        "number": "TMS-INV-2026-907", "date": "14 May 2026", "due_date": "12 Aug 2026",
        "items": [
            ("Fire Sprinkler Head 68C K5.6", 100, 48.00),
            ("Sprinkler Pipe 1 inch Galv 6m", 50, 125.00),
            ("Flow Switch 4 inch Flanged", 5, 1850.00),
        ],
    },
    {
        "filename": "08_APPROVED_TMS-INV-2026-908.pdf",
        "number": "TMS-INV-2026-908", "date": "16 May 2026", "due_date": "14 Aug 2026",
        "items": [
            ("LED Downlight 12W 4000K", 150, 65.00),
            ("LED Panel 600x600 40W", 40, 145.00),
            ("Emergency Conversion Kit", 20, 185.00),
        ],
    },
    {
        "filename": "09_APPROVED_TMS-INV-2026-909.pdf",
        "number": "TMS-INV-2026-909", "date": "18 May 2026", "due_date": "16 Aug 2026",
        "items": [
            ("PPR Pipe 25mm 4m PN20", 200, 28.00),
            ("PPR Elbow 25mm 90deg", 100, 8.50),
            ("PPR Tee 25mm", 80, 12.00),
            ("PPR Ball Valve 25mm", 40, 48.00),
        ],
    },
    {
        "filename": "10_APPROVED_TMS-INV-2026-910.pdf",
        "number": "TMS-INV-2026-910", "date": "20 May 2026", "due_date": "18 Aug 2026",
        "items": [
            ("Exhaust Fan 200mm Axial", 20, 285.00),
            ("Flexible Duct 200mm 6m", 30, 95.00),
            ("Grille Extract 300x150mm", 40, 65.00),
            ("Duct Sealant Grey 310ml", 50, 18.00),
        ],
    },
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
        "<b>APPROVED</b> | All rules pass",
        ParagraphStyle('b', parent=ts, fontSize=8, textColor=white)
    )]], colWidths=[18*cm])
    banner.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), GREEN),
        ('TOPPADDING', (0,0), (-1,-1), 4), ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(banner)
    elements.append(Spacer(1, 4*mm))

    elements.append(Paragraph("<b>TAX INVOICE</b>",
        ParagraphStyle('ti', parent=styles['Heading1'], fontSize=22, textColor=GREEN)))
    elements.append(Spacer(1, 3*mm))

    header_data = [
        [Paragraph(f"<b>Invoice No:</b> {inv['number']}", ts),
         Paragraph(f"<b>From:</b> {SELLER}", ts)],
        [Paragraph(f"<b>Date:</b> {inv['date']}", ts),
         Paragraph(f"TRN: {SELLER_TRN}", ts)],
        [Paragraph(f"<b>Due Date:</b> {inv['due_date']}", ts),
         Paragraph(f"IBAN: {SELLER_IBAN}", ts)],
        [Paragraph(f"<b>Currency:</b> AED", ts),
         Paragraph(f"SWIFT: {SELLER_SWIFT}", ts)],
    ]
    ht = Table(header_data, colWidths=[9*cm, 9*cm])
    ht.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 1), ('BOTTOMPADDING', (0,0), (-1,-1), 1)]))
    elements.append(ht)
    elements.append(Spacer(1, 4*mm))

    elements.append(Paragraph(
        f"<b>Bill To:</b> {BUYER} | TRN: {BUYER_TRN}", ts))
    elements.append(Spacer(1, 4*mm))

    subtotal = sum(qty * rate for _, qty, rate in inv['items'])
    vat = round(subtotal * 0.05, 2)
    total = round(subtotal + vat, 2)

    data = [["#", "Description", "Qty", "Rate (AED)", "Amount (AED)"]]
    for i, (desc, qty, rate) in enumerate(inv['items'], 1):
        amt = qty * rate
        data.append([str(i), desc, str(qty), f"{rate:,.2f}", f"{amt:,.2f}"])

    data.append(["", "", "", Paragraph("<b>Subtotal</b>", tr), f"{subtotal:,.2f}"])
    data.append(["", "", "", Paragraph("<b>VAT (5%)</b>", tr), f"{vat:,.2f}"])
    data.append(["", "", "", Paragraph(f"<b>TOTAL (AED)</b>", tr), f"{total:,.2f}"])

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
    return total


if __name__ == "__main__":
    print("Generating 10 APPROVED invoices for Titan MEP Solutions LLC...")
    print(f"Buyer: {BUYER} | TRN: {BUYER_TRN}")
    print(f"Supplier IBAN: {SELLER_IBAN}")
    print(f"Output: {OUTPUT_DIR}\n")
    print(f"{'#':<3} {'Invoice':<20} {'Total':>12}")
    print("-" * 40)

    for i, inv in enumerate(invoices, 1):
        filepath = os.path.join(OUTPUT_DIR, inv['filename'])
        total = create_invoice_pdf(inv, filepath)
        print(f"{i:<3} {inv['number']:<20} AED {total:>10,.2f}")

    print(f"\nDone! 10 approved invoices in: {OUTPUT_DIR}")
