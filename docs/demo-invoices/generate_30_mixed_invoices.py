"""
Generate 30 invoices: 15 Approved, 10 Refer, 5 Rejected.
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

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mixed-30-invoices")
os.makedirs(OUTPUT_DIR, exist_ok=True)

GREEN  = HexColor("#036836")
RED    = HexColor("#B71C1C")
ORANGE = HexColor("#E65100")
GRAY_BG = HexColor("#F5F5F5")

SELLER      = "Al Noor Building Materials Trading LLC"
SELLER_TRN  = "300456789012345"
BUYER       = "Al Masraf Industries LLC"
BUYER_TRN   = "100234567890003"
IBAN        = "AE290260001015432187690"
SWIFT       = "ADCBAEAAXXX"

# ===================== 15 APPROVED INVOICES =====================
# Invoice dates: late May 2026 (recent, not future-dated)
# Due dates: 90 days later = Aug–Sep 2026 (all in the future from 01 Jun 2026)
approved = [
    {
        "filename": "01_APPROVED_structural_steel.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-401", "date": "01 May 2026", "due_date": "30 Jul 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Structural Steel H-Beam 200x200mm 6m", 120, 1850.00),
            ("Steel Plate 10mm 2400x1200mm", 80, 975.00),
            ("Anchor Bolts M24 Grade 8.8 Box/50", 60, 285.00),
        ], "currency": "AED",
    },
    {
        "filename": "02_APPROVED_insulation_materials.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-402", "date": "03 May 2026", "due_date": "01 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Rockwool Insulation Board 50mm 1.2x0.6m", 500, 68.50),
            ("XPS Foam Board 50mm 1.25x0.6m", 400, 52.00),
            ("Reflective Foil Insulation Roll 50m", 80, 195.00),
            ("Vapour Barrier Membrane 75m Roll", 60, 245.00),
        ], "currency": "AED",
    },
    {
        "filename": "03_APPROVED_roofing_supplies.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-403", "date": "05 May 2026", "due_date": "03 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Corrugated GI Sheet 0.5mm 3m", 350, 88.00),
            ("Ridge Cap GI 3m length", 120, 42.50),
            ("Roofing Screws Self-Drill Box/500", 40, 125.00),
            ("Bitumen Waterproof Sheet 4mm 10m Roll", 90, 310.00),
        ], "currency": "AED",
    },
    {
        "filename": "04_APPROVED_hvac_equipment.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-404", "date": "07 May 2026", "due_date": "05 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Split AC Unit 2.5 Ton Inverter", 25, 4850.00),
            ("Ductwork GI 300x200mm per metre", 500, 38.00),
            ("Air Handling Unit 5000 CFM", 4, 28500.00),
            ("Flexible Duct 200mm 6m", 150, 95.00),
        ], "currency": "AED",
    },
    {
        "filename": "05_APPROVED_landscaping.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-405", "date": "09 May 2026", "due_date": "07 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Irrigation Drip Line 16mm 100m Roll", 80, 145.00),
            ("Topsoil Premium Grade per Tonne", 50, 185.00),
            ("Paving Blocks 200x100x60mm Pallet/500", 60, 875.00),
            ("Outdoor LED Spotlight 20W", 120, 165.00),
        ], "currency": "AED",
    },
    {
        "filename": "06_APPROVED_concrete_works.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-406", "date": "11 May 2026", "due_date": "09 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Ready Mix Concrete C30 per cbm", 80, 420.00),
            ("Reinforcement Bar 10mm Fe500 12m", 600, 58.00),
            ("Concrete Admixture Superplasticizer 20L", 40, 285.00),
            ("Formwork Plywood 18mm 2400x1200", 200, 145.00),
        ], "currency": "AED",
    },
    {
        "filename": "07_APPROVED_fire_protection.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-407", "date": "01 Jun 2026", "due_date": "30 Jul 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Sprinkler Head Pendant 68C K5.6", 300, 48.50),
            ("Fire Hose Reel 30m Cabinet", 20, 1850.00),
            ("Smoke Detector Photoelectric", 150, 125.00),
            ("Fire Alarm Control Panel 16-Zone", 5, 8500.00),
        ], "currency": "AED",
    },
    {
        "filename": "08_APPROVED_drainage_systems.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-408", "date": "15 May 2026", "due_date": "13 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("HDPE Pipe 200mm SDR11 6m", 120, 385.00),
            ("Manhole Cover D400 600x600mm", 30, 650.00),
            ("Inspection Chamber 450mm dia", 25, 1250.00),
            ("Gully Trap 110mm with Grate", 80, 185.00),
        ], "currency": "AED",
    },
    {
        "filename": "09_APPROVED_solar_panels.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-409", "date": "17 May 2026", "due_date": "15 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Solar Panel Monocrystalline 400W", 60, 1250.00),
            ("Solar Inverter 10kW Grid-Tie", 6, 8750.00),
            ("Mounting Rail Aluminium 4.2m", 120, 185.00),
            ("DC Cable 6sqmm Solar Grade 100m", 12, 650.00),
        ], "currency": "AED",
    },
    {
        "filename": "10_APPROVED_interior_fit_out.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-410", "date": "19 May 2026", "due_date": "17 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Suspended Ceiling Grid T-Bar 600x600", 800, 28.50),
            ("Acoustic Ceiling Tile 600x600mm", 800, 42.00),
            ("Raised Access Floor Panel 600x600mm", 400, 185.00),
            ("Partition Wall System per sqm", 200, 320.00),
        ], "currency": "AED",
    },
    {
        "filename": "11_APPROVED_glazing_works.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-411", "date": "21 May 2026", "due_date": "19 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Double Glazed Unit 6+12+6mm per sqm", 150, 485.00),
            ("Aluminium Curtain Wall System per sqm", 80, 1250.00),
            ("Structural Silicone Sealant 600ml", 200, 95.00),
            ("Aluminium Door Frame 900x2100mm", 30, 1850.00),
        ], "currency": "AED",
    },
    {
        "filename": "12_APPROVED_earthworks.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-412", "date": "01 Jun 2026", "due_date": "30 Jul 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Excavation Works per cbm", 500, 85.00),
            ("Compacted Fill Material per Tonne", 300, 65.00),
            ("Geotextile Fabric 200gsm 100m Roll", 20, 1450.00),
            ("Sheet Piling H-Pile 300mm per metre", 200, 285.00),
        ], "currency": "AED",
    },
    {
        "filename": "13_APPROVED_mechanical_equipment.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-413", "date": "25 May 2026", "due_date": "23 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Centrifugal Pump 5.5kW 50m Head", 8, 6850.00),
            ("Pressure Vessel 500L 10 Bar", 4, 12500.00),
            ("Gate Valve Flanged 4 inch", 30, 485.00),
            ("Pressure Gauge 0-16 Bar 100mm", 50, 125.00),
        ], "currency": "AED",
    },
    {
        "filename": "14_APPROVED_road_materials.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-414", "date": "01 Jun 2026", "due_date": "30 Jul 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Asphalt Bituminous Mix per Tonne", 200, 385.00),
            ("Road Base Aggregate 20mm per Tonne", 400, 95.00),
            ("Kerb Stone Precast 1000x300x150mm", 500, 68.00),
            ("Road Marking Paint White 20L", 60, 245.00),
        ], "currency": "AED",
    },
    {
        "filename": "15_APPROVED_waterproofing.pdf",
        "label": "APPROVED", "rule_note": "All rules pass",
        "number": "ANB-INV-2026-415", "date": "29 May 2026", "due_date": "27 Aug 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Crystalline Waterproofing Slurry 25kg", 80, 385.00),
            ("Torch-Applied Membrane 4mm 10m Roll", 120, 425.00),
            ("Drainage Cell Membrane 1x20m Roll", 40, 650.00),
            ("Bentonite Waterproofing Sheet 1x5m", 60, 285.00),
        ], "currency": "AED",
    },
]

# ===================== 5 REJECTED INVOICES =====================
rejected = [
    {
        "filename": "16_REJECTED_R2_past_due_date.pdf",
        "label": "REJECTED", "rule_note": "R2: Due date in the past (Feb 2025)",
        "number": "ANB-INV-2026-416", "date": "05 Nov 2024", "due_date": "05 Feb 2025",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Precast Concrete Columns 300x300mm 4m", 20, 3850.00),
            ("Precast Concrete Beams 400x300mm 6m", 15, 4200.00),
        ], "currency": "AED",
    },
    {
        "filename": "17_REJECTED_R3_due_before_invoice.pdf",
        "label": "REJECTED", "rule_note": "R3: Due date (Apr 2026) before invoice date (Jun 2026)",
        "number": "ANB-INV-2026-417", "date": "10 Jun 2026", "due_date": "15 Apr 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Stainless Steel Handrail 50mm 3m", 80, 485.00),
            ("Balustrade Glass Panel 10mm 1x1.2m", 60, 650.00),
        ], "currency": "AED",
    },
    {
        "filename": "18_REJECTED_R7_wrong_currency_USD.pdf",
        "label": "REJECTED", "rule_note": "R7: Currency is USD (must be AED)",
        "number": "ANB-INV-2026-418", "date": "08 Mar 2026", "due_date": "06 Sep 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Imported Italian Marble Slabs 20mm sqm", 80, 520.00),
            ("Onyx Stone Feature Wall Panel sqm", 30, 1850.00),
        ], "currency": "USD",
    },
    {
        "filename": "19_REJECTED_R16_tobacco_products.pdf",
        "label": "REJECTED", "rule_note": "R16: Shariah restricted - Tobacco products",
        "number": "ANB-INV-2026-419", "date": "12 Mar 2026", "due_date": "10 Sep 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Cigarettes Premium Brand Carton/200", 5000, 85.00),
            ("Shisha Tobacco Flavoured 250g Box/10", 800, 145.00),
            ("Cigars Premium Cuban Box/25", 200, 650.00),
        ], "currency": "AED",
    },
    {
        "filename": "20_REJECTED_R16_pork_products.pdf",
        "label": "REJECTED", "rule_note": "R16: Shariah restricted - Pork products",
        "number": "ANB-INV-2026-420", "date": "18 Mar 2026", "due_date": "16 Sep 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Pork Belly Frozen per kg", 2000, 48.00),
            ("Pork Sausages Chilled Box/10kg", 500, 185.00),
            ("Cured Ham Imported per kg", 800, 95.00),
        ], "currency": "AED",
    },
]

# ===================== 10 REFER INVOICES =====================
refer = [
    {
        "filename": "21_REFER_R5_future_dated_invoice.pdf",
        "label": "REFER", "rule_note": "R5: Invoice date (Nov 2026) is in the future",
        "number": "ANB-INV-2026-421", "date": "20 Nov 2026", "due_date": "18 Feb 2027",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Modular Kitchen Cabinets Set", 5, 18500.00),
            ("Quartz Countertop per sqm", 40, 1250.00),
        ], "currency": "AED",
    },
    {
        "filename": "22_REFER_R8_math_mismatch.pdf",
        "label": "REFER", "rule_note": "R8: Subtotal + VAT != Total (math mismatch)",
        "number": "ANB-INV-2026-422", "date": "22 Mar 2026", "due_date": "20 Sep 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Epoxy Floor Coating 20L Kit", 80, 485.00),
            ("Self-Levelling Compound 25kg", 200, 145.00),
            ("Floor Hardener Metallic 25kg", 100, 285.00),
        ], "currency": "AED",
        "override_total": 95000.00,  # Wrong! Correct ~75,285.00
    },
    {
        "filename": "23_REFER_R9_seller_name_mismatch.pdf",
        "label": "REFER", "rule_note": "R9: Seller name differs from system (Al Noor Trading LLC)",
        "number": "ANB-INV-2026-423", "date": "25 Mar 2026", "due_date": "23 Sep 2026",
        "seller": "Al Noor Trading LLC",  # Abbreviated - mismatch
        "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Acoustic Insulation Panel 50mm sqm", 300, 185.00),
            ("Soundproofing Mat 5mm Roll 10sqm", 100, 245.00),
            ("Resilient Channel 3m length", 200, 68.00),
        ], "currency": "AED",
    },
    {
        "filename": "24_REFER_R10_buyer_name_mismatch.pdf",
        "label": "REFER", "rule_note": "R10: Buyer name differs from system (Al Masraf Ind.)",
        "number": "ANB-INV-2026-424", "date": "28 Mar 2026", "due_date": "26 Sep 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN,
        "buyer": "Al Masraf Ind.",  # Abbreviated - mismatch
        "buyer_trn": BUYER_TRN,
        "items": [
            ("Expansion Joint Cover Aluminium 3m", 60, 385.00),
            ("Movement Joint Sealant 600ml", 150, 95.00),
            ("Backing Rod 20mm 50m Roll", 80, 145.00),
        ], "currency": "AED",
    },
    {
        "filename": "25_REFER_R14_invalid_trn_format.pdf",
        "label": "REFER", "rule_note": "R14: Invalid TRN format (alphanumeric, wrong length)",
        "number": "ANB-INV-2026-425", "date": "01 Apr 2026", "due_date": "30 Sep 2026",
        "seller": SELLER, "seller_trn": "TRN300-456-789",  # Invalid format
        "buyer": BUYER, "buyer_trn": "100-234-567-890",    # Invalid format
        "items": [
            ("Raised Floor Pedestal Adjustable", 600, 185.00),
            ("Anti-Static Carpet Tile 500x500mm", 800, 95.00),
            ("Cable Management Tray 100x50mm 3m", 200, 125.00),
        ], "currency": "AED",
    },
    {
        "filename": "26_REFER_R15_trn_system_mismatch.pdf",
        "label": "REFER", "rule_note": "R15: TRN format valid but does not match system records",
        "number": "ANB-INV-2026-426", "date": "05 Apr 2026", "due_date": "04 Jul 2026",
        "seller": SELLER, "seller_trn": "300456789099999",  # Valid format, wrong number
        "buyer": BUYER, "buyer_trn": "100234567800001",     # Valid format, wrong number
        "items": [
            ("Precast Concrete Cladding Panel sqm", 200, 850.00),
            ("Stone Cladding Limestone 30mm sqm", 100, 1250.00),
        ], "currency": "AED",
    },
    {
        "filename": "27_REFER_R17_round_number_500k.pdf",
        "label": "REFER", "rule_note": "R17: Total is exact round number AED 500,000",
        "number": "ANB-INV-2026-427", "date": "08 Apr 2026", "due_date": "07 Jul 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Large Construction Package - Phase 2", 1, 476190.48),
        ], "currency": "AED",
        "override_subtotal": 476190.48,
        "override_vat": 23809.52,
        "override_total": 500000.00,
    },
    {
        "filename": "28_REFER_R8_vat_calculation_error.pdf",
        "label": "REFER", "rule_note": "R8: VAT calculated at 10% instead of 5% (math mismatch)",
        "number": "ANB-INV-2026-428", "date": "12 Apr 2026", "due_date": "11 Jul 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Aluminium Composite Cladding 4mm sqm", 400, 285.00),
            ("Curtain Wall Mullion 3m length", 150, 485.00),
            ("Structural Glazing Tape 25mm 50m", 100, 125.00),
        ], "currency": "AED",
        # Subtotal = 400*285 + 150*485 + 100*125 = 114000+72750+12500 = 199250
        # Correct VAT (5%) = 9962.50, Total = 209212.50
        # Override: VAT at 10% = 19925.00, Total = 219175.00 (mismatch)
        "override_vat": 19925.00,
        "override_total": 219175.00,
    },
    {
        "filename": "29_REFER_R5_future_dated_dec.pdf",
        "label": "REFER", "rule_note": "R5: Invoice date (Sep 2026) is in the future",
        "number": "ANB-INV-2026-429", "date": "15 Sep 2026", "due_date": "14 Dec 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Prefabricated Steel Staircase Unit", 3, 28500.00),
            ("Handrail Stainless Steel 316 per metre", 120, 485.00),
            ("Non-Slip Stair Nosing Aluminium 3m", 60, 185.00),
        ], "currency": "AED",
    },
    {
        "filename": "30_REFER_R17_round_number_100k.pdf",
        "label": "REFER", "rule_note": "R17: Total is exact round number AED 100,000",
        "number": "ANB-INV-2026-430", "date": "18 Apr 2026", "due_date": "17 Jul 2026",
        "seller": SELLER, "seller_trn": SELLER_TRN, "buyer": BUYER, "buyer_trn": BUYER_TRN,
        "items": [
            ("Specialist Works Package - Electrical", 1, 95238.10),
        ], "currency": "AED",
        "override_subtotal": 95238.10,
        "override_vat": 4761.90,
        "override_total": 100000.00,
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
    print("Generating 30 invoices (15 Approved, 5 Rejected, 10 Refer)...")
    print(f"Output: {OUTPUT_DIR}\n")
    print(f"{'#':<3} {'File':<48} {'Status':<10} {'Rule':<50} {'Total':>14}")
    print("-" * 130)

    for i, inv in enumerate(all_invoices, 1):
        filepath = os.path.join(OUTPUT_DIR, inv['filename'])
        sub, vat, total = create_invoice_pdf(inv, filepath)
        print(f"{i:<3} {inv['filename']:<48} {inv['label']:<10} "
              f"{inv['rule_note']:<50} {inv['currency']} {total:>10,.2f}")

    approved_count = sum(1 for inv in all_invoices if inv['label'] == 'APPROVED')
    rejected_count = sum(1 for inv in all_invoices if inv['label'] == 'REJECTED')
    refer_count    = sum(1 for inv in all_invoices if inv['label'] == 'REFER')

    print(f"\nDone! 30 invoices in: {OUTPUT_DIR}")
    print(f"  APPROVED : {approved_count}")
    print(f"  REJECTED : {rejected_count}")
    print(f"  REFER    : {refer_count}")
