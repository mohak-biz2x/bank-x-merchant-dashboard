"""
Generate 20 invoices: 10 Approved, 5 Rejected, 5 Refer.
Invoice numbers: ANB-INV-2026-601..620 (all new/unused).
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

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mixed-20-invoices")
os.makedirs(OUTPUT_DIR, exist_ok=True)

GREEN   = HexColor("#036836")
RED     = HexColor("#B71C1C")
ORANGE  = HexColor("#E65100")
GRAY_BG = HexColor("#F5F5F5")

SELLER      = "Al Noor Building Materials Trading LLC"
SELLER_TRN  = "300456789012345"
BUYER       = "Al Masraf Industries LLC"
BUYER_TRN   = "100234567890003"
IBAN        = "AE290260001015432187690"
SWIFT       = "ADCBAEAAXXX"

# ===================== 10 APPROVED INVOICES =====================
approved = [
    {
        "filename": "01_APPROVED_ceiling_systems.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-601", "date": "03 May 2026", "due_date": "01 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Metal Ceiling Strip 300mm 3m length", 600, 42.00),
            ("Ceiling Spring Hanger M8 1m", 800, 18.50),
            ("Acoustic Mineral Fibre Tile 600x600", 1200, 38.00),
        ], "currency": "AED",
    },
    {
        "filename": "02_APPROVED_welding_supplies.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-602", "date": "05 May 2026", "due_date": "03 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Welding Electrode E7018 3.2mm 5kg Box", 200, 85.00),
            ("Argon Gas Cylinder 50L Refill", 30, 650.00),
            ("MIG Wire ER70S-6 1.2mm 15kg Spool", 60, 285.00),
            ("Welding Helmet Auto-Darkening", 25, 485.00),
        ], "currency": "AED",
    },
    {
        "filename": "03_APPROVED_door_hardware.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-603", "date": "07 May 2026", "due_date": "05 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Fire Rated Door 900x2100mm 90min", 40, 4850.00),
            ("Door Closer Overhead TS5000", 80, 485.00),
            ("Panic Bar Emergency Exit 1200mm", 30, 1250.00),
            ("Mortice Lock Euro Profile Body", 100, 185.00),
        ], "currency": "AED",
    },
    {
        "filename": "04_APPROVED_cable_management.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-604", "date": "09 May 2026", "due_date": "07 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Cable Ladder 300mm 3m Hot-Dip Galv", 150, 285.00),
            ("Cable Trunking 100x100mm 3m", 200, 145.00),
            ("Fire Barrier Pillow 300x200x50mm", 400, 68.00),
            ("Cable Gland Brass M25 Box/50", 60, 185.00),
        ], "currency": "AED",
    },
    {
        "filename": "05_APPROVED_bathroom_accessories.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-605", "date": "11 May 2026", "due_date": "09 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Towel Rail Chrome 600mm", 100, 185.00),
            ("Soap Dispenser Wall-Mount Stainless", 80, 245.00),
            ("Mirror Frameless Bevelled 600x800mm", 50, 485.00),
            ("Grab Bar Stainless 450mm", 60, 145.00),
        ], "currency": "AED",
    },
    {
        "filename": "06_APPROVED_parking_equipment.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-606", "date": "13 May 2026", "due_date": "11 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Barrier Gate Automatic 6m Arm", 8, 18500.00),
            ("Ticket Dispenser Unit", 8, 12500.00),
            ("ANPR Camera 2MP LPR", 16, 4850.00),
            ("Loop Detector 2-Channel", 16, 1850.00),
        ], "currency": "AED",
    },
    {
        "filename": "07_APPROVED_signage_materials.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-607", "date": "15 May 2026", "due_date": "13 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Acrylic Sign Panel 10mm 1200x600mm", 50, 485.00),
            ("LED Channel Letters Set", 10, 8500.00),
            ("Directional Signage Aluminium 300x150mm", 200, 125.00),
            ("Floor Standing Directory Board", 5, 4850.00),
        ], "currency": "AED",
    },
    {
        "filename": "08_APPROVED_waste_management.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-608", "date": "17 May 2026", "due_date": "15 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Waste Chute System Stainless 500mm dia 3m", 20, 8500.00),
            ("Bin Enclosure Galvanised 4-Bay", 10, 12500.00),
            ("Compactor Machine 10cbm", 2, 85000.00),
            ("Recycling Bin 240L Colour-Coded", 100, 285.00),
        ], "currency": "AED",
    },
    {
        "filename": "09_APPROVED_access_control.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-609", "date": "19 May 2026", "due_date": "17 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Card Reader RFID Mifare Wall-Mount", 60, 850.00),
            ("Access Controller 4-Door", 15, 4850.00),
            ("Electric Strike 12V Fail-Safe", 60, 385.00),
            ("Proximity Card Mifare 1K Box/200", 20, 1250.00),
        ], "currency": "AED",
    },
    {
        "filename": "10_APPROVED_waterfeature_materials.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-610", "date": "21 May 2026", "due_date": "19 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Fountain Nozzle Stainless Adjustable", 20, 2850.00),
            ("Submersible Pump 3HP 25m Head", 6, 8500.00),
            ("Underwater LED Light RGB 18W", 30, 1250.00),
            ("Water Treatment UV System 50GPM", 2, 18500.00),
        ], "currency": "AED",
    },
]

# ===================== 5 REJECTED INVOICES =====================
rejected = [
    {
        "filename": "11_REJECTED_R2_past_due_date.pdf",
        "label": "REJECTED", "rule_note": "R2: Due date in the past (Jan 2025)",
        "number": "ANB-INV-2026-611", "date": "15 Sep 2024", "due_date": "15 Jan 2025",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Aluminium Window Frame 1200x1500mm", 30, 2850.00),
            ("Double Glazed Panel 6+12+6mm 1200x1500", 30, 1850.00),
        ], "currency": "AED",
    },
    {
        "filename": "12_REJECTED_R3_due_before_invoice.pdf",
        "label": "REJECTED", "rule_note": "R3: Due date (Feb 2026) before invoice date (Jun 2026)",
        "number": "ANB-INV-2026-612", "date": "12 Jun 2026", "due_date": "10 Feb 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Stainless Bollard Fixed 114mm dia 900mm", 40, 1850.00),
            ("Speed Hump Rubber 500x350x50mm", 20, 485.00),
        ], "currency": "AED",
    },
    {
        "filename": "13_REJECTED_R7_wrong_currency_EUR.pdf",
        "label": "REJECTED", "rule_note": "R7: Currency is EUR (must be AED)",
        "number": "ANB-INV-2026-613", "date": "08 Apr 2026", "due_date": "06 Oct 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Imported Porcelain Tile 800x800mm sqm", 500, 125.00),
            ("Mosaic Feature Tile Handmade sqm", 100, 485.00),
        ], "currency": "EUR",
    },
    {
        "filename": "14_REJECTED_R16_weapons_equipment.pdf",
        "label": "REJECTED", "rule_note": "R16: Shariah restricted - Weapons / arms trade",
        "number": "ANB-INV-2026-614", "date": "16 Apr 2026", "due_date": "14 Oct 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Firearms Sporting Rifle Unit", 50, 8500.00),
            ("Ammunition 9mm Box/500", 200, 650.00),
            ("Gun Safe Heavy Duty", 50, 4850.00),
        ], "currency": "AED",
    },
    {
        "filename": "15_REJECTED_R16_adult_entertainment.pdf",
        "label": "REJECTED", "rule_note": "R16: Shariah restricted - Adult entertainment",
        "number": "ANB-INV-2026-615", "date": "22 Apr 2026", "due_date": "20 Oct 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Adult Entertainment Venue Fit-Out Package", 3, 125000.00),
            ("Nightclub Lighting System", 3, 48500.00),
        ], "currency": "AED",
    },
]

# ===================== 5 REFER INVOICES =====================
refer = [
    {
        "filename": "16_REFER_R5_future_dated_nov.pdf",
        "label": "REFER", "rule_note": "R5: Invoice date (Nov 2026) is in the future",
        "number": "ANB-INV-2026-616", "date": "08 Nov 2026", "due_date": "06 Feb 2027",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Prefab Portable Cabin 6x3m Insulated", 5, 45000.00),
            ("Site Office Container 12x3m Furnished", 3, 85000.00),
        ], "currency": "AED",
    },
    {
        "filename": "17_REFER_R8_math_mismatch.pdf",
        "label": "REFER", "rule_note": "R8: Subtotal + VAT != Total (math mismatch)",
        "number": "ANB-INV-2026-617", "date": "28 Mar 2026", "due_date": "26 Sep 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Vinyl Floor Tile LVT 3mm 600x600mm sqm", 800, 95.00),
            ("Carpet Tile Premium 500x500mm sqm", 600, 125.00),
            ("Entrance Matting Heavy-Duty per sqm", 100, 285.00),
        ], "currency": "AED",
        "override_total": 175000.00,  # Wrong! Correct ~(76000+75000+28500)*1.05 = 188,422.50
    },
    {
        "filename": "18_REFER_R9_seller_name_mismatch.pdf",
        "label": "REFER", "rule_note": "R9: Seller name differs from system (ANB Materials LLC)",
        "number": "ANB-INV-2026-618", "date": "30 Mar 2026", "due_date": "28 Sep 2026",
        "seller": "ANB Materials LLC",  # Abbreviated - mismatch
        "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Drywall Screw 3.5x25mm Box/1000", 500, 28.00),
            ("Metal Stud 75mm 3m length", 400, 38.00),
            ("Corner Bead Galvanised 3m", 300, 22.00),
        ], "currency": "AED",
    },
    {
        "filename": "19_REFER_R14_invalid_trn_format.pdf",
        "label": "REFER", "rule_note": "R14: Invalid TRN format (contains dashes)",
        "number": "ANB-INV-2026-619", "date": "04 Apr 2026", "due_date": "03 Oct 2026",
        "seller": SELLER, "seller_trn": "300-456-789-012-345",  # Invalid - dashes
        "buyer": BUYER, "buyer_trn": "100-234-567-890-003",      # Invalid - dashes
        "items": [
            ("Epoxy Primer 2-Part 20L Kit", 60, 485.00),
            ("Polyurethane Topcoat 20L", 60, 650.00),
            ("Anti-Corrosion Paint Industrial 20L", 40, 385.00),
        ], "currency": "AED",
    },
    {
        "filename": "20_REFER_R17_round_number_200k.pdf",
        "label": "REFER", "rule_note": "R17: Total is exact round number AED 200,000",
        "number": "ANB-INV-2026-620", "date": "10 Apr 2026", "due_date": "09 Jul 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Fit-Out Works Package - Tower A Lobby", 1, 190476.19),
        ], "currency": "AED",
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
         Paragraph(f"IBAN: {IBAN}", ts)],
        [Paragraph(f"<b>Currency:</b> {inv['currency']}", ts),
         Paragraph(f"SWIFT: {SWIFT}", ts)],
    ]
    ht = Table(header_data, colWidths=[9*cm, 9*cm])
    ht.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 1), ('BOTTOMPADDING', (0,0), (-1,-1), 1)]))
    elements.append(ht)
    elements.append(Spacer(1, 4*mm))

    # Bill To
    elements.append(Paragraph(
        f"<b>Bill To:</b> {inv['buyer']} | TRN: {inv['buyer_trn']}", ts))
    elements.append(Spacer(1, 4*mm))

    # Calculate amounts
    subtotal = inv.get("override_subtotal",
        sum(qty * rate for _, qty, rate in inv['items']))
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
    elements.append(Paragraph(
        "<b>Terms:</b> Net 90 days. Late payment: 2%/month interest.", terms_style))

    doc.build(elements)
    return subtotal, vat, total


if __name__ == "__main__":
    print("Generating 20 invoices (10 Approved, 5 Rejected, 5 Refer)...")
    print(f"Invoice numbers: ANB-INV-2026-601 to ANB-INV-2026-620")
    print(f"Output: {OUTPUT_DIR}\n")
    print(f"{'#':<3} {'File':<50} {'Status':<10} {'Rule':<52} {'Total':>14}")
    print("-" * 134)

    for i, inv in enumerate(all_invoices, 1):
        filepath = os.path.join(OUTPUT_DIR, inv['filename'])
        sub, vat, total = create_invoice_pdf(inv, filepath)
        print(f"{i:<3} {inv['filename']:<50} {inv['label']:<10} "
              f"{inv['rule_note']:<52} {inv['currency']} {total:>10,.2f}")

    approved_count = sum(1 for inv in all_invoices if inv['label'] == 'APPROVED')
    rejected_count = sum(1 for inv in all_invoices if inv['label'] == 'REJECTED')
    refer_count    = sum(1 for inv in all_invoices if inv['label'] == 'REFER')

    print(f"\nDone! 20 invoices in: {OUTPUT_DIR}")
    print(f"  APPROVED : {approved_count}")
    print(f"  REJECTED : {rejected_count}")
    print(f"  REFER    : {refer_count}")
