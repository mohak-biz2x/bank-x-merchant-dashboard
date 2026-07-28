"""
Generate 10 APPROVED invoices with new invoice numbers ANB-INV-2026-701..710.
All rules pass. Same seller/buyer as other batches.
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

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "approved-10-invoices")
os.makedirs(OUTPUT_DIR, exist_ok=True)

GREEN   = HexColor("#036836")
GRAY_BG = HexColor("#F5F5F5")

SELLER      = "Al Noor Building Materials Trading LLC"
SELLER_TRN  = "300456789012345"
BUYER       = "Al Masraf Industries LLC"
BUYER_TRN   = "100234567890003"
IBAN        = "AE290260001015432187690"
SWIFT       = "ADCBAEAAXXX"

invoices = [
    {
        "filename": "01_APPROVED_precast_panels.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-701", "date": "04 May 2026", "due_date": "02 Aug 2026",
        "items": [
            ("Precast Concrete Wall Panel 3x1.2m", 80, 2850.00),
            ("Precast Slab Panel 6x1.2m 150mm", 40, 4850.00),
            ("Lifting Insert Socket M16 Box/50", 30, 485.00),
        ],
    },
    {
        "filename": "02_APPROVED_hvac_ductwork.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-702", "date": "06 May 2026", "due_date": "04 Aug 2026",
        "items": [
            ("GI Duct 600x400mm per metre", 200, 185.00),
            ("Flexible Duct 250mm 6m", 150, 125.00),
            ("Volume Control Damper 400x300mm", 60, 485.00),
            ("Grille Supply Air 600x200mm", 100, 145.00),
        ],
    },
    {
        "filename": "03_APPROVED_lift_installation.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-703", "date": "08 May 2026", "due_date": "06 Aug 2026",
        "items": [
            ("Passenger Lift 8-Person 1.6m/s", 2, 185000.00),
            ("Lift Car Interior SS Hairline Finish", 2, 28500.00),
            ("Automatic Sliding Door Operator", 4, 12500.00),
        ],
    },
    {
        "filename": "04_APPROVED_mep_cabling.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-704", "date": "10 May 2026", "due_date": "08 Aug 2026",
        "items": [
            ("XLPE Cable 4C 95sqmm per metre", 500, 285.00),
            ("PVC Cable 2C 2.5sqmm 100m Roll", 200, 185.00),
            ("Cable Tray Hot-Dip Galv 200x50 3m", 300, 125.00),
            ("Distribution Board 12-Way TPN", 20, 4850.00),
        ],
    },
    {
        "filename": "05_APPROVED_facade_glazing.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-705", "date": "12 May 2026", "due_date": "10 Aug 2026",
        "items": [
            ("Unitized Curtain Wall Panel 1.5x3.6m", 60, 8500.00),
            ("Structural Silicone Glazing 600ml", 500, 95.00),
            ("Aluminium Mullion Profile 5.4m", 120, 485.00),
        ],
    },
    {
        "filename": "06_APPROVED_plumbing_works.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-706", "date": "14 May 2026", "due_date": "12 Aug 2026",
        "items": [
            ("PPR Pipe 63mm PN20 4m", 400, 85.00),
            ("Gate Valve Brass 2 inch", 80, 185.00),
            ("Water Heater 80L Electric", 30, 1850.00),
            ("Floor Drain SS 150x150mm", 100, 125.00),
        ],
    },
    {
        "filename": "07_APPROVED_road_infrastructure.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-707", "date": "16 May 2026", "due_date": "14 Aug 2026",
        "items": [
            ("Concrete Kerb Stone 500x300x150mm", 800, 48.00),
            ("Interlocking Paver Block 200x100x80mm per sqm", 2000, 65.00),
            ("Street Light Pole 9m Octagonal", 30, 4850.00),
            ("Road Sign Reflective 600x600mm", 50, 485.00),
        ],
    },
    {
        "filename": "08_APPROVED_steel_structure.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-708", "date": "18 May 2026", "due_date": "16 Aug 2026",
        "items": [
            ("Steel Column UC 254x254x89 6m", 40, 8500.00),
            ("Steel Beam UB 457x191x67 12m", 30, 12500.00),
            ("Base Plate 500x500x25mm with Bolts", 40, 1850.00),
            ("Purlins Z200 7.5m", 200, 285.00),
        ],
    },
    {
        "filename": "09_APPROVED_fit_out_materials.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-709", "date": "20 May 2026", "due_date": "18 Aug 2026",
        "items": [
            ("Gypsum Board 12.5mm 2400x1200mm", 800, 48.00),
            ("Metal Stud 92mm 3m", 600, 28.00),
            ("Joint Compound 25kg Bucket", 200, 65.00),
            ("Acrylic Emulsion Paint 20L", 150, 185.00),
        ],
    },
    {
        "filename": "10_APPROVED_fire_alarm_system.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-710", "date": "22 May 2026", "due_date": "20 Aug 2026",
        "items": [
            ("Fire Alarm Control Panel 32-Zone", 3, 18500.00),
            ("Smoke Detector Addressable", 200, 185.00),
            ("Manual Call Point", 60, 125.00),
            ("Fire Rated Cable 1.5mm 2C 100m", 50, 485.00),
            ("Horn Strobe Notification Device", 80, 245.00),
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

    elements.append(Paragraph("<b>TAX INVOICE</b>",
        ParagraphStyle('ti', parent=styles['Heading1'], fontSize=22, textColor=GREEN)))
    elements.append(Spacer(1, 3*mm))

    header_data = [
        [Paragraph(f"<b>Invoice No:</b> {inv['number']}", ts),
         Paragraph(f"<b>From:</b> {SELLER}", ts)],
        [Paragraph(f"<b>Date:</b> {inv['date']}", ts),
         Paragraph(f"TRN: {SELLER_TRN}", ts)],
        [Paragraph(f"<b>Due Date:</b> {inv['due_date']}", ts),
         Paragraph(f"IBAN: {IBAN}", ts)],
        [Paragraph(f"<b>Currency:</b> AED", ts),
         Paragraph(f"SWIFT: {SWIFT}", ts)],
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
    data.append(["", "", "", Paragraph("<b>TOTAL (AED)</b>", tr), f"{total:,.2f}"])

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
    print("Generating 10 APPROVED invoices...")
    print(f"Invoice numbers: ANB-INV-2026-701 to ANB-INV-2026-710")
    print(f"Output: {OUTPUT_DIR}\n")
    print(f"{'#':<3} {'File':<45} {'Total':>14}")
    print("-" * 65)

    for i, inv in enumerate(invoices, 1):
        filepath = os.path.join(OUTPUT_DIR, inv['filename'])
        sub, vat, total = create_invoice_pdf(inv, filepath)
        print(f"{i:<3} {inv['filename']:<45} AED {total:>10,.2f}")

    print(f"\nDone! 10 approved invoices in: {OUTPUT_DIR}")
