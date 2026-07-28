"""
Generate 30 demo invoices (5 APPROVED + 5 REFER per supplier) for 3 UAE suppliers.
Amounts range: AED 10,000 - 30,000.
Demo date: 18 Jun 2026. Future-dated = after 18 Jun 2026.

Refer rules used (from MB-44 Rule Engine):
  R5  - Invoice Date > Submission Date (future-dated invoice)
  R9  - Seller name mismatch (parsed vs system)
  R10 - Buyer name mismatch (parsed vs entered)
  R12 - Duplicate invoice detection (cross-request)
  R14 - Invalid TRN format
  R15 - TRN mismatch with system (valid format, wrong number)
  R17 - Round-number bias (exact round figures)
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

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "supplier-demo-invoices-v2")
os.makedirs(OUTPUT_DIR, exist_ok=True)

GREEN   = HexColor("#036836")
AMBER   = HexColor("#D97706")
GRAY_BG = HexColor("#F5F5F5")

# Buyer (Merchant)
BUYER       = "Al Masaraf Industries"
BUYER_TRN   = "100567890123456"

# Supplier details
SUPPLIERS = {
    "ESI": {
        "name": "Emirates Steel Industries LLC",
        "trn": "100234567890003",
        "iban": "AE070331234567890123456",
        "swift": "ABORAEADXXX",
        "prefix": "ESI-INV-2026",
    },
    "DES": {
        "name": "Dubai Electrical Solutions Co.",
        "trn": "100987654320008",
        "iban": "AE350030012285049920002",
        "swift": "ABORAEADXXX",
        "prefix": "DES-INV-2026",
    },
    "ANB": {
        "name": "Al Noor Building Materials Trading Est.",
        "trn": "100567891230005",
        "iban": "AE350030012285049920002",
        "swift": "ADABORAEADXXX",
        "prefix": "ANB-INV-2026",
    },
}

# ============================================================
# INVOICE DATA
# ============================================================
# Fresh invoice numbers: ESI-INV-2026-501..510, DES-INV-2026-601..610, ANB-INV-2026-701..710
#
# Refer rules applied:
#   Each supplier gets 5 different refer rules to show variety.
#   Rules that are visually verifiable on the PDF:
#     R5  - future date (invoice date > 18 Jun 2026)
#     R9  - seller name on PDF differs from system name (override_seller)
#     R10 - buyer name on PDF differs from entered name (override_buyer)
#     R14 - invalid TRN printed on PDF (override_trn)
#     R15 - valid TRN format but wrong number vs system (override_trn)
#     R17 - round number total (items designed to sum to round figure)
#     R12 - duplicate invoice number (same number as another invoice)

INVOICES = {
    "ESI": {
        "approved": [
            {
                "num": "501", "date": "02 Jun 2026", "due": "31 Aug 2026",
                "items": [
                    ("Structural Steel Beam IPE 300 6m", 8, 1850.00),
                    ("Anchor Bolt Set M20x600mm", 50, 95.00),
                ],
            },
            {
                "num": "502", "date": "04 Jun 2026", "due": "02 Sep 2026",
                "items": [
                    ("Reinforcement Bar 16mm T-12m", 120, 125.00),
                    ("Wire Mesh 6mm 2.4x6m Sheet", 40, 185.00),
                ],
            },
            {
                "num": "503", "date": "08 Jun 2026", "due": "06 Sep 2026",
                "items": [
                    ("Steel Column UC 203x203 4m", 6, 3250.00),
                    ("Base Plate 400x400x20mm", 6, 485.00),
                ],
            },
            {
                "num": "504", "date": "10 Jun 2026", "due": "08 Sep 2026",
                "items": [
                    ("Metal Deck Sheet 0.9mm 6m", 60, 285.00),
                    ("Self-Drilling Screw Box/500", 20, 145.00),
                ],
            },
            {
                "num": "505", "date": "14 Jun 2026", "due": "12 Sep 2026",
                "items": [
                    ("Welding Rod E7018 3.2mm 20kg", 30, 385.00),
                    ("Grinding Disc 230mm Box/25", 40, 125.00),
                    ("Safety Harness Full Body", 15, 285.00),
                ],
            },
        ],
        "refer": [
            {
                # R5: Invoice date is 25 Jun (after demo date 18 Jun)
                "num": "506", "date": "25 Jun 2026", "due": "23 Sep 2026",
                "reason": "R5: Invoice Date is after Submission Date (future-dated)",
                "items": [
                    ("Pre-fabricated Steel Frame Set", 4, 3850.00),
                    ("Transport & Crane Hire (half-day)", 2, 2850.00),
                ],
            },
            {
                # R9: Seller name abbreviated vs system record
                "num": "507", "date": "12 Jun 2026", "due": "10 Sep 2026",
                "reason": "R9: Seller name mismatch (parsed vs system record)",
                "override_seller": "Emirates Steel Ind. LLC",
                "items": [
                    ("Stainless Steel Railing Post", 30, 485.00),
                    ("Handrail Tube 50mm 6m", 20, 285.00),
                ],
            },
            {
                # R14: TRN has invalid format (too short)
                "num": "508", "date": "13 Jun 2026", "due": "11 Sep 2026",
                "reason": "R14: Invalid TRN format on invoice",
                "override_trn": "10023456789",
                "items": [
                    ("Fire-Rated Steel Door 900x2100", 8, 2450.00),
                    ("Door Frame Hot-Rolled 1.6mm", 8, 485.00),
                ],
            },
            {
                # R17: Round number total (items sum to exactly AED 20,000 before VAT)
                "num": "509", "date": "15 Jun 2026", "due": "13 Sep 2026",
                "reason": "R17: Round-number bias detected",
                "items": [
                    ("Steel Purlin Z200 7.5m", 40, 350.00),
                    ("Connection Bracket Set", 100, 60.00),
                ],
            },
            {
                # R10: Buyer name on PDF differs from what merchant entered
                "num": "510", "date": "16 Jun 2026", "due": "14 Sep 2026",
                "reason": "R10: Buyer name mismatch (parsed vs entered)",
                "override_buyer": "Al Masaraf Industries LLC",
                "items": [
                    ("Sag Rod 12mm 3m", 120, 48.00),
                    ("Purlin Z150 6m", 50, 245.00),
                ],
            },
        ],
    },
    "DES": {
        "approved": [
            {
                "num": "601", "date": "03 Jun 2026", "due": "01 Sep 2026",
                "items": [
                    ("LV Distribution Panel 12-Way", 4, 3850.00),
                    ("MCB 32A Type C Box/6", 20, 285.00),
                ],
            },
            {
                "num": "602", "date": "05 Jun 2026", "due": "03 Sep 2026",
                "items": [
                    ("Cable Tray HDG 300x50mm 3m", 40, 285.00),
                    ("Flexible Conduit 25mm 50m Roll", 30, 185.00),
                ],
            },
            {
                "num": "603", "date": "09 Jun 2026", "due": "07 Sep 2026",
                "items": [
                    ("LED Panel Light 60x60 40W", 80, 145.00),
                    ("Emergency Exit Light LED", 30, 185.00),
                ],
            },
            {
                "num": "604", "date": "11 Jun 2026", "due": "09 Sep 2026",
                "items": [
                    ("Switchgear Panel 800A 4-Comp", 1, 18500.00),
                    ("CT Metering Set 400/5A", 3, 1250.00),
                ],
            },
            {
                "num": "605", "date": "15 Jun 2026", "due": "13 Sep 2026",
                "items": [
                    ("Fire Alarm Cable 1.5mm 2C 100m", 20, 485.00),
                    ("Smoke Detector Addressable", 40, 185.00),
                    ("Manual Call Point", 20, 125.00),
                ],
            },
        ],
        "refer": [
            {
                # R15: Valid TRN format but wrong number vs system
                "num": "606", "date": "10 Jun 2026", "due": "08 Sep 2026",
                "reason": "R15: TRN on invoice does not match system records",
                "override_trn": "100987654320099",
                "items": [
                    ("MV Cable Termination Kit 33kV", 6, 3850.00),
                    ("Cable Joint Kit 11kV", 10, 485.00),
                ],
            },
            {
                # R10: Buyer name mismatch
                "num": "607", "date": "12 Jun 2026", "due": "10 Sep 2026",
                "reason": "R10: Buyer name mismatch (parsed vs entered)",
                "override_buyer": "Al-Masaraf Ind. LLC",
                "items": [
                    ("Generator Cable 70sqmm 50m", 4, 2850.00),
                    ("Changeover Switch 400A", 2, 3450.00),
                ],
            },
            {
                # R5: Future-dated (22 Jun > 18 Jun demo date)
                "num": "608", "date": "22 Jun 2026", "due": "20 Sep 2026",
                "reason": "R5: Invoice Date is after Submission Date (future-dated)",
                "items": [
                    ("Solar Panel Inverter 10kW", 3, 4850.00),
                    ("DC Cable 6sqmm 100m", 10, 485.00),
                ],
            },
            {
                # R12: Duplicate invoice — same number as 601
                "num": "601", "date": "14 Jun 2026", "due": "12 Sep 2026",
                "reason": "R12: Duplicate invoice number detected (cross-request)",
                "items": [
                    ("BMS Controller DDC 32-Point", 4, 4850.00),
                    ("Temperature Sensor Duct Type", 20, 285.00),
                ],
            },
            {
                # R9: Seller name abbreviated
                "num": "609", "date": "16 Jun 2026", "due": "14 Sep 2026",
                "reason": "R9: Seller name mismatch (parsed vs system record)",
                "override_seller": "Dubai Elec. Solutions",
                "items": [
                    ("UPS System 10kVA Online", 1, 18500.00),
                    ("Battery Bank 12V 100Ah", 8, 485.00),
                ],
            },
        ],
    },
    "ANB": {
        "approved": [
            {
                "num": "701", "date": "01 Jun 2026", "due": "30 Aug 2026",
                "items": [
                    ("Porcelain Floor Tile 60x60 Box/4sqm", 50, 285.00),
                    ("Tile Adhesive 25kg Bag", 80, 48.00),
                ],
            },
            {
                "num": "702", "date": "06 Jun 2026", "due": "04 Sep 2026",
                "items": [
                    ("Gypsum Board 12.5mm 2.4x1.2m", 200, 48.00),
                    ("Metal Stud 92mm 3m", 150, 28.00),
                    ("Joint Compound 25kg", 60, 65.00),
                ],
            },
            {
                "num": "703", "date": "09 Jun 2026", "due": "07 Sep 2026",
                "items": [
                    ("Interior Emulsion Paint 20L", 40, 285.00),
                    ("Primer Coat 20L", 20, 185.00),
                    ("Masking Tape 48mm Roll/36", 15, 125.00),
                ],
            },
            {
                "num": "704", "date": "12 Jun 2026", "due": "10 Sep 2026",
                "items": [
                    ("Aluminium Window Frame 1.2x1.5m", 10, 1850.00),
                    ("Double Glazed Unit 6-12-6mm", 10, 485.00),
                ],
            },
            {
                "num": "705", "date": "16 Jun 2026", "due": "14 Sep 2026",
                "items": [
                    ("WC Suite Close Coupled", 10, 1250.00),
                    ("Basin Pedestal Type", 10, 485.00),
                    ("CP Mixer Tap Basin", 10, 385.00),
                ],
            },
        ],
        "refer": [
            {
                # R17: Round-number bias (items sum to exactly 25,000 before VAT)
                "num": "706", "date": "11 Jun 2026", "due": "09 Sep 2026",
                "reason": "R17: Round-number bias detected",
                "items": [
                    ("Italian Marble Slab 300x120cm", 5, 4000.00),
                    ("Marble Installation Labour", 50, 100.00),
                ],
            },
            {
                # R9: Seller name abbreviated
                "num": "707", "date": "13 Jun 2026", "due": "11 Sep 2026",
                "reason": "R9: Seller name mismatch (parsed vs system record)",
                "override_seller": "Al Noor Bldg Materials Trading",
                "items": [
                    ("Waterproofing Membrane 1.5mm Roll", 15, 950.00),
                    ("Primer Bituminous 20L", 10, 285.00),
                ],
            },
            {
                # R15: Valid TRN format but wrong number
                "num": "708", "date": "14 Jun 2026", "due": "12 Sep 2026",
                "reason": "R15: TRN on invoice does not match system records",
                "override_trn": "100567891230099",
                "items": [
                    ("Exterior Cladding Panel ACP 4mm", 30, 485.00),
                    ("Aluminium Sub-frame 3m Length", 40, 285.00),
                ],
            },
            {
                # R12: Duplicate invoice — same number as 701
                "num": "701", "date": "15 Jun 2026", "due": "13 Sep 2026",
                "reason": "R12: Duplicate invoice number detected (cross-request)",
                "items": [
                    ("Kitchen Cabinet Base Unit 600mm", 12, 1250.00),
                    ("Countertop Quartz 3m Slab", 4, 2850.00),
                ],
            },
            {
                # R5: Future-dated (24 Jun > 18 Jun demo date)
                "num": "709", "date": "24 Jun 2026", "due": "22 Sep 2026",
                "reason": "R5: Invoice Date is after Submission Date (future-dated)",
                "items": [
                    ("Acoustic Mineral Wool 50mm Pack", 60, 185.00),
                    ("Resilient Channel 3m", 80, 48.00),
                ],
            },
        ],
    },
}


# ============================================================
# PDF GENERATION
# ============================================================

def create_invoice_pdf(supplier_key, inv_data, status, output_path):
    supplier = SUPPLIERS[supplier_key]
    is_approved = status == "approved"
    color = GREEN if is_approved else AMBER
    label = "APPROVED" if is_approved else "REFER"
    rule_note = "All rules pass" if is_approved else inv_data.get("reason", "Manual review required")

    # Support overrides for refer scenarios
    display_seller = inv_data.get("override_seller", supplier['name'])
    display_buyer = inv_data.get("override_buyer", BUYER)
    display_trn = inv_data.get("override_trn", supplier['trn'])

    doc = SimpleDocTemplate(output_path, pagesize=A4,
        topMargin=1.5*cm, bottomMargin=1.5*cm, leftMargin=1.5*cm, rightMargin=1.5*cm)
    styles = getSampleStyleSheet()
    ts = ParagraphStyle('ts', parent=styles['Normal'], fontSize=9, leading=12)
    tr = ParagraphStyle('tr', parent=styles['Normal'], fontSize=9, alignment=TA_RIGHT)
    elements = []

    # Status banner
    banner = Table([[Paragraph(
        f"<b>{label}</b> | {rule_note}",
        ParagraphStyle('b', parent=ts, fontSize=8, textColor=white)
    )]], colWidths=[18*cm])
    banner.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), color),
        ('TOPPADDING', (0,0), (-1,-1), 4), ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(banner)
    elements.append(Spacer(1, 4*mm))

    elements.append(Paragraph("<b>TAX INVOICE</b>",
        ParagraphStyle('ti', parent=styles['Heading1'], fontSize=22, textColor=color)))
    elements.append(Spacer(1, 3*mm))

    inv_number = f"{supplier['prefix']}-{inv_data['num']}"
    header_data = [
        [Paragraph(f"<b>Invoice No:</b> {inv_number}", ts),
         Paragraph(f"<b>From:</b> {display_seller}", ts)],
        [Paragraph(f"<b>Date:</b> {inv_data['date']}", ts),
         Paragraph(f"TRN: {display_trn}", ts)],
        [Paragraph(f"<b>Due Date:</b> {inv_data['due']}", ts),
         Paragraph(f"IBAN: {supplier['iban']}", ts)],
        [Paragraph(f"<b>Currency:</b> AED", ts),
         Paragraph(f"SWIFT: {supplier['swift']}", ts)],
    ]
    ht = Table(header_data, colWidths=[9*cm, 9*cm])
    ht.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 1), ('BOTTOMPADDING', (0,0), (-1,-1), 1)]))
    elements.append(ht)
    elements.append(Spacer(1, 4*mm))

    elements.append(Paragraph(
        f"<b>Bill To:</b> {display_buyer} | TRN: {BUYER_TRN}", ts))
    elements.append(Spacer(1, 4*mm))

    subtotal = sum(qty * rate for _, qty, rate in inv_data['items'])
    vat = round(subtotal * 0.05, 2)
    total = round(subtotal + vat, 2)

    data = [["#", "Description", "Qty", "Rate (AED)", "Amount (AED)"]]
    for i, (desc, qty, rate) in enumerate(inv_data['items'], 1):
        amt = qty * rate
        data.append([str(i), desc, str(qty), f"{rate:,.2f}", f"{amt:,.2f}"])

    data.append(["", "", "", Paragraph("<b>Subtotal</b>", tr), f"{subtotal:,.2f}"])
    data.append(["", "", "", Paragraph("<b>VAT (5%)</b>", tr), f"{vat:,.2f}"])
    data.append(["", "", "", Paragraph("<b>TOTAL (AED)</b>", tr), f"{total:,.2f}"])

    num_items = len(inv_data['items'])
    t = Table(data, colWidths=[1*cm, 8.5*cm, 2*cm, 3*cm, 3.5*cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), color),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('ALIGN', (2,1), (2,-1), 'CENTER'),
        ('ALIGN', (3,1), (-1,-1), 'RIGHT'),
        ('ROWBACKGROUNDS', (0,1), (-1,num_items), [white, GRAY_BG]),
        ('GRID', (0,0), (-1,num_items), 0.5, HexColor("#DDDDDD")),
        ('LINEBELOW', (0,0), (-1,0), 1, color),
        ('LINEABOVE', (3,-1), (-1,-1), 1.5, color),
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
    print("Generating 30 demo invoices (5 Approved + 5 Refer per supplier)...")
    print(f"Output: {OUTPUT_DIR}\n")
    print(f"{'#':<3} {'File':<55} {'Status':<10} {'Total':>14}")
    print("-" * 85)

    count = 0
    for supplier_key in ["ESI", "DES", "ANB"]:
        supplier = SUPPLIERS[supplier_key]
        supplier_dir = os.path.join(OUTPUT_DIR, supplier_key.lower())
        os.makedirs(supplier_dir, exist_ok=True)

        # Approved invoices
        for inv in INVOICES[supplier_key]["approved"]:
            count += 1
            filename = f"{inv['num']}_APPROVED_{supplier_key}.pdf"
            filepath = os.path.join(supplier_dir, filename)
            total = create_invoice_pdf(supplier_key, inv, "approved", filepath)
            print(f"{count:<3} {supplier_key}/{filename:<51} {'APPROVED':<10} AED {total:>10,.2f}")

        # Refer invoices
        for inv in INVOICES[supplier_key]["refer"]:
            count += 1
            filename = f"{inv['num']}_REFER_{supplier_key}.pdf"
            filepath = os.path.join(supplier_dir, filename)
            total = create_invoice_pdf(supplier_key, inv, "refer", filepath)
            print(f"{count:<3} {supplier_key}/{filename:<51} {'REFER':<10} AED {total:>10,.2f}")

    print(f"\nDone! {count} invoices generated in: {OUTPUT_DIR}")
