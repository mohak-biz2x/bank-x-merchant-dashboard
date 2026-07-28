"""
Generate 30 invoices (v2): 15 Approved, 10 Refer, 5 Rejected.
Uses NEW invoice numbers ANB-INV-2026-501..530 (unused).
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

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mixed-30-invoices-v2")
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

# ===================== 15 APPROVED INVOICES =====================
approved = [
    {
        "filename": "01_APPROVED_timber_joinery.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-501", "date": "02 May 2026", "due_date": "31 Jul 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Hardwood Timber 100x50mm 4m length", 300, 185.00),
            ("MDF Board 18mm 2440x1220mm", 200, 125.00),
            ("Plywood Marine Grade 18mm 2440x1220", 150, 245.00),
        ], "currency": "AED",
    },
    {
        "filename": "02_APPROVED_facade_cladding.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-502", "date": "04 May 2026", "due_date": "02 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Fibre Cement Board 8mm 1200x2400mm", 500, 185.00),
            ("GRC Panel 25mm Custom per sqm", 200, 850.00),
            ("Facade Fixing Bracket Stainless", 1000, 28.50),
            ("Thermal Break Strip 30mm x 5m", 300, 65.00),
        ], "currency": "AED",
    },
    {
        "filename": "03_APPROVED_elevator_materials.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-503", "date": "06 May 2026", "due_date": "04 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Elevator Guide Rail T89 per metre", 200, 485.00),
            ("Counterweight Frame Steel 1500kg", 4, 22500.00),
            ("Elevator Cable 8mm 6x19 per metre", 500, 85.00),
        ], "currency": "AED",
    },
    {
        "filename": "04_APPROVED_kitchen_equipment.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-504", "date": "08 May 2026", "due_date": "06 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Commercial Oven Double Deck Electric", 5, 18500.00),
            ("Stainless Work Table 1800x700mm", 12, 2850.00),
            ("Under-Counter Fridge 140L", 8, 4200.00),
            ("Exhaust Hood Stainless 2400mm", 4, 8500.00),
        ], "currency": "AED",
    },
    {
        "filename": "05_APPROVED_gym_flooring.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-505", "date": "10 May 2026", "due_date": "08 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Rubber Gym Flooring Tile 1x1m 20mm", 600, 185.00),
            ("Sports Court Vinyl Flooring per sqm", 300, 245.00),
            ("Artificial Turf 40mm Pile per sqm", 200, 185.00),
            ("Shock Pad Underlay 15mm per sqm", 400, 65.00),
        ], "currency": "AED",
    },
    {
        "filename": "06_APPROVED_electrical_panels.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-506", "date": "12 May 2026", "due_date": "10 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Main Distribution Board 400A TPN", 10, 28500.00),
            ("Sub Distribution Board 200A TPN", 20, 12500.00),
            ("MCB 32A 2-Pole", 200, 125.00),
            ("RCCB 63A 30mA 4-Pole", 100, 385.00),
        ], "currency": "AED",
    },
    {
        "filename": "07_APPROVED_swimming_pool.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-507", "date": "14 May 2026", "due_date": "12 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Pool Mosaic Tile 25x25mm sqm", 400, 285.00),
            ("Pool Filter Sand Media 25kg Bag", 200, 85.00),
            ("Pool Pump 1.5 HP", 6, 4850.00),
            ("LED Pool Light 18W Colour Change", 20, 1250.00),
        ], "currency": "AED",
    },
    {
        "filename": "08_APPROVED_cctv_security.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-508", "date": "16 May 2026", "due_date": "14 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("IP Camera 4MP Dome PoE", 80, 850.00),
            ("NVR 32-Channel 4K", 5, 12500.00),
            ("Cat6A Cable UTP 305m Box", 20, 485.00),
            ("PoE Switch 24-Port Managed", 8, 3850.00),
        ], "currency": "AED",
    },
    {
        "filename": "09_APPROVED_paint_finishes.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-509", "date": "18 May 2026", "due_date": "16 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Exterior Weatherproof Paint 20L", 300, 245.00),
            ("Interior Emulsion Premium 20L", 400, 185.00),
            ("Primer Sealer Universal 5L", 200, 95.00),
            ("Sandpaper Assorted Pack/25", 150, 48.00),
        ], "currency": "AED",
    },
    {
        "filename": "10_APPROVED_scaffolding.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-510", "date": "20 May 2026", "due_date": "18 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Scaffolding Standard 48.3mm 3m", 500, 185.00),
            ("Scaffolding Ledger 48.3mm 2.4m", 400, 145.00),
            ("Scaffolding Board 3.9m Timber", 300, 85.00),
            ("Scaffolding Coupler Right-Angle Box/50", 100, 650.00),
        ], "currency": "AED",
    },
    {
        "filename": "11_APPROVED_stone_flooring.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-511", "date": "22 May 2026", "due_date": "20 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Porcelain Tile 600x600mm Polished sqm", 1000, 185.00),
            ("Granite Tile 600x600mm 20mm sqm", 500, 485.00),
            ("Tile Adhesive Flexible 25kg", 400, 68.00),
            ("Tile Grout Unsanded 5kg", 300, 42.00),
        ], "currency": "AED",
    },
    {
        "filename": "12_APPROVED_data_cabling.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-512", "date": "24 May 2026", "due_date": "22 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Cat6A Patch Panel 24-Port", 30, 850.00),
            ("Fibre Optic Cable 6-Core OM4 per metre", 1000, 28.50),
            ("Fibre Optic LC/LC Duplex Patch 3m", 200, 125.00),
            ("Server Rack 42U 800x1000mm", 5, 8500.00),
        ], "currency": "AED",
    },
    {
        "filename": "13_APPROVED_sanitary_ware.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-513", "date": "26 May 2026", "due_date": "24 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Wall-Hung WC Pan with Cistern", 50, 1850.00),
            ("Basin Semi-Recessed 600x430mm", 50, 1250.00),
            ("Shower Enclosure Frameless 900x900", 20, 4850.00),
            ("Bath Mixer Tap Chrome Deck-Mount", 50, 850.00),
        ], "currency": "AED",
    },
    {
        "filename": "14_APPROVED_generator_equipment.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-514", "date": "28 May 2026", "due_date": "26 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Diesel Generator 200 kVA Soundproof", 3, 85000.00),
            ("ATS Panel 400A Automatic Transfer", 3, 18500.00),
            ("Fuel Storage Tank 2000L Bunded", 3, 22500.00),
        ], "currency": "AED",
    },
    {
        "filename": "15_APPROVED_landscaping_irrigation.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-515", "date": "30 May 2026", "due_date": "28 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Hunter Pro-C Irrigation Controller 12-Zone", 10, 2850.00),
            ("Pop-Up Sprinkler Head Rotary", 500, 48.00),
            ("HDPE Irrigation Pipe 25mm 100m", 60, 385.00),
            ("Fertiliser Slow-Release 25kg Bag", 100, 125.00),
        ], "currency": "AED",
    },
]

# ===================== 5 REJECTED INVOICES =====================
rejected = [
    {
        "filename": "16_REJECTED_R2_past_due_date.pdf",
        "label": "REJECTED", "rule_note": "R2: Due date in the past (Dec 2024)",
        "number": "ANB-INV-2026-516", "date": "10 Aug 2024", "due_date": "10 Dec 2024",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Structural Hollow Section 100x100x5mm 6m", 40, 2850.00),
            ("Angle Bar 75x75x6mm 6m length", 60, 485.00),
        ], "currency": "AED",
    },
    {
        "filename": "17_REJECTED_R3_due_before_invoice.pdf",
        "label": "REJECTED", "rule_note": "R3: Due date (Mar 2026) before invoice date (Jul 2026)",
        "number": "ANB-INV-2026-517", "date": "05 Jul 2026", "due_date": "20 Mar 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Aluminium Louvre Blade 150mm per metre", 200, 185.00),
            ("Aluminium Frame Section 3m", 150, 125.00),
        ], "currency": "AED",
    },
    {
        "filename": "18_REJECTED_R7_wrong_currency_SAR.pdf",
        "label": "REJECTED", "rule_note": "R7: Currency is SAR (must be AED)",
        "number": "ANB-INV-2026-518", "date": "10 Mar 2026", "due_date": "08 Sep 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Polished Brass Fittings Box/20", 100, 285.00),
            ("Decorative Brass Grille 600x600mm", 50, 650.00),
        ], "currency": "SAR",
    },
    {
        "filename": "19_REJECTED_R16_alcohol_products.pdf",
        "label": "REJECTED", "rule_note": "R16: Shariah restricted - Alcohol products",
        "number": "ANB-INV-2026-519", "date": "14 Mar 2026", "due_date": "12 Sep 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Whisky Premium Imported Case/12x750ml", 500, 850.00),
            ("Wine Red Bordeaux Case/6x750ml", 800, 485.00),
            ("Beer Premium Lager Case/24x330ml", 1200, 185.00),
        ], "currency": "AED",
    },
    {
        "filename": "20_REJECTED_R16_gambling_equipment.pdf",
        "label": "REJECTED", "rule_note": "R16: Shariah restricted - Gambling equipment",
        "number": "ANB-INV-2026-520", "date": "20 Mar 2026", "due_date": "18 Sep 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Casino Roulette Table Professional", 10, 28500.00),
            ("Poker Table Oval Felt Top", 20, 8500.00),
            ("Slot Machine Electronic Gaming", 15, 45000.00),
        ], "currency": "AED",
    },
]

# ===================== 10 REFER INVOICES =====================
refer = [
    {
        "filename": "21_REFER_R5_future_dated_oct.pdf",
        "label": "REFER", "rule_note": "R5: Invoice date (Oct 2026) is in the future",
        "number": "ANB-INV-2026-521", "date": "12 Oct 2026", "due_date": "10 Jan 2027",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Smart Building Automation Controller", 5, 38500.00),
            ("BMS Sensor Kit 16-point", 20, 8500.00),
        ], "currency": "AED",
    },
    {
        "filename": "22_REFER_R8_math_mismatch.pdf",
        "label": "REFER", "rule_note": "R8: Subtotal + VAT != Total (math mismatch)",
        "number": "ANB-INV-2026-522", "date": "24 Mar 2026", "due_date": "22 Sep 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Decorative Gypsum Cornice 3m length", 500, 48.00),
            ("Gypsum Board 12.5mm 2400x1200mm", 1000, 68.00),
            ("Plaster of Paris 25kg Bag", 200, 45.00),
        ], "currency": "AED",
        "override_total": 120000.00,  # Wrong! Correct ~81,690.00
    },
    {
        "filename": "23_REFER_R9_seller_name_mismatch.pdf",
        "label": "REFER", "rule_note": "R9: Seller name differs from system (Al Noor Building Matl.)",
        "number": "ANB-INV-2026-523", "date": "26 Mar 2026", "due_date": "24 Sep 2026",
        "seller": "Al Noor Building Matl. LLC",  # Abbreviated - mismatch
        "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Steel Rebar 12mm Fe500 12m", 400, 72.00),
            ("Binding Wire 25kg Coil", 80, 125.00),
            ("Concrete Spacer Block 25mm Box/100", 200, 85.00),
        ], "currency": "AED",
    },
    {
        "filename": "24_REFER_R10_buyer_name_mismatch.pdf",
        "label": "REFER", "rule_note": "R10: Buyer name differs from system (Al Masraf Industries)",
        "number": "ANB-INV-2026-524", "date": "29 Mar 2026", "due_date": "27 Sep 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN,
        "buyer": "Al Masraf Industries",  # Missing 'LLC' - mismatch
        "buyer_trn": BUYER_TRN,
        "items": [
            ("PVC Conduit 25mm 3m length", 600, 18.50),
            ("Cable Tray Perforated 100x50mm 3m", 300, 95.00),
            ("Junction Box 100x100x50mm", 400, 28.00),
        ], "currency": "AED",
    },
    {
        "filename": "25_REFER_R14_invalid_trn_format.pdf",
        "label": "REFER", "rule_note": "R14: Invalid TRN format (too short, alphanumeric)",
        "number": "ANB-INV-2026-525", "date": "02 Apr 2026", "due_date": "01 Oct 2026",
        "seller": SELLER, "seller_trn": "TRN-300456789",  # Invalid - too short
        "buyer": BUYER, "buyer_trn": "INV100234567",      # Invalid format
        "items": [
            ("Waterproof LED Strip 5050 5m", 300, 185.00),
            ("LED Driver 60W Constant Voltage", 150, 245.00),
            ("Aluminium LED Profile 2m", 500, 68.00),
        ], "currency": "AED",
    },
    {
        "filename": "26_REFER_R15_trn_system_mismatch.pdf",
        "label": "REFER", "rule_note": "R15: TRN format valid but does not match system records",
        "number": "ANB-INV-2026-526", "date": "06 Apr 2026", "due_date": "05 Jul 2026",
        "seller": SELLER, "seller_trn": "300456789011111",  # Valid format, wrong number
        "buyer": BUYER, "buyer_trn": "100234567800002",     # Valid format, wrong number
        "items": [
            ("Aluminium Composite Panel 4mm sqm", 500, 285.00),
            ("Z-Clip Fixing System per sqm", 500, 95.00),
        ], "currency": "AED",
    },
    {
        "filename": "27_REFER_R17_round_number_250k.pdf",
        "label": "REFER", "rule_note": "R17: Total is exact round number AED 250,000",
        "number": "ANB-INV-2026-527", "date": "09 Apr 2026", "due_date": "08 Jul 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Construction Works Package - Block B", 1, 238095.24),
        ], "currency": "AED",
        "override_subtotal": 238095.24,
        "override_vat": 11904.76,
        "override_total": 250000.00,
    },
    {
        "filename": "28_REFER_R8_vat_calculation_error.pdf",
        "label": "REFER", "rule_note": "R8: VAT calculated at 10% instead of 5% (math mismatch)",
        "number": "ANB-INV-2026-528", "date": "13 Apr 2026", "due_date": "12 Jul 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Glass Balustrade Tempered 12mm sqm", 200, 850.00),
            ("Stainless Handrail 50mm dia 3m", 100, 685.00),
            ("Post Base Plate Stainless 100x100mm", 80, 285.00),
        ], "currency": "AED",
        # Subtotal = 200*850 + 100*685 + 80*285 = 170000+68500+22800 = 261300
        # Correct VAT (5%) = 13065.00, Total = 274365.00
        # Override: VAT at 10% = 26130.00, Total = 287430.00 (mismatch)
        "override_vat": 26130.00,
        "override_total": 287430.00,
    },
    {
        "filename": "29_REFER_R5_future_dated_aug.pdf",
        "label": "REFER", "rule_note": "R5: Invoice date (Aug 2026) is in the future",
        "number": "ANB-INV-2026-529", "date": "18 Aug 2026", "due_date": "16 Nov 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Raised Floor Pedestal Adjustable 250-350mm", 800, 285.00),
            ("Anti-Static HPL Panel 600x600mm", 800, 185.00),
            ("Floor Levelling Tool Set", 10, 1250.00),
        ], "currency": "AED",
    },
    {
        "filename": "30_REFER_R17_round_number_75k.pdf",
        "label": "REFER", "rule_note": "R17: Total is exact round number AED 75,000",
        "number": "ANB-INV-2026-530", "date": "19 Apr 2026", "due_date": "18 Jul 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("MEP Works Package - Level 3", 1, 71428.57),
        ], "currency": "AED",
        "override_subtotal": 71428.57,
        "override_vat": 3571.43,
        "override_total": 75000.00,
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
    print("Generating 30 invoices v2 (15 Approved, 5 Rejected, 10 Refer)...")
    print(f"Invoice numbers: ANB-INV-2026-501 to ANB-INV-2026-530")
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

    print(f"\nDone! 30 invoices in: {OUTPUT_DIR}")
    print(f"  APPROVED : {approved_count}")
    print(f"  REJECTED : {rejected_count}")
    print(f"  REFER    : {refer_count}")
