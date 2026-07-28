"""
Generate 10 invoices per supplier (3 suppliers = 30 invoices total).
Each supplier: 6 Approved + 4 Refer.
Invoice amounts: 10,000 - 30,000 AED (before VAT).
Buyer: ENCORE CLACK (IBAN: AE350030012285049920002)

Supplier 1: Al Noor Building Materials Trading LLC - IBAN: AE350030012285049920002
Supplier 2: Gulf Star Construction Engineering LLC - IBAN: AE350030012285049920002
Supplier 3: Crescent Infrastructure FZE - IBAN: AE120350000006789012345

Invoice numbers: ANB-INV-2026-801..830
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

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "supplier-invoices")
os.makedirs(OUTPUT_DIR, exist_ok=True)

GREEN   = HexColor("#036836")
ORANGE  = HexColor("#E65100")
GRAY_BG = HexColor("#F5F5F5")

# Buyer (ENCORE CLACK)
BUYER       = "ENCORE CLACK"
BUYER_TRN   = "100234567890003"

# Suppliers
SUPPLIERS = [
    {
        "name": "Al Noor Building Materials Trading LLC",
        "trn": "300456789012345",
        "iban": "AE350030012285049920002",
        "swift": "BOMLAEAD",
        "prefix": "ANB",
        "folder": "supplier1_al_noor",
    },
    {
        "name": "Gulf Star Construction Engineering LLC",
        "trn": "300789123456789",
        "iban": "AE350030012285049920002",
        "swift": "BOMLAEAD",
        "prefix": "GSC",
        "folder": "supplier2_gulf_star",
    },
    {
        "name": "Crescent Infrastructure FZE",
        "trn": "300654321098765",
        "iban": "AE120350000006789012345",
        "swift": "MASHAEADXXX",
        "prefix": "CIF",
        "folder": "supplier3_crescent",
    },
]

# Invoice data per supplier
# 6 Approved (all rules pass) + 4 Refer (various refer rules)
INVOICES = {
    "supplier1_al_noor": [
        # 6 APPROVED
        {"num": "ANB-INV-2026-801", "date": "05 May 2026", "due": "03 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("Portland Cement OPC 50kg Bag", 200, 48.00), ("Sand Washed Fine per Tonne", 30, 185.00)]},
        {"num": "ANB-INV-2026-802", "date": "07 May 2026", "due": "05 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("Rebar 12mm Fe500 12m", 150, 72.00), ("Binding Wire 1.5mm 25kg Coil", 20, 125.00)]},
        {"num": "ANB-INV-2026-803", "date": "09 May 2026", "due": "07 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("Concrete Block 200mm Hollow", 500, 8.50), ("Mortar Mix 25kg Bag", 100, 28.00)]},
        {"num": "ANB-INV-2026-804", "date": "11 May 2026", "due": "09 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("Plywood 18mm Marine Grade 2440x1220", 60, 245.00), ("Timber 100x50mm 4m", 80, 85.00)]},
        {"num": "ANB-INV-2026-805", "date": "13 May 2026", "due": "11 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("Waterproofing Membrane 4mm 10m Roll", 40, 385.00), ("Primer Bitumen 20L", 30, 145.00)]},
        {"num": "ANB-INV-2026-806", "date": "15 May 2026", "due": "13 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("PVC Pipe 110mm 6m", 100, 65.00), ("Elbow 110mm 90deg", 80, 18.50), ("Tee Junction 110mm", 50, 28.00)]},
        # 4 REFER
        {"num": "ANB-INV-2026-807", "date": "15 Sep 2026", "due": "14 Dec 2026", "label": "REFER", "rule": "R5: Invoice date in the future",
         "items": [("Steel Plate 10mm 2400x1200mm", 15, 975.00), ("Cutting & Bending Charge", 15, 185.00)]},
        {"num": "ANB-INV-2026-808", "date": "18 May 2026", "due": "16 Aug 2026", "label": "REFER", "rule": "R8: Math mismatch - subtotal incorrect",
         "items": [("Aggregate 20mm per Tonne", 50, 95.00), ("Crusher Dust per Tonne", 30, 65.00)],
         "override_total": 22000.00},
        {"num": "ANB-INV-2026-809", "date": "20 May 2026", "due": "18 Aug 2026", "label": "REFER", "rule": "R9: Seller name mismatch",
         "seller_override": "Al Noor Trading LLC",
         "items": [("Scaffolding Coupler Box/50", 30, 485.00), ("Scaffolding Board 3.9m", 40, 85.00)]},
        {"num": "ANB-INV-2026-810", "date": "22 May 2026", "due": "20 Aug 2026", "label": "REFER", "rule": "R17: Round number total AED 20,000",
         "items": [("Bulk Materials Package", 1, 19047.62)],
         "override_subtotal": 19047.62, "override_vat": 952.38, "override_total": 20000.00},
    ],
    "supplier2_gulf_star": [
        # 6 APPROVED
        {"num": "GSC-INV-2026-811", "date": "04 May 2026", "due": "02 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("Electrical Conduit 25mm 3m", 300, 18.50), ("Junction Box 100x100mm", 150, 28.00), ("Cable Clip Box/100", 50, 12.00)]},
        {"num": "GSC-INV-2026-812", "date": "06 May 2026", "due": "04 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("LED Panel Light 60x60 40W", 80, 145.00), ("Emergency Light LED 3W", 40, 85.00)]},
        {"num": "GSC-INV-2026-813", "date": "08 May 2026", "due": "06 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("AC Split Unit 1.5 Ton Inverter", 5, 2850.00), ("Copper Pipe 1/4 inch 15m", 10, 185.00)]},
        {"num": "GSC-INV-2026-814", "date": "10 May 2026", "due": "08 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("Fire Extinguisher 6kg ABC", 30, 185.00), ("First Aid Kit Industrial", 15, 245.00), ("Safety Sign Set", 20, 48.00)]},
        {"num": "GSC-INV-2026-815", "date": "12 May 2026", "due": "10 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("Water Pump 2HP Submersible", 4, 3850.00), ("Check Valve 2 inch Brass", 8, 285.00)]},
        {"num": "GSC-INV-2026-816", "date": "14 May 2026", "due": "12 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("Cable 4C 6sqmm 100m", 15, 850.00), ("DB 8-Way SPN", 10, 485.00)]},
        # 4 REFER
        {"num": "GSC-INV-2026-817", "date": "20 Oct 2026", "due": "18 Jan 2027", "label": "REFER", "rule": "R5: Invoice date in the future",
         "items": [("VRF System 10HP Outdoor Unit", 1, 22500.00)]},
        {"num": "GSC-INV-2026-818", "date": "16 May 2026", "due": "14 Aug 2026", "label": "REFER", "rule": "R8: VAT calculated at 10%",
         "items": [("Transformer 100KVA Dry Type", 1, 18500.00)],
         "override_vat": 1850.00, "override_total": 20350.00},
        {"num": "GSC-INV-2026-819", "date": "18 May 2026", "due": "16 Aug 2026", "label": "REFER", "rule": "R14: Invalid TRN format",
         "seller_trn_override": "TRN-300-789-123",
         "items": [("Generator 50KVA Silent", 1, 28500.00)]},
        {"num": "GSC-INV-2026-820", "date": "20 May 2026", "due": "18 Aug 2026", "label": "REFER", "rule": "R10: Buyer name mismatch",
         "buyer_override": "ENCORE CLACK TRADING",
         "items": [("UPS 10KVA Online", 2, 12500.00)]},
    ],
    "supplier3_crescent": [
        # 6 APPROVED
        {"num": "CIF-INV-2026-821", "date": "03 May 2026", "due": "01 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("Excavator Bucket Teeth Set/5", 10, 1250.00), ("Hydraulic Hose 1/2 inch 3m", 20, 385.00)]},
        {"num": "CIF-INV-2026-822", "date": "05 May 2026", "due": "03 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("Concrete Vibrator 50mm Electric", 5, 2850.00), ("Extension Shaft 3m", 5, 485.00)]},
        {"num": "CIF-INV-2026-823", "date": "07 May 2026", "due": "05 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("Tower Crane Sling 5T 4m", 8, 1850.00), ("Shackle 5T Bow Type", 20, 185.00)]},
        {"num": "CIF-INV-2026-824", "date": "09 May 2026", "due": "07 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("Compactor Plate 90kg Diesel", 3, 4850.00), ("Tamper Rammer 75kg", 2, 3850.00)]},
        {"num": "CIF-INV-2026-825", "date": "11 May 2026", "due": "09 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("Dewatering Pump 4 inch Diesel", 2, 8500.00), ("Suction Hose 4 inch 6m", 4, 485.00)]},
        {"num": "CIF-INV-2026-826", "date": "13 May 2026", "due": "11 Aug 2026", "label": "APPROVED", "rule": "All rules pass",
         "items": [("Survey Total Station Hire/month", 2, 4850.00), ("Tripod Aluminium", 2, 1250.00)]},
        # 4 REFER
        {"num": "CIF-INV-2026-827", "date": "25 Nov 2026", "due": "23 Feb 2027", "label": "REFER", "rule": "R5: Invoice date in the future",
         "items": [("Mobile Crane 25T Hire/day", 5, 4500.00)]},
        {"num": "CIF-INV-2026-828", "date": "15 May 2026", "due": "13 Aug 2026", "label": "REFER", "rule": "R8: Subtotal + VAT != Total",
         "items": [("Boom Lift 60ft Hire/week", 2, 8500.00), ("Safety Harness Full Body", 10, 485.00)],
         "override_total": 28000.00},
        {"num": "CIF-INV-2026-829", "date": "17 May 2026", "due": "15 Aug 2026", "label": "REFER", "rule": "R15: TRN does not match system",
         "seller_trn_override": "300654321000000",
         "items": [("Forklift 3T Diesel Hire/month", 1, 12500.00), ("Pallet 1200x1000mm", 20, 185.00)]},
        {"num": "CIF-INV-2026-830", "date": "19 May 2026", "due": "17 Aug 2026", "label": "REFER", "rule": "R17: Round number total AED 25,000",
         "items": [("Heavy Equipment Package", 1, 23809.52)],
         "override_subtotal": 23809.52, "override_vat": 1190.48, "override_total": 25000.00},
    ],
}


def create_invoice_pdf(inv, supplier, output_path):
    color_map = {"APPROVED": GREEN, "REFER": ORANGE}
    label_color = color_map.get(inv["label"], GREEN)

    seller_name = inv.get("seller_override", supplier["name"])
    seller_trn = inv.get("seller_trn_override", supplier["trn"])
    buyer_name = inv.get("buyer_override", BUYER)

    doc = SimpleDocTemplate(output_path, pagesize=A4,
        topMargin=1.5*cm, bottomMargin=1.5*cm, leftMargin=1.5*cm, rightMargin=1.5*cm)
    styles = getSampleStyleSheet()
    ts = ParagraphStyle('ts', parent=styles['Normal'], fontSize=9, leading=12)
    tr = ParagraphStyle('tr', parent=styles['Normal'], fontSize=9, alignment=TA_RIGHT)
    elements = []

    # Status banner
    banner = Table([[Paragraph(
        f"<b>{inv['label']}</b> | {inv['rule']}",
        ParagraphStyle('b', parent=ts, fontSize=8, textColor=white)
    )]], colWidths=[18*cm])
    banner.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), label_color),
        ('TOPPADDING', (0,0), (-1,-1), 4), ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(banner)
    elements.append(Spacer(1, 4*mm))

    elements.append(Paragraph("<b>TAX INVOICE</b>",
        ParagraphStyle('ti', parent=styles['Heading1'], fontSize=22, textColor=GREEN)))
    elements.append(Spacer(1, 3*mm))

    header_data = [
        [Paragraph(f"<b>Invoice No:</b> {inv['num']}", ts),
         Paragraph(f"<b>From:</b> {seller_name}", ts)],
        [Paragraph(f"<b>Date:</b> {inv['date']}", ts),
         Paragraph(f"TRN: {seller_trn}", ts)],
        [Paragraph(f"<b>Due Date:</b> {inv['due']}", ts),
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
        f"<b>Bill To:</b> {buyer_name} | TRN: {BUYER_TRN}", ts))
    elements.append(Spacer(1, 4*mm))

    subtotal = inv.get("override_subtotal", sum(qty * rate for _, qty, rate in inv['items']))
    vat = inv.get("override_vat", round(subtotal * 0.05, 2))
    total = inv.get("override_total", round(subtotal + vat, 2))

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
    print("Generating 30 invoices (10 per supplier: 6 Approved + 4 Refer)...")
    print(f"Output: {OUTPUT_DIR}\n")

    for supplier in SUPPLIERS:
        folder_key = supplier["folder"]
        sub_dir = os.path.join(OUTPUT_DIR, folder_key)
        os.makedirs(sub_dir, exist_ok=True)

        print(f"\n{'='*60}")
        print(f"  {supplier['name']}")
        print(f"  IBAN: {supplier['iban']}")
        print(f"{'='*60}")
        print(f"  {'#':<3} {'Invoice':<20} {'Status':<10} {'Total':>12}")
        print(f"  {'-'*50}")

        for i, inv in enumerate(INVOICES[folder_key], 1):
            filename = f"{i:02d}_{inv['label']}_{inv['num']}.pdf"
            filepath = os.path.join(sub_dir, filename)
            total = create_invoice_pdf(inv, supplier, filepath)
            print(f"  {i:<3} {inv['num']:<20} {inv['label']:<10} AED {total:>10,.2f}")

    print(f"\n\nDone! 30 invoices generated in: {OUTPUT_DIR}")
