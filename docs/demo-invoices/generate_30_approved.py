"""
Generate 30 APPROVED invoices with new invoice numbers ANB-INV-2026-901..930.
All rules pass. Amounts between 10,000-30,000 AED.
Seller: Al Noor Building Materials Trading LLC
Buyer: Al Masraf Industries LLC
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

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "approved-30-invoices")
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
    {"num": "ANB-INV-2026-901", "date": "01 May 2026", "due": "30 Jul 2026",
     "items": [("Ready Mix Concrete C40 per cbm", 40, 450.00), ("Pump Hire Half Day", 2, 1850.00)]},
    {"num": "ANB-INV-2026-902", "date": "02 May 2026", "due": "31 Jul 2026",
     "items": [("Ceramic Floor Tile 600x600mm sqm", 200, 65.00), ("Tile Adhesive 25kg", 50, 48.00)]},
    {"num": "ANB-INV-2026-903", "date": "03 May 2026", "due": "01 Aug 2026",
     "items": [("Aluminium Window 1200x1500mm", 8, 1850.00), ("Sealant Silicone 310ml Box/24", 10, 185.00)]},
    {"num": "ANB-INV-2026-904", "date": "04 May 2026", "due": "02 Aug 2026",
     "items": [("GI Pipe 2 inch 6m", 100, 145.00), ("Elbow GI 2 inch", 50, 28.00), ("Union GI 2 inch", 30, 35.00)]},
    {"num": "ANB-INV-2026-905", "date": "05 May 2026", "due": "03 Aug 2026",
     "items": [("Gypsum Board 12.5mm 2400x1200", 300, 48.00), ("Metal Track 3m", 200, 18.50)]},
    {"num": "ANB-INV-2026-906", "date": "06 May 2026", "due": "04 Aug 2026",
     "items": [("LED Downlight 12W Recessed", 150, 85.00), ("LED Driver Constant Current", 150, 28.00)]},
    {"num": "ANB-INV-2026-907", "date": "07 May 2026", "due": "05 Aug 2026",
     "items": [("PPR Pipe 32mm 4m", 200, 38.00), ("PPR Elbow 32mm", 100, 12.00), ("PPR Tee 32mm", 80, 15.00)]},
    {"num": "ANB-INV-2026-908", "date": "08 May 2026", "due": "06 Aug 2026",
     "items": [("Paint Exterior Weathershield 20L", 40, 385.00), ("Roller 9 inch Pro Set", 20, 48.00)]},
    {"num": "ANB-INV-2026-909", "date": "09 May 2026", "due": "07 Aug 2026",
     "items": [("Cable 2C 4sqmm 100m Roll", 30, 485.00), ("MCB 20A SP", 50, 45.00)]},
    {"num": "ANB-INV-2026-910", "date": "10 May 2026", "due": "08 Aug 2026",
     "items": [("Interlocking Paver 200x100x60mm sqm", 300, 55.00), ("Edge Restraint 3m", 50, 48.00)]},
    {"num": "ANB-INV-2026-911", "date": "11 May 2026", "due": "09 Aug 2026",
     "items": [("Hardwood Door Blank 900x2100mm", 15, 850.00), ("Hinges SS 4 inch Pair", 30, 48.00)]},
    {"num": "ANB-INV-2026-912", "date": "12 May 2026", "due": "10 Aug 2026",
     "items": [("Shower Tray 900x900mm Acrylic", 10, 850.00), ("Waste Trap 50mm Chrome", 10, 65.00), ("Mixer Tap Basin Chrome", 10, 485.00)]},
    {"num": "ANB-INV-2026-913", "date": "13 May 2026", "due": "11 Aug 2026",
     "items": [("Fire Rated Door 1200x2100mm", 4, 4850.00), ("Door Closer TS4000", 4, 485.00)]},
    {"num": "ANB-INV-2026-914", "date": "14 May 2026", "due": "12 Aug 2026",
     "items": [("Insulation Rockwool 50mm sqm", 200, 48.00), ("Vapour Barrier 50m Roll", 10, 245.00)]},
    {"num": "ANB-INV-2026-915", "date": "15 May 2026", "due": "13 Aug 2026",
     "items": [("Stainless Handrail 50mm 3m", 10, 1250.00), ("Wall Bracket SS Pair", 20, 85.00)]},
    {"num": "ANB-INV-2026-916", "date": "16 May 2026", "due": "14 Aug 2026",
     "items": [("Access Panel 600x600mm", 20, 185.00), ("Ceiling Hatch 600x600mm", 10, 285.00)]},
    {"num": "ANB-INV-2026-917", "date": "17 May 2026", "due": "15 Aug 2026",
     "items": [("Epoxy Floor Paint 20L Kit", 8, 1850.00), ("Primer Epoxy 5L", 8, 285.00)]},
    {"num": "ANB-INV-2026-918", "date": "18 May 2026", "due": "16 Aug 2026",
     "items": [("Expansion Joint Filler 20mm 3m", 100, 65.00), ("Sealant PU 600ml", 80, 48.00)]},
    {"num": "ANB-INV-2026-919", "date": "19 May 2026", "due": "17 Aug 2026",
     "items": [("Smoke Detector Optical", 50, 125.00), ("Detector Base", 50, 28.00), ("Fire Bell 6 inch", 10, 185.00)]},
    {"num": "ANB-INV-2026-920", "date": "20 May 2026", "due": "18 Aug 2026",
     "items": [("Vinyl Floor Tile 3mm 600x600 sqm", 150, 85.00), ("Floor Adhesive 15kg", 20, 125.00)]},
    {"num": "ANB-INV-2026-921", "date": "21 May 2026", "due": "19 Aug 2026",
     "items": [("WC Pan Wall-Hung", 8, 1850.00), ("Concealed Cistern Frame", 8, 1250.00)]},
    {"num": "ANB-INV-2026-922", "date": "22 May 2026", "due": "20 Aug 2026",
     "items": [("Cable Tray 150x50mm 3m HDG", 60, 125.00), ("Tray Cover 150mm 3m", 60, 65.00)]},
    {"num": "ANB-INV-2026-923", "date": "23 May 2026", "due": "21 Aug 2026",
     "items": [("Granite Countertop per sqm", 10, 1250.00), ("Edge Profile Bullnose per m", 8, 185.00)]},
    {"num": "ANB-INV-2026-924", "date": "24 May 2026", "due": "22 Aug 2026",
     "items": [("Split AC 2 Ton Inverter", 4, 3850.00), ("Copper Pipe Kit 1/4+3/8 15m", 4, 485.00)]},
    {"num": "ANB-INV-2026-925", "date": "25 May 2026", "due": "23 Aug 2026",
     "items": [("Carpet Tile 500x500mm sqm", 200, 75.00), ("Tackifier Adhesive 10L", 5, 185.00)]},
    {"num": "ANB-INV-2026-926", "date": "26 May 2026", "due": "24 Aug 2026",
     "items": [("Distribution Board 16-Way TPN", 3, 4850.00), ("MCCB 100A 3P", 3, 850.00)]},
    {"num": "ANB-INV-2026-927", "date": "27 May 2026", "due": "25 Aug 2026",
     "items": [("Raised Floor Panel 600x600mm", 100, 145.00), ("Pedestal Adjustable 200-300mm", 100, 48.00)]},
    {"num": "ANB-INV-2026-928", "date": "28 May 2026", "due": "26 Aug 2026",
     "items": [("Glass Partition 12mm Tempered sqm", 12, 850.00), ("Patch Fitting Set", 6, 485.00)]},
    {"num": "ANB-INV-2026-929", "date": "29 May 2026", "due": "27 Aug 2026",
     "items": [("Sprinkler Head Upright K5.6", 100, 48.00), ("Sprinkler Pipe 1 inch 6m", 50, 85.00), ("Pipe Clamp 1 inch Box/50", 10, 125.00)]},
    {"num": "ANB-INV-2026-930", "date": "30 May 2026", "due": "28 Aug 2026",
     "items": [("Acoustic Panel 50mm 1200x600", 80, 125.00), ("Suspension Grid T-Bar 3.6m", 100, 28.00)]},
]


def create_invoice_pdf(inv, output_path):
    doc = SimpleDocTemplate(output_path, pagesize=A4,
        topMargin=1.5*cm, bottomMargin=1.5*cm, leftMargin=1.5*cm, rightMargin=1.5*cm)
    styles = getSampleStyleSheet()
    ts = ParagraphStyle('ts', parent=styles['Normal'], fontSize=9, leading=12)
    tr = ParagraphStyle('tr', parent=styles['Normal'], fontSize=9, alignment=TA_RIGHT)
    elements = []

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
        [Paragraph(f"<b>Invoice No:</b> {inv['num']}", ts), Paragraph(f"<b>From:</b> {SELLER}", ts)],
        [Paragraph(f"<b>Date:</b> {inv['date']}", ts), Paragraph(f"TRN: {SELLER_TRN}", ts)],
        [Paragraph(f"<b>Due Date:</b> {inv['due']}", ts), Paragraph(f"IBAN: {IBAN}", ts)],
        [Paragraph("<b>Currency:</b> AED", ts), Paragraph(f"SWIFT: {SWIFT}", ts)],
    ]
    ht = Table(header_data, colWidths=[9*cm, 9*cm])
    ht.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 1), ('BOTTOMPADDING', (0,0), (-1,-1), 1)]))
    elements.append(ht)
    elements.append(Spacer(1, 4*mm))
    elements.append(Paragraph(f"<b>Bill To:</b> {BUYER} | TRN: {BUYER_TRN}", ts))
    elements.append(Spacer(1, 4*mm))

    subtotal = sum(qty * rate for _, qty, rate in inv['items'])
    vat = round(subtotal * 0.05, 2)
    total = round(subtotal + vat, 2)

    data = [["#", "Description", "Qty", "Rate (AED)", "Amount (AED)"]]
    for i, (desc, qty, rate) in enumerate(inv['items'], 1):
        data.append([str(i), desc, str(qty), f"{rate:,.2f}", f"{qty*rate:,.2f}"])
    data.append(["", "", "", Paragraph("<b>Subtotal</b>", tr), f"{subtotal:,.2f}"])
    data.append(["", "", "", Paragraph("<b>VAT (5%)</b>", tr), f"{vat:,.2f}"])
    data.append(["", "", "", Paragraph("<b>TOTAL (AED)</b>", tr), f"{total:,.2f}"])

    num_items = len(inv['items'])
    t = Table(data, colWidths=[1*cm, 8.5*cm, 2*cm, 3*cm, 3.5*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), GREEN), ('TEXTCOLOR', (0,0), (-1,0), white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'), ('FONTSIZE', (0,0), (-1,-1), 9),
        ('ALIGN', (0,0), (-1,0), 'CENTER'), ('ALIGN', (2,1), (2,-1), 'CENTER'),
        ('ALIGN', (3,1), (-1,-1), 'RIGHT'),
        ('ROWBACKGROUNDS', (0,1), (-1,num_items), [white, GRAY_BG]),
        ('GRID', (0,0), (-1,num_items), 0.5, HexColor("#DDDDDD")),
        ('LINEBELOW', (0,0), (-1,0), 1, GREEN),
        ('LINEABOVE', (3,-1), (-1,-1), 1.5, GREEN),
        ('FONTNAME', (4,-1), (4,-1), 'Helvetica-Bold'), ('FONTSIZE', (4,-1), (4,-1), 11),
        ('TOPPADDING', (0,0), (-1,-1), 4), ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 6*mm))
    elements.append(Paragraph("<b>Terms:</b> Net 90 days. Late payment: 2%/month interest.",
        ParagraphStyle('trm', parent=ts, fontSize=8, textColor=HexColor("#666666"))))
    doc.build(elements)
    return total


if __name__ == "__main__":
    print("Generating 30 APPROVED invoices (ANB-INV-2026-901 to 930)...")
    print(f"Output: {OUTPUT_DIR}\n")
    print(f"{'#':<3} {'Invoice':<20} {'Total':>12}")
    print("-" * 38)

    for i, inv in enumerate(invoices, 1):
        filename = f"{i:02d}_APPROVED_{inv['num']}.pdf"
        filepath = os.path.join(OUTPUT_DIR, filename)
        total = create_invoice_pdf(inv, filepath)
        print(f"{i:<3} {inv['num']:<20} AED {total:>10,.2f}")

    print(f"\nDone! 30 invoices in: {OUTPUT_DIR}")
