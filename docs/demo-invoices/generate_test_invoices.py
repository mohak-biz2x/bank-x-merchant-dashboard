"""
Generate 10 diverse invoice PDFs with HIGH VARIABILITY in layout, format,
and field placement to stress-test invoice parsing/OCR systems.

Each invoice uses a DIFFERENT layout style:
1. Standard 2-column header
2. Right-aligned invoice details, left supplier block
3. Centered header with horizontal rule separators
4. Minimal/modern with large whitespace
5. Dense/compact with small fonts
6. Table-based header (all info in a grid)
7. Letterhead style (supplier at top, invoice # at bottom of header)
8. Two-column mirrored (buyer left, supplier right)
9. Invoice details in a bordered box at top-right
10. Mixed: some fields in footer, non-standard field names
"""
from reportlab.lib.pagesizes import A4, LETTER
from reportlab.lib.units import mm, cm, inch
from reportlab.lib.colors import HexColor, black, white, gray
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer,
    HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
import os

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test-invoices")
os.makedirs(OUTPUT_DIR, exist_ok=True)

GRAY_BG = HexColor("#F5F5F5")

# ============================================================
# INVOICE DATA - each with different field naming conventions
# ============================================================
invoices = [
    # 1: Standard format, SAR, petrochemicals
    {
        "number": "GPC/2025/0441",
        "date": "02-Jan-2025",
        "due": "02-Apr-2025",
        "po_number": "PO-EMP-2024-1187",
        "seller": "Gulf Petrochemicals Trading Co.",
        "seller_tax_id": "300456789012345",
        "seller_addr": "Industrial Zone 3, Block 7\nJubail 31951, Saudi Arabia",
        "seller_phone": "+966 13 345 6789",
        "seller_email": "accounts@gulfpetrochem.sa",
        "buyer": "Emirates Plastics Manufacturing LLC",
        "buyer_addr": "Jebel Ali Free Zone, Plot 22\nDubai, UAE",
        "buyer_tax_id": "100987654321098",
        "items": [
            ("Polyethylene Granules HDPE 25kg", 400, 125.00, 50000.00),
            ("Polypropylene Resin H030SG", 200, 145.00, 29000.00),
            ("PVC Compound K-67 Suspension", 300, 98.00, 29400.00),
            ("Titanium Dioxide Rutile Grade", 50, 520.00, 26000.00),
            ("Calcium Carbonate Filler Coated", 600, 35.00, 21000.00),
        ],
        "subtotal": 155400.00,
        "discount": 0,
        "tax_rate": "5%",
        "tax": 7770.00,
        "total": 163170.00,
        "currency": "SAR",
        "bank": "Saudi National Bank (SNB)",
        "iban": "SA4420000001234567891234",
        "swift": "NCBKSAJE",
        "notes": "Delivery within 14 days of order confirmation.",
        "page_size": A4,
    },
    # 2: Date in DD/MM/YYYY, BHD, food industry, includes discount
    {
        "number": "BFF-24-00892",
        "date": "15/01/2025",
        "due": "15/03/2025",
        "po_number": None,
        "seller": "Bahrain Fresh Foods International W.L.L.",
        "seller_tax_id": "BH-VAT-00234567",
        "seller_addr": "Hidd Industrial Area, Unit 14, Manama, Kingdom of Bahrain",
        "seller_phone": "+973 1774 5500",
        "seller_email": None,
        "buyer": "Carrefour Hypermarket - UAE Division",
        "buyer_addr": "City Centre Deira, Level 2, Dubai, United Arab Emirates",
        "buyer_tax_id": "AE-TRN-100234567890123",
        "items": [
            ("Frozen Chicken Breast 10kg CTN", 500, 85.00, 42500.00),
            ("Atlantic Salmon Fillets 5kg", 200, 210.00, 42000.00),
            ("Extra Virgin Olive Oil 5L Organic", 1000, 48.00, 48000.00),
            ("Basmati Rice Premium 25kg", 800, 62.00, 49600.00),
            ("UHT Milk Full Cream 1L x12", 600, 32.00, 19200.00),
            ("Canned Tuna Olive Oil 185g x48", 300, 95.00, 28500.00),
        ],
        "subtotal": 229800.00,
        "discount": 11490.00,
        "tax_rate": "10%",
        "tax": 21831.00,
        "total": 240141.00,
        "currency": "BHD",
        "bank": "National Bank of Bahrain",
        "iban": "BH67NBOB00001299123456",
        "swift": "NBOBBHBM",
        "notes": "Cold chain delivery required. Reject if temp > -18C on arrival.",
        "page_size": A4,
    },
    # 3: Date as "February 28, 2025", OMR, medical, zero VAT
    {
        "number": "OMS-INV-2025-00156",
        "date": "February 28, 2025",
        "due": "May 29, 2025",
        "po_number": "MOH/PROC/2025/Q1-334",
        "seller": "Oman Medical Supplies SAOC",
        "seller_tax_id": "OM1234567890",
        "seller_addr": "Knowledge Oasis Muscat\nBuilding 5, Floor 2\nMuscat 131, Sultanate of Oman",
        "seller_phone": "+968 2450 1234",
        "seller_email": "billing@omanmedsupply.om",
        "buyer": "Royal Hospital - Procurement Department",
        "buyer_addr": "Al Ghubra\nMinistry of Health Complex\nMuscat, Sultanate of Oman",
        "buyer_tax_id": None,
        "items": [
            ("Surgical Gloves Nitrile Medium Box/100", 2000, 28.00, 56000.00),
            ("Disposable Syringes 5ml Box/100", 1500, 15.00, 22500.00),
            ("N95 Respirator Masks Box/20", 3000, 42.00, 126000.00),
            ("IV Cannula 20G Box/50", 800, 65.00, 52000.00),
            ("Surgical Sutures Vicryl 3-0 Box/12", 400, 180.00, 72000.00),
        ],
        "subtotal": 328500.00,
        "discount": 0,
        "tax_rate": "0%",
        "tax": 0,
        "total": 328500.00,
        "currency": "OMR",
        "bank": "Bank Muscat SAOG",
        "iban": "OM040280000012345678901",
        "swift": "BMUSALMC",
        "notes": "Medical supplies exempt from VAT per Oman Tax Authority ruling.",
        "page_size": A4,
    },
    # 4: US Letter size, KWD, automotive, no tax, many items
    {
        "number": "KAP-W-10032025-007",
        "date": "10 March 2025",
        "due": "09 June 2025",
        "po_number": "AMA/PUR/25-0091",
        "seller": "Kuwait Auto Parts Wholesale Co. K.S.C.C.",
        "seller_tax_id": None,
        "seller_addr": "Shuwaikh Industrial\nBlock 4, Street 12\nKuwait City, Kuwait",
        "seller_phone": "+965 2481 7700",
        "seller_email": "sales@kuwaitautoparts.kw",
        "buyer": "Al Mulla Automotive Group",
        "buyer_addr": "Fahaheel Expressway\nShowroom Complex\nKuwait City 13001, Kuwait",
        "buyer_tax_id": None,
        "items": [
            ("Engine Oil 5W-30 Full Synthetic 4L", 2000, 18.50, 37000.00),
            ("Brake Pads Ceramic Front Set", 500, 45.00, 22500.00),
            ("Air Filters Universal Fit", 1200, 12.00, 14400.00),
            ("Car Batteries 12V 70Ah Maintenance-Free", 300, 85.00, 25500.00),
            ("Windshield Wipers 24in Pair", 800, 22.00, 17600.00),
            ("Spark Plugs Iridium Set/4", 600, 38.00, 22800.00),
            ("Transmission Fluid ATF 1L", 1500, 14.00, 21000.00),
        ],
        "subtotal": 160800.00,
        "discount": 0,
        "tax_rate": "0%",
        "tax": 0,
        "total": 160800.00,
        "currency": "KWD",
        "bank": "National Bank of Kuwait",
        "iban": "KW81NBOK0000000000001000560101",
        "swift": "NBOKKWKW",
        "notes": "Warranty: 12 months from date of sale. Returns accepted within 30 days.",
        "page_size": LETTER,
    },
    # 5: Date YYYY-MM-DD (ISO), AED, textiles, large amounts
    {
        "number": "DTG/FZE/2025/03/0055",
        "date": "2025-03-22",
        "due": "2025-06-20",
        "po_number": "LMG-CP-PO-2025-445",
        "seller": "Dubai Textiles & Garments FZE",
        "seller_tax_id": "AE-TRN-300567890123456",
        "seller_addr": "Dubai Textile City\nWarehouse 8, Gate 3\nDubai, U.A.E.",
        "seller_phone": "+971 4 885 3300",
        "seller_email": "invoices@dubaitextiles.ae",
        "buyer": "Landmark Group - Centrepoint Division",
        "buyer_addr": "Jebel Ali Distribution Centre\nPlot DIP-2-45\nDubai, U.A.E.",
        "buyer_tax_id": "AE-TRN-100345678901234",
        "items": [
            ("Men Cotton T-Shirts Assorted Box/50", 200, 450.00, 90000.00),
            ("Women Linen Blouses Assorted Box/30", 150, 720.00, 108000.00),
            ("Children Denim Jeans Assorted Box/40", 100, 560.00, 56000.00),
            ("Bed Sheet Sets King Cotton 400TC", 500, 95.00, 47500.00),
            ("Bath Towels Premium Pack/6", 800, 68.00, 54400.00),
        ],
        "subtotal": 355900.00,
        "discount": 17795.00,
        "tax_rate": "5%",
        "tax": 16905.25,
        "total": 355010.25,
        "currency": "AED",
        "bank": "Emirates NBD",
        "iban": "AE070331234567890123456",
        "swift": "EBILAEAD",
        "notes": "5% early payment discount applied. Quality inspection on delivery.",
        "page_size": A4,
    },
    # 6: QAR, IT hardware, very high value, date "5 April 2025"
    {
        "number": "QITS-2025-INV-0078",
        "date": "5 April 2025",
        "due": "4 July 2025",
        "po_number": "HIA-IT-2025-PO-0034",
        "seller": "Qatar IT Solutions & Hardware W.L.L.",
        "seller_tax_id": "QA-TAX-9900112233",
        "seller_addr": "West Bay Tower, Floor 18, Doha, State of Qatar",
        "seller_phone": "+974 4412 8800",
        "seller_email": "ar@qataritsolutions.qa",
        "buyer": "Hamad International Airport - IT Department",
        "buyer_addr": "Airport City, Terminal 1 Admin Block, Doha, State of Qatar",
        "buyer_tax_id": "QA-TAX-0011223344",
        "items": [
            ("Dell Latitude 5540 i7/16GB/512GB SSD", 50, 4200.00, 210000.00),
            ("HP LaserJet Pro MFP M428fdw Printer", 20, 2800.00, 56000.00),
            ("Cisco Catalyst 9300 Switch 48-Port PoE+", 10, 12500.00, 125000.00),
            ("Samsung 55in Commercial Display QMR Series", 30, 3600.00, 108000.00),
            ("APC Smart-UPS 3000VA Rack Mount 2U", 15, 5200.00, 78000.00),
        ],
        "subtotal": 577000.00,
        "discount": 28850.00,
        "tax_rate": "0%",
        "tax": 0,
        "total": 548150.00,
        "currency": "QAR",
        "bank": "Qatar National Bank (QNB)",
        "iban": "QA58QNBA000000000012345678901",
        "swift": "QNBAQAQA",
        "notes": "5% volume discount applied. Installation included. 3-year warranty on all items.",
        "page_size": A4,
    },
    # 7: JOD, pharma, date "18-Apr-25" (2-digit year), many items
    {
        "number": "JPI/EXP/25/00234",
        "date": "18-Apr-25",
        "due": "17-Jul-25",
        "po_number": "SPD-RIYADH-PO-2025-0112",
        "seller": "Jordan Pharmaceutical Industries PLC",
        "seller_tax_id": "JO-TAX-12345678",
        "seller_addr": "King Abdullah II Industrial Estate, Sahab, Amman 11512, Jordan",
        "seller_phone": "+962 6 402 1500",
        "seller_email": "export.invoices@jpi-pharma.jo",
        "buyer": "Saudi Pharmaceutical Distribution Co. Ltd.",
        "buyer_addr": "2nd Industrial City, Warehouse 45, Riyadh 14326, Kingdom of Saudi Arabia",
        "buyer_tax_id": "SA-VAT-310987654321",
        "items": [
            ("Paracetamol 500mg Tabs Box/1000", 5000, 8.50, 42500.00),
            ("Amoxicillin 500mg Caps Box/500", 3000, 22.00, 66000.00),
            ("Omeprazole 20mg Caps Box/500", 2000, 35.00, 70000.00),
            ("Metformin 850mg Tabs Box/1000", 4000, 12.00, 48000.00),
            ("Ibuprofen 400mg Tabs Box/1000", 3500, 9.50, 33250.00),
            ("Cetirizine 10mg Tabs Box/500", 2500, 14.00, 35000.00),
        ],
        "subtotal": 294750.00,
        "discount": 0,
        "tax_rate": "5%",
        "tax": 14737.50,
        "total": 309487.50,
        "currency": "JOD",
        "bank": "Arab Bank PLC - Amman",
        "iban": "JO94ARAB1234000000012345678901",
        "swift": "ARABJOAX",
        "notes": "Batch numbers and expiry dates on packing list. GDP compliant shipment.",
        "page_size": A4,
    },
    # 8: AED, steel/construction, very high value, date "01.05.2025" (dots)
    {
        "number": "ADSM-2025-05-0019",
        "date": "01.05.2025",
        "due": "30.07.2025",
        "po_number": "ALDAR/PROJ/RB-Phase3/PO-089",
        "seller": "Abu Dhabi Steel & Metals Trading LLC",
        "seller_tax_id": "AE-TRN-300111222333444",
        "seller_addr": "ICAD III, Plot 112\nMussafah\nAbu Dhabi, UAE",
        "seller_phone": "+971 2 550 9900",
        "seller_email": "finance@adsteelmetals.ae",
        "buyer": "ALDAR Properties PJSC",
        "buyer_addr": "Al Raha Beach\nALDAR HQ Tower, Floor 3\nAbu Dhabi, UAE",
        "buyer_tax_id": "AE-TRN-100222333444555",
        "items": [
            ("Structural Steel H-Beam 200x200mm 12m", 100, 2800.00, 280000.00),
            ("Steel Plates 20mm 2400x1200mm", 50, 3500.00, 175000.00),
            ("SS Pipes 4in Sch40 6m", 200, 890.00, 178000.00),
            ("Galvanized Steel Sheets 1.2mm", 500, 185.00, 92500.00),
        ],
        "subtotal": 725500.00,
        "discount": 0,
        "tax_rate": "5%",
        "tax": 36275.00,
        "total": 761775.00,
        "currency": "AED",
        "bank": "First Abu Dhabi Bank (FAB)",
        "iban": "AE410090000000123456789",
        "swift": "NBADOREA",
        "notes": "Material test certificates included. Delivery to site gate only.",
        "page_size": A4,
    },
    # 9: USD, food/FMCG, date "May 12, 2025", many small items
    {
        "number": "LGF-EXP-2025-0567",
        "date": "May 12, 2025",
        "due": "August 10, 2025",
        "po_number": "SPIN-DXB-PO-25-0234",
        "seller": "Lebanese Gourmet Foods S.A.L.",
        "seller_tax_id": "LB-MOF-445566778",
        "seller_addr": "Beirut Port Free Zone\nHangar 6, Section B\nBeirut, Lebanon",
        "seller_phone": "+961 1 444 567",
        "seller_email": None,
        "buyer": "Spinneys Dubai LLC",
        "buyer_addr": "Al Quoz Industrial Area 1, Plot 334, Dubai, UAE",
        "buyer_tax_id": "AE-TRN-100678901234567",
        "items": [
            ("Premium Hummus 500g Case/12", 400, 72.00, 28800.00),
            ("Pita Bread Pack/6 Case/20", 600, 45.00, 27000.00),
            ("Mixed Nuts Roasted 1kg", 1000, 38.00, 38000.00),
            ("Tahini Paste 900g Case/6", 350, 54.00, 18900.00),
            ("Zaatar Spice Mix 250g Case/24", 500, 88.00, 44000.00),
            ("Stuffed Grape Leaves 400g Case/12", 300, 96.00, 28800.00),
            ("Rose Water 500ml Case/12", 200, 60.00, 12000.00),
        ],
        "subtotal": 197500.00,
        "discount": 0,
        "tax_rate": "5%",
        "tax": 9875.00,
        "total": 207375.00,
        "currency": "USD",
        "bank": "BLOM Bank SAL",
        "iban": "LB620014000000012345678901",
        "swift": "BLOMLBBX",
        "notes": "Halal certified. Shelf life minimum 6 months on delivery.",
        "page_size": LETTER,
    },
    # 10: AED, furniture, date "20/05/2025", high value, fewer items
    {
        "number": "SFM/2025/INV/00312",
        "date": "20/05/2025",
        "due": "18/08/2025",
        "po_number": "MARR-MEA-FF&E-2025-0078",
        "seller": "Sharjah Furniture Manufacturing LLC",
        "seller_tax_id": "AE-TRN-300888999000111",
        "seller_addr": "Sharjah Industrial Area 6\nPlot 33, Street 14\nSharjah, UAE",
        "seller_phone": "+971 6 534 2200",
        "seller_email": "accounts.receivable@sharjahfurniture.ae",
        "buyer": "Marriott International - MEA Procurement",
        "buyer_addr": "Sheikh Zayed Road, Tower 3\nFloor 25, Office 2501\nDubai, UAE",
        "buyer_tax_id": "AE-TRN-100555666777888",
        "items": [
            ("King Size Bed Frame Walnut", 80, 2200.00, 176000.00),
            ("Executive Office Desk 180cm", 40, 1850.00, 74000.00),
            ("Ergonomic Office Chair Leather", 120, 950.00, 114000.00),
            ("Bedside Table Pair Walnut", 80, 680.00, 54400.00),
            ("Wardrobe 3-Door Walnut", 60, 3100.00, 186000.00),
            ("Dining Table 8-Seater Oak", 25, 4500.00, 112500.00),
        ],
        "subtotal": 716900.00,
        "discount": 35845.00,
        "tax_rate": "5%",
        "tax": 34052.75,
        "total": 715107.75,
        "currency": "AED",
        "bank": "Sharjah Islamic Bank",
        "iban": "AE520400000012345678901",
        "swift": "NBSHAEAS",
        "notes": "5% project discount applied. Assembly and installation included in price.",
        "page_size": A4,
    },
]


# ============================================================
# LAYOUT GENERATORS - each produces a visually different PDF
# ============================================================

def get_styles():
    """Base styles reused across layouts."""
    styles = getSampleStyleSheet()
    return styles


def layout_1_standard(inv, output_path):
    """Standard 2-column: invoice details left, supplier right."""
    PRIMARY = HexColor("#036836")
    doc = SimpleDocTemplate(output_path, pagesize=inv["page_size"],
        topMargin=2*cm, bottomMargin=1.5*cm, leftMargin=1.5*cm, rightMargin=1.5*cm)
    styles = get_styles()
    ts = ParagraphStyle('t', parent=styles['Normal'], fontSize=9, leading=12)
    th = ParagraphStyle('th', parent=styles['Normal'], fontSize=9, leading=12, textColor=PRIMARY)
    tr = ParagraphStyle('tr', parent=styles['Normal'], fontSize=9, alignment=TA_RIGHT)
    elements = []

    # Title
    elements.append(Paragraph("<b>INVOICE</b>", ParagraphStyle('ti', parent=styles['Heading1'],
        fontSize=24, textColor=PRIMARY)))
    elements.append(Spacer(1, 3*mm))

    # Two-column header
    left_col = [
        Paragraph(f"<b>Invoice Number:</b> {inv['number']}", ts),
        Paragraph(f"<b>Invoice Date:</b> {inv['date']}", ts),
        Paragraph(f"<b>Payment Due:</b> {inv['due']}", ts),
    ]
    if inv.get("po_number"):
        left_col.append(Paragraph(f"<b>PO Reference:</b> {inv['po_number']}", ts))

    right_col = [
        Paragraph(f"<b>{inv['seller']}</b>", ts),
        Paragraph(f"Tax ID: {inv['seller_tax_id']}", ts) if inv.get('seller_tax_id') else Paragraph("", ts),
        Paragraph(inv['seller_addr'].replace('\n', '<br/>'), ts),
        Paragraph(f"Phone: {inv['seller_phone']}", ts),
    ]
    if inv.get('seller_email'):
        right_col.append(Paragraph(f"Email: {inv['seller_email']}", ts))

    header_data = [[left_col[i] if i < len(left_col) else Paragraph("", ts),
                    right_col[i] if i < len(right_col) else Paragraph("", ts)]
                   for i in range(max(len(left_col), len(right_col)))]
    ht = Table(header_data, colWidths=[9*cm, 9*cm])
    ht.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    elements.append(ht)
    elements.append(Spacer(1, 5*mm))

    # Bill To
    elements.append(Paragraph("<b>BILL TO:</b>", th))
    elements.append(Paragraph(inv['buyer'], ts))
    elements.append(Paragraph(inv['buyer_addr'].replace('\n', ', '), ts))
    if inv.get('buyer_tax_id'):
        elements.append(Paragraph(f"Tax ID: {inv['buyer_tax_id']}", ts))
    elements.append(Spacer(1, 5*mm))

    # Items
    elements.append(_build_items_table(inv, PRIMARY))
    elements.append(Spacer(1, 5*mm))

    # Bank details
    elements.append(Paragraph("<b>BANK DETAILS</b>", th))
    elements.append(Paragraph(f"Bank: {inv['bank']} | IBAN: {inv['iban']} | SWIFT: {inv['swift']}", ts))
    elements.append(Spacer(1, 3*mm))
    if inv.get('notes'):
        elements.append(Paragraph(f"<i>Note: {inv['notes']}</i>",
            ParagraphStyle('n', parent=ts, textColor=HexColor("#666666"), fontSize=8)))

    doc.build(elements)


def layout_2_right_aligned(inv, output_path):
    """Invoice details in a box top-right, supplier block top-left."""
    PRIMARY = HexColor("#1565C0")
    doc = SimpleDocTemplate(output_path, pagesize=inv["page_size"],
        topMargin=1.5*cm, bottomMargin=1.5*cm, leftMargin=2*cm, rightMargin=2*cm)
    styles = get_styles()
    ts = ParagraphStyle('t', parent=styles['Normal'], fontSize=9, leading=12)
    elements = []

    # Supplier name large at top
    elements.append(Paragraph(f"<b>{inv['seller']}</b>",
        ParagraphStyle('s', parent=styles['Heading1'], fontSize=14, textColor=PRIMARY)))
    elements.append(Paragraph(inv['seller_addr'].replace('\n', ' | '), ts))
    elements.append(Paragraph(f"Tel: {inv['seller_phone']}" +
        (f" | {inv['seller_email']}" if inv.get('seller_email') else ""), ts))
    elements.append(Spacer(1, 4*mm))
    elements.append(HRFlowable(width="100%", thickness=2, color=PRIMARY))
    elements.append(Spacer(1, 4*mm))

    # Invoice details in bordered box (right side via table)
    inv_box_data = [
        [Paragraph("<b>COMMERCIAL INVOICE</b>", ParagraphStyle('cb', parent=ts, alignment=TA_CENTER, fontSize=11, textColor=white))],
        [Paragraph(f"No: {inv['number']}", ts)],
        [Paragraph(f"Dated: {inv['date']}", ts)],
        [Paragraph(f"Due: {inv['due']}", ts)],
        [Paragraph(f"Currency: {inv['currency']}", ts)],
    ]
    if inv.get('po_number'):
        inv_box_data.append([Paragraph(f"Your Ref: {inv['po_number']}", ts)])

    inv_box = Table(inv_box_data, colWidths=[6*cm])
    inv_box.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('BACKGROUND', (0,0), (0,0), PRIMARY),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
    ]))

    # Buyer info left, invoice box right
    buyer_text = [
        Paragraph("<b>Billed To:</b>", ts),
        Paragraph(inv['buyer'], ts),
        Paragraph(inv['buyer_addr'].replace('\n', '<br/>'), ts),
    ]
    if inv.get('buyer_tax_id'):
        buyer_text.append(Paragraph(f"TRN: {inv['buyer_tax_id']}", ts))

    layout_table = Table([[buyer_text, inv_box]], colWidths=[11*cm, 6.5*cm])
    layout_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    elements.append(layout_table)
    elements.append(Spacer(1, 6*mm))

    # Items
    elements.append(_build_items_table(inv, PRIMARY))
    elements.append(Spacer(1, 6*mm))

    # Payment at bottom in shaded box
    pay_data = [[Paragraph(f"<b>Payment:</b> {inv['bank']} | IBAN: {inv['iban']} | BIC: {inv['swift']}", ts)]]
    pay_t = Table(pay_data, colWidths=[17*cm])
    pay_t.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), HexColor("#E3F2FD")),
        ('BOX', (0,0), (-1,-1), 0.5, PRIMARY), ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 4), ('BOTTOMPADDING', (0,0), (-1,-1), 4)]))
    elements.append(pay_t)

    if inv.get('notes'):
        elements.append(Spacer(1, 3*mm))
        elements.append(Paragraph(f"Remarks: {inv['notes']}",
            ParagraphStyle('n', parent=ts, fontSize=8, textColor=HexColor("#555555"))))

    doc.build(elements)


def layout_3_centered(inv, output_path):
    """Centered header, horizontal rules, formal/government style."""
    PRIMARY = HexColor("#6A1B9A")
    doc = SimpleDocTemplate(output_path, pagesize=inv["page_size"],
        topMargin=2*cm, bottomMargin=2*cm, leftMargin=2.5*cm, rightMargin=2.5*cm)
    styles = get_styles()
    tc = ParagraphStyle('tc', parent=styles['Normal'], fontSize=9, leading=12, alignment=TA_CENTER)
    ts = ParagraphStyle('ts', parent=styles['Normal'], fontSize=9, leading=12)
    elements = []

    # Centered supplier header
    elements.append(Paragraph(f"<b>{inv['seller'].upper()}</b>",
        ParagraphStyle('h', parent=styles['Heading1'], fontSize=16, alignment=TA_CENTER, textColor=PRIMARY)))
    elements.append(Paragraph(inv['seller_addr'].replace('\n', ' - '), tc))
    elements.append(Paragraph(f"Telephone: {inv['seller_phone']}" +
        (f" | Email: {inv['seller_email']}" if inv.get('seller_email') else ""), tc))
    if inv.get('seller_tax_id'):
        elements.append(Paragraph(f"Tax Registration: {inv['seller_tax_id']}", tc))
    elements.append(Spacer(1, 3*mm))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY))
    elements.append(Spacer(1, 2*mm))
    elements.append(Paragraph("<b>TAX INVOICE</b>",
        ParagraphStyle('ti', parent=tc, fontSize=14, textColor=PRIMARY)))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY))
    elements.append(Spacer(1, 4*mm))

    # Invoice meta in centered table
    meta = [
        ["Invoice Ref.", "Date of Issue", "Payment Terms", "Amount Due"],
        [inv['number'], inv['date'], "Net 90 Days", f"{inv['currency']} {inv['total']:,.2f}"],
    ]
    mt = Table(meta, colWidths=[4.5*cm, 4*cm, 3.5*cm, 4*cm])
    mt.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'), ('FONTSIZE', (0,0), (-1,-1), 9),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'), ('GRID', (0,0), (-1,-1), 0.5, HexColor("#CCCCCC")),
        ('BACKGROUND', (0,0), (-1,0), HexColor("#F3E5F5")),
        ('TOPPADDING', (0,0), (-1,-1), 4), ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(mt)
    elements.append(Spacer(1, 5*mm))

    # Customer section
    elements.append(Paragraph("<b>Customer:</b>", ts))
    elements.append(Paragraph(f"{inv['buyer']}", ts))
    elements.append(Paragraph(f"{inv['buyer_addr'].replace(chr(10), ', ')}", ts))
    if inv.get('po_number'):
        elements.append(Paragraph(f"Purchase Order: {inv['po_number']}", ts))
    elements.append(Spacer(1, 5*mm))

    # Items
    elements.append(_build_items_table(inv, PRIMARY))
    elements.append(Spacer(1, 6*mm))

    # Bank details centered
    elements.append(HRFlowable(width="100%", thickness=0.5, color=gray))
    elements.append(Spacer(1, 3*mm))
    elements.append(Paragraph("<b>REMITTANCE DETAILS</b>", tc))
    elements.append(Paragraph(f"Beneficiary: {inv['seller']}", tc))
    elements.append(Paragraph(f"Bank: {inv['bank']}", tc))
    elements.append(Paragraph(f"IBAN: {inv['iban']} | SWIFT/BIC: {inv['swift']}", tc))
    if inv.get('notes'):
        elements.append(Spacer(1, 4*mm))
        elements.append(Paragraph(f"<i>{inv['notes']}</i>",
            ParagraphStyle('n', parent=tc, fontSize=8, textColor=HexColor("#666666"))))

    doc.build(elements)


def layout_4_minimal(inv, output_path):
    """Minimal/modern with lots of whitespace, large invoice number."""
    PRIMARY = HexColor("#E65100")
    doc = SimpleDocTemplate(output_path, pagesize=inv["page_size"],
        topMargin=3*cm, bottomMargin=2*cm, leftMargin=2.5*cm, rightMargin=2.5*cm)
    styles = get_styles()
    ts = ParagraphStyle('ts', parent=styles['Normal'], fontSize=9, leading=13)
    elements = []

    # Large invoice number at top
    elements.append(Paragraph(f"<b>{inv['number']}</b>",
        ParagraphStyle('big', parent=styles['Heading1'], fontSize=28, textColor=PRIMARY)))
    elements.append(Spacer(1, 2*mm))
    elements.append(Paragraph("INVOICE",
        ParagraphStyle('sub', parent=styles['Normal'], fontSize=10, textColor=gray)))
    elements.append(Spacer(1, 10*mm))

    # Minimal info grid
    info = [
        [Paragraph("<b>FROM</b>", ts), Paragraph("<b>TO</b>", ts), Paragraph("<b>DETAILS</b>", ts)],
        [Paragraph(inv['seller'], ts), Paragraph(inv['buyer'], ts), Paragraph(f"Date: {inv['date']}", ts)],
        [Paragraph(inv['seller_addr'].replace('\n', '<br/>'), ts),
         Paragraph(inv['buyer_addr'].replace('\n', '<br/>'), ts),
         Paragraph(f"Due: {inv['due']}", ts)],
        [Paragraph(f"Tel: {inv['seller_phone']}", ts), Paragraph("", ts),
         Paragraph(f"Ref: {inv.get('po_number', 'N/A')}", ts)],
    ]
    it = Table(info, colWidths=[6*cm, 6*cm, 5*cm])
    it.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LINEBELOW', (0,0), (-1,0), 1, PRIMARY),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(it)
    elements.append(Spacer(1, 8*mm))

    # Items - minimal style
    elements.append(_build_items_table_minimal(inv, PRIMARY))
    elements.append(Spacer(1, 10*mm))

    # Footer: bank + notes in small text
    elements.append(HRFlowable(width="100%", thickness=0.5, color=HexColor("#DDDDDD")))
    elements.append(Spacer(1, 3*mm))
    foot = ParagraphStyle('f', parent=ts, fontSize=8, textColor=HexColor("#888888"))
    elements.append(Paragraph(f"Pay to: {inv['bank']} | {inv['iban']} | {inv['swift']}", foot))
    if inv.get('notes'):
        elements.append(Paragraph(inv['notes'], foot))

    doc.build(elements)


def layout_5_dense(inv, output_path):
    """Dense/compact layout with small fonts, everything packed tight."""
    PRIMARY = HexColor("#B71C1C")
    doc = SimpleDocTemplate(output_path, pagesize=inv["page_size"],
        topMargin=1*cm, bottomMargin=1*cm, leftMargin=1.2*cm, rightMargin=1.2*cm)
    styles = get_styles()
    ts = ParagraphStyle('ts', parent=styles['Normal'], fontSize=7.5, leading=10)
    th = ParagraphStyle('th', parent=styles['Normal'], fontSize=8, leading=10, textColor=PRIMARY)
    elements = []

    # All header info in one dense table
    header_data = [
        [Paragraph(f"<b>SELLER:</b> {inv['seller']}", ts),
         Paragraph(f"<b>INVOICE #:</b> {inv['number']}", ts)],
        [Paragraph(f"Addr: {inv['seller_addr'].replace(chr(10), ', ')}", ts),
         Paragraph(f"<b>DATE:</b> {inv['date']}", ts)],
        [Paragraph(f"Tel: {inv['seller_phone']}" + (f" | {inv['seller_email']}" if inv.get('seller_email') else ""), ts),
         Paragraph(f"<b>DUE:</b> {inv['due']}", ts)],
        [Paragraph(f"Tax ID: {inv.get('seller_tax_id', 'N/A')}", ts),
         Paragraph(f"<b>PO:</b> {inv.get('po_number', 'N/A')}", ts)],
    ]
    ht = Table(header_data, colWidths=[12*cm, 6.5*cm])
    ht.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('INNERGRID', (0,0), (-1,-1), 0.25, HexColor("#DDDDDD")),
        ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(ht)
    elements.append(Spacer(1, 2*mm))

    # Buyer in single line
    buyer_line = f"<b>BUYER:</b> {inv['buyer']} | {inv['buyer_addr'].replace(chr(10), ', ')}"
    if inv.get('buyer_tax_id'):
        buyer_line += f" | TRN: {inv['buyer_tax_id']}"
    elements.append(Paragraph(buyer_line, ts))
    elements.append(Spacer(1, 3*mm))

    # Items - compact
    elements.append(_build_items_table_compact(inv, PRIMARY))
    elements.append(Spacer(1, 3*mm))

    # Bank + notes in single dense block
    bank_line = f"<b>PAYMENT:</b> {inv['bank']} | IBAN: {inv['iban']} | SWIFT: {inv['swift']}"
    elements.append(Paragraph(bank_line, ts))
    if inv.get('notes'):
        elements.append(Paragraph(f"<b>NOTES:</b> {inv['notes']}", ts))
    elements.append(Spacer(1, 2*mm))
    elements.append(Paragraph(f"<b>TOTAL DUE: {inv['currency']} {inv['total']:,.2f}</b>",
        ParagraphStyle('tot', parent=th, fontSize=10)))

    doc.build(elements)


def layout_6_grid_header(inv, output_path):
    """All metadata in a structured grid/table at top."""
    PRIMARY = HexColor("#004D40")
    doc = SimpleDocTemplate(output_path, pagesize=inv["page_size"],
        topMargin=1.5*cm, bottomMargin=1.5*cm, leftMargin=1.5*cm, rightMargin=1.5*cm)
    styles = get_styles()
    ts = ParagraphStyle('ts', parent=styles['Normal'], fontSize=9, leading=12)
    elements = []

    elements.append(Paragraph("<b>PROFORMA INVOICE</b>",
        ParagraphStyle('ti', parent=styles['Heading1'], fontSize=18, textColor=PRIMARY, alignment=TA_CENTER)))
    elements.append(Spacer(1, 5*mm))

    # Full grid header
    grid_data = [
        ["Document No.", inv['number'], "Seller", inv['seller']],
        ["Issue Date", inv['date'], "Seller Address", inv['seller_addr'].replace('\n', ', ')],
        ["Due Date", inv['due'], "Seller Tel", inv['seller_phone']],
        ["Currency", inv['currency'], "Seller Tax ID", inv.get('seller_tax_id', '-')],
        ["PO Number", inv.get('po_number', '-'), "Seller Email", inv.get('seller_email', '-')],
        ["Buyer", inv['buyer'], "Buyer Address", inv['buyer_addr'].replace('\n', ', ')],
        ["Buyer Tax ID", inv.get('buyer_tax_id', '-'), "", ""],
    ]
    gt = Table(grid_data, colWidths=[3.2*cm, 5.3*cm, 3.2*cm, 6.3*cm])
    gt.setStyle(TableStyle([
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('FONTNAME', (2,0), (2,-1), 'Helvetica-Bold'),
        ('GRID', (0,0), (-1,-1), 0.5, HexColor("#CCCCCC")),
        ('BACKGROUND', (0,0), (0,-1), HexColor("#E0F2F1")),
        ('BACKGROUND', (2,0), (2,-1), HexColor("#E0F2F1")),
        ('TOPPADDING', (0,0), (-1,-1), 3), ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(gt)
    elements.append(Spacer(1, 6*mm))

    # Items
    elements.append(_build_items_table(inv, PRIMARY))
    elements.append(Spacer(1, 5*mm))

    # Bank in grid too
    bank_grid = [
        ["Beneficiary Bank", inv['bank']],
        ["Account Name", inv['seller']],
        ["IBAN", inv['iban']],
        ["SWIFT Code", inv['swift']],
    ]
    bt = Table(bank_grid, colWidths=[4*cm, 14*cm])
    bt.setStyle(TableStyle([
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('GRID', (0,0), (-1,-1), 0.5, HexColor("#CCCCCC")),
        ('BACKGROUND', (0,0), (0,-1), HexColor("#E0F2F1")),
        ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(bt)
    if inv.get('notes'):
        elements.append(Spacer(1, 3*mm))
        elements.append(Paragraph(f"Terms: {inv['notes']}",
            ParagraphStyle('n', parent=ts, fontSize=8, textColor=HexColor("#555555"))))

    doc.build(elements)


def layout_7_letterhead(inv, output_path):
    """Letterhead style: big supplier name at top, invoice details below."""
    PRIMARY = HexColor("#1A237E")
    doc = SimpleDocTemplate(output_path, pagesize=inv["page_size"],
        topMargin=1.5*cm, bottomMargin=1.5*cm, leftMargin=2*cm, rightMargin=2*cm)
    styles = get_styles()
    ts = ParagraphStyle('ts', parent=styles['Normal'], fontSize=9, leading=12)
    elements = []

    # Big letterhead
    elements.append(Paragraph(f"<b>{inv['seller'].upper()}</b>",
        ParagraphStyle('lh', parent=styles['Heading1'], fontSize=18, textColor=PRIMARY)))
    elements.append(Paragraph(inv['seller_addr'].replace('\n', ' | ') + f" | {inv['seller_phone']}",
        ParagraphStyle('addr', parent=ts, fontSize=8, textColor=HexColor("#444444"))))
    if inv.get('seller_email'):
        elements.append(Paragraph(inv['seller_email'],
            ParagraphStyle('em', parent=ts, fontSize=8, textColor=HexColor("#444444"))))
    elements.append(Spacer(1, 2*mm))
    elements.append(HRFlowable(width="100%", thickness=2, color=PRIMARY))
    elements.append(Spacer(1, 6*mm))

    # Invoice title + details side by side
    left = [
        Paragraph("<b>INVOICE</b>", ParagraphStyle('iv', parent=ts, fontSize=14, textColor=PRIMARY)),
        Spacer(1, 3*mm),
        Paragraph(f"<b>Ship To / Bill To:</b>", ts),
        Paragraph(inv['buyer'], ts),
        Paragraph(inv['buyer_addr'].replace('\n', '<br/>'), ts),
    ]
    if inv.get('buyer_tax_id'):
        left.append(Paragraph(f"VAT/TRN: {inv['buyer_tax_id']}", ts))

    right_data = [
        ["Inv. No:", inv['number']],
        ["Date:", inv['date']],
        ["Terms:", "Net 90"],
        ["Due Date:", inv['due']],
    ]
    if inv.get('po_number'):
        right_data.append(["P.O. #:", inv['po_number']])
    right_data.append(["Total Due:", f"{inv['currency']} {inv['total']:,.2f}"])

    rt = Table(right_data, colWidths=[2.5*cm, 5*cm])
    rt.setStyle(TableStyle([
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('ALIGN', (1,-1), (1,-1), 'RIGHT'),
        ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
        ('LINEABOVE', (0,-1), (-1,-1), 1, PRIMARY),
        ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))

    layout = Table([[left, rt]], colWidths=[10*cm, 7.5*cm])
    layout.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    elements.append(layout)
    elements.append(Spacer(1, 6*mm))

    # Items
    elements.append(_build_items_table(inv, PRIMARY))
    elements.append(Spacer(1, 6*mm))

    # Bank details at bottom
    elements.append(HRFlowable(width="100%", thickness=0.5, color=HexColor("#CCCCCC")))
    elements.append(Spacer(1, 3*mm))
    elements.append(Paragraph(f"<b>Wire Transfer Details:</b> {inv['bank']}", ts))
    elements.append(Paragraph(f"IBAN: {inv['iban']} | SWIFT: {inv['swift']} | Beneficiary: {inv['seller']}", ts))
    if inv.get('notes'):
        elements.append(Spacer(1, 3*mm))
        elements.append(Paragraph(f"Note: {inv['notes']}",
            ParagraphStyle('n', parent=ts, fontSize=8, textColor=HexColor("#666666"))))

    doc.build(elements)


def layout_8_mirrored(inv, output_path):
    """Two-column mirrored: buyer left, supplier right, items below."""
    PRIMARY = HexColor("#33691E")
    doc = SimpleDocTemplate(output_path, pagesize=inv["page_size"],
        topMargin=1.5*cm, bottomMargin=1.5*cm, leftMargin=1.5*cm, rightMargin=1.5*cm)
    styles = get_styles()
    ts = ParagraphStyle('ts', parent=styles['Normal'], fontSize=9, leading=12)
    elements = []

    # Title centered
    elements.append(Paragraph("<b>SALES INVOICE</b>",
        ParagraphStyle('ti', parent=styles['Heading1'], fontSize=20, alignment=TA_CENTER, textColor=PRIMARY)))
    elements.append(Paragraph(f"Reference: {inv['number']} | Date: {inv['date']} | Due: {inv['due']}",
        ParagraphStyle('ref', parent=ts, alignment=TA_CENTER, fontSize=9)))
    elements.append(Spacer(1, 5*mm))

    # Mirrored columns
    left_data = [
        [Paragraph("<b>BUYER DETAILS</b>", ParagraphStyle('lb', parent=ts, textColor=PRIMARY))],
        [Paragraph(inv['buyer'], ts)],
        [Paragraph(inv['buyer_addr'].replace('\n', '<br/>'), ts)],
    ]
    if inv.get('buyer_tax_id'):
        left_data.append([Paragraph(f"Tax Reg: {inv['buyer_tax_id']}", ts)])
    if inv.get('po_number'):
        left_data.append([Paragraph(f"PO: {inv['po_number']}", ts)])

    right_data = [
        [Paragraph("<b>SELLER DETAILS</b>", ParagraphStyle('rb', parent=ts, textColor=PRIMARY))],
        [Paragraph(inv['seller'], ts)],
        [Paragraph(inv['seller_addr'].replace('\n', '<br/>'), ts)],
        [Paragraph(f"Tel: {inv['seller_phone']}", ts)],
    ]
    if inv.get('seller_tax_id'):
        right_data.append([Paragraph(f"Tax ID: {inv['seller_tax_id']}", ts)])

    lt = Table(left_data, colWidths=[8.5*cm])
    lt.setStyle(TableStyle([('BOX', (0,0), (-1,-1), 0.5, PRIMARY),
        ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 4), ('BACKGROUND', (0,0), (0,0), HexColor("#F1F8E9"))]))
    rtt = Table(right_data, colWidths=[8.5*cm])
    rtt.setStyle(TableStyle([('BOX', (0,0), (-1,-1), 0.5, PRIMARY),
        ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 4), ('BACKGROUND', (0,0), (0,0), HexColor("#F1F8E9"))]))

    mirror = Table([[lt, rtt]], colWidths=[9*cm, 9*cm])
    mirror.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    elements.append(mirror)
    elements.append(Spacer(1, 6*mm))

    # Items
    elements.append(_build_items_table(inv, PRIMARY))
    elements.append(Spacer(1, 5*mm))

    # Bank in footer style
    elements.append(Paragraph("<b>Banking Information</b>",
        ParagraphStyle('bh', parent=ts, textColor=PRIMARY)))
    bank_text = f"{inv['bank']} | Account: {inv['seller']} | IBAN: {inv['iban']} | BIC/SWIFT: {inv['swift']}"
    elements.append(Paragraph(bank_text, ts))
    if inv.get('notes'):
        elements.append(Spacer(1, 3*mm))
        elements.append(Paragraph(f"<i>Terms: {inv['notes']}</i>",
            ParagraphStyle('n', parent=ts, fontSize=8, textColor=HexColor("#666666"))))

    doc.build(elements)


def layout_9_boxed_header(inv, output_path):
    """Invoice details in a prominent bordered box, rest flows below."""
    PRIMARY = HexColor("#4E342E")
    doc = SimpleDocTemplate(output_path, pagesize=inv["page_size"],
        topMargin=1.5*cm, bottomMargin=1.5*cm, leftMargin=2*cm, rightMargin=2*cm)
    styles = get_styles()
    ts = ParagraphStyle('ts', parent=styles['Normal'], fontSize=9, leading=12)
    elements = []

    # Big bordered invoice box at top
    box_data = [
        [Paragraph("<b>INVOICE</b>", ParagraphStyle('b', parent=ts, fontSize=16, textColor=PRIMARY, alignment=TA_CENTER))],
        [Paragraph(f"<b>No:</b> {inv['number']}", ParagraphStyle('c', parent=ts, alignment=TA_CENTER))],
        [Paragraph(f"<b>Date:</b> {inv['date']} &nbsp;&nbsp;&nbsp; <b>Due:</b> {inv['due']} &nbsp;&nbsp;&nbsp; <b>Currency:</b> {inv['currency']}",
            ParagraphStyle('c2', parent=ts, alignment=TA_CENTER))],
        [Paragraph(f"<b>Grand Total: {inv['currency']} {inv['total']:,.2f}</b>",
            ParagraphStyle('gt', parent=ts, fontSize=12, alignment=TA_CENTER, textColor=PRIMARY))],
    ]
    bt = Table(box_data, colWidths=[14*cm])
    bt.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 2, PRIMARY),
        ('TOPPADDING', (0,0), (-1,-1), 4), ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('BACKGROUND', (0,0), (-1,0), HexColor("#EFEBE9")),
    ]))
    elements.append(bt)
    elements.append(Spacer(1, 6*mm))

    # From / To side by side
    from_to = [
        [Paragraph("<b>From:</b>", ts), Paragraph("<b>To:</b>", ts)],
        [Paragraph(inv['seller'], ts), Paragraph(inv['buyer'], ts)],
        [Paragraph(inv['seller_addr'].replace('\n', '<br/>'), ts),
         Paragraph(inv['buyer_addr'].replace('\n', '<br/>'), ts)],
        [Paragraph(f"Ph: {inv['seller_phone']}", ts),
         Paragraph(f"Ref: {inv.get('po_number', '-')}", ts)],
    ]
    ft = Table(from_to, colWidths=[8.5*cm, 8.5*cm])
    ft.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 2)]))
    elements.append(ft)
    elements.append(Spacer(1, 5*mm))

    # Items
    elements.append(_build_items_table(inv, PRIMARY))
    elements.append(Spacer(1, 5*mm))

    # Payment footer
    elements.append(HRFlowable(width="100%", thickness=1, color=PRIMARY))
    elements.append(Spacer(1, 3*mm))
    elements.append(Paragraph(f"<b>Payment Instructions:</b>", ts))
    elements.append(Paragraph(f"Transfer to {inv['bank']}", ts))
    elements.append(Paragraph(f"IBAN: {inv['iban']}", ts))
    elements.append(Paragraph(f"SWIFT: {inv['swift']} | Beneficiary: {inv['seller']}", ts))
    if inv.get('notes'):
        elements.append(Spacer(1, 3*mm))
        elements.append(Paragraph(f"Conditions: {inv['notes']}",
            ParagraphStyle('n', parent=ts, fontSize=8, textColor=HexColor("#666666"))))

    doc.build(elements)


def layout_10_mixed(inv, output_path):
    """Non-standard: uses different field labels, bank info in middle, notes at top."""
    PRIMARY = HexColor("#263238")
    doc = SimpleDocTemplate(output_path, pagesize=inv["page_size"],
        topMargin=1.5*cm, bottomMargin=1.5*cm, leftMargin=1.5*cm, rightMargin=1.5*cm)
    styles = get_styles()
    ts = ParagraphStyle('ts', parent=styles['Normal'], fontSize=9, leading=12)
    elements = []

    # Non-standard title
    elements.append(Paragraph("<b>STATEMENT OF ACCOUNT / FACTURE</b>",
        ParagraphStyle('ti', parent=styles['Heading1'], fontSize=16, textColor=PRIMARY)))
    elements.append(Spacer(1, 2*mm))

    # Notes/terms at TOP (unusual placement)
    if inv.get('notes'):
        notes_box = Table([[Paragraph(f"<b>Special Instructions:</b> {inv['notes']}", ts)]],
            colWidths=[18*cm])
        notes_box.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), HexColor("#ECEFF1")),
            ('BOX', (0,0), (-1,-1), 0.5, PRIMARY),
            ('TOPPADDING', (0,0), (-1,-1), 4), ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 5),
        ]))
        elements.append(notes_box)
        elements.append(Spacer(1, 4*mm))

    # Non-standard field names
    meta_data = [
        ["Document Reference", inv['number']],
        ["Issued On", inv['date']],
        ["Payment Expected By", inv['due']],
        ["Billing Currency", inv['currency']],
        ["Customer Order Ref", inv.get('po_number', 'Not provided')],
    ]
    mt = Table(meta_data, colWidths=[5*cm, 13*cm])
    mt.setStyle(TableStyle([
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('LINEBELOW', (0,0), (-1,-1), 0.25, HexColor("#DDDDDD")),
        ('TOPPADDING', (0,0), (-1,-1), 3), ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(mt)
    elements.append(Spacer(1, 4*mm))

    # Vendor and Client in unusual order (client first)
    elements.append(Paragraph("<b>CLIENT (Bill To):</b>", ParagraphStyle('cl', parent=ts, textColor=PRIMARY)))
    elements.append(Paragraph(f"{inv['buyer']} | {inv['buyer_addr'].replace(chr(10), ', ')}", ts))
    if inv.get('buyer_tax_id'):
        elements.append(Paragraph(f"Tax Registration: {inv['buyer_tax_id']}", ts))
    elements.append(Spacer(1, 3*mm))

    # Bank details in MIDDLE (unusual placement)
    elements.append(Paragraph("<b>REMIT PAYMENT TO:</b>", ParagraphStyle('rp', parent=ts, textColor=PRIMARY)))
    pay_line = f"{inv['seller']} | {inv['bank']} | IBAN: {inv['iban']} | SWIFT: {inv['swift']}"
    elements.append(Paragraph(pay_line, ts))
    elements.append(Spacer(1, 3*mm))

    elements.append(Paragraph("<b>VENDOR (Sold By):</b>", ParagraphStyle('vn', parent=ts, textColor=PRIMARY)))
    elements.append(Paragraph(f"{inv['seller']}", ts))
    elements.append(Paragraph(f"{inv['seller_addr'].replace(chr(10), ', ')} | Tel: {inv['seller_phone']}", ts))
    if inv.get('seller_tax_id'):
        elements.append(Paragraph(f"Vendor Tax ID: {inv['seller_tax_id']}", ts))
    elements.append(Spacer(1, 5*mm))

    # Items with different column headers
    elements.append(Paragraph("<b>LINE ITEMS:</b>", ParagraphStyle('li', parent=ts, textColor=PRIMARY)))
    elements.append(Spacer(1, 2*mm))
    elements.append(_build_items_table_alt_headers(inv, PRIMARY))
    elements.append(Spacer(1, 5*mm))

    # Total at very bottom, large
    elements.append(HRFlowable(width="100%", thickness=2, color=PRIMARY))
    elements.append(Spacer(1, 3*mm))
    elements.append(Paragraph(f"<b>AMOUNT PAYABLE: {inv['currency']} {inv['total']:,.2f}</b>",
        ParagraphStyle('ap', parent=styles['Heading2'], fontSize=14, textColor=PRIMARY, alignment=TA_RIGHT)))

    doc.build(elements)


# ============================================================
# ITEM TABLE HELPERS - different table styles
# ============================================================

def _build_items_table(inv, primary_color):
    """Standard items table with header row, grid, totals."""
    styles = get_styles()
    tr = ParagraphStyle('tr', parent=styles['Normal'], fontSize=9, alignment=TA_RIGHT)

    data = [["#", "Description", "Qty", f"Rate ({inv['currency']})", f"Amount ({inv['currency']})"]]
    for i, (desc, qty, rate, amt) in enumerate(inv['items'], 1):
        data.append([str(i), desc, str(qty), f"{rate:,.2f}", f"{amt:,.2f}"])

    data.append(["", "", "", Paragraph("<b>Subtotal</b>", tr), f"{inv['subtotal']:,.2f}"])
    if inv['discount']:
        data.append(["", "", "", Paragraph("<b>Discount</b>", tr), f"({inv['discount']:,.2f})"])
    data.append(["", "", "", Paragraph(f"<b>Tax ({inv['tax_rate']})</b>", tr), f"{inv['tax']:,.2f}"])
    data.append(["", "", "", Paragraph(f"<b>TOTAL</b>", tr), f"{inv['total']:,.2f}"])

    t = Table(data, colWidths=[1*cm, 8*cm, 2*cm, 3.2*cm, 3.5*cm])
    num_items = len(inv['items'])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('ALIGN', (2,1), (2,-1), 'CENTER'),
        ('ALIGN', (3,1), (-1,-1), 'RIGHT'),
        ('ROWBACKGROUNDS', (0,1), (-1,num_items), [white, GRAY_BG]),
        ('GRID', (0,0), (-1,num_items), 0.5, HexColor("#DDDDDD")),
        ('LINEBELOW', (0,0), (-1,0), 1, primary_color),
        ('LINEABOVE', (3,-1), (-1,-1), 1.5, primary_color),
        ('FONTNAME', (4,-1), (4,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (4,-1), (4,-1), 11),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    return t


def _build_items_table_minimal(inv, primary_color):
    """Minimal table: no grid, just lines between rows."""
    styles = get_styles()
    tr = ParagraphStyle('tr', parent=styles['Normal'], fontSize=9, alignment=TA_RIGHT)

    data = [["Item", "Qty", "Price", "Total"]]
    for desc, qty, rate, amt in inv['items']:
        data.append([desc, str(qty), f"{rate:,.2f}", f"{amt:,.2f}"])

    data.append(["", "", "Subtotal:", f"{inv['subtotal']:,.2f}"])
    if inv['discount']:
        data.append(["", "", "Less Discount:", f"({inv['discount']:,.2f})"])
    if inv['tax'] > 0:
        data.append(["", "", f"Tax {inv['tax_rate']}:", f"{inv['tax']:,.2f}"])
    data.append(["", "", "TOTAL:", f"{inv['currency']} {inv['total']:,.2f}"])

    t = Table(data, colWidths=[9*cm, 2.5*cm, 3*cm, 3.5*cm])
    num_items = len(inv['items'])
    t.setStyle(TableStyle([
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0,0), (-1,0), primary_color),
        ('ALIGN', (1,0), (-1,-1), 'RIGHT'),
        ('LINEBELOW', (0,0), (-1,0), 1, primary_color),
        ('LINEBELOW', (0,num_items), (-1,num_items), 0.5, HexColor("#CCCCCC")),
        ('FONTNAME', (2,-1), (-1,-1), 'Helvetica-Bold'),
        ('LINEABOVE', (2,-1), (-1,-1), 1, primary_color),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    return t


def _build_items_table_compact(inv, primary_color):
    """Compact table: smaller fonts, tighter spacing."""
    styles = get_styles()
    tr = ParagraphStyle('tr', parent=styles['Normal'], fontSize=7.5, alignment=TA_RIGHT)

    data = [["SN", "ITEM DESCRIPTION", "QTY", "UNIT PRICE", "LINE TOTAL"]]
    for i, (desc, qty, rate, amt) in enumerate(inv['items'], 1):
        data.append([str(i), desc, str(qty), f"{rate:,.2f}", f"{amt:,.2f}"])

    data.append(["", "", "", "SUB-TOTAL", f"{inv['subtotal']:,.2f}"])
    if inv['discount']:
        data.append(["", "", "", "DISCOUNT", f"-{inv['discount']:,.2f}"])
    data.append(["", "", "", f"TAX @ {inv['tax_rate']}", f"{inv['tax']:,.2f}"])
    data.append(["", "", "", "NET PAYABLE", f"{inv['total']:,.2f}"])

    t = Table(data, colWidths=[0.8*cm, 9*cm, 1.8*cm, 3*cm, 3.2*cm])
    t.setStyle(TableStyle([
        ('FONTSIZE', (0,0), (-1,-1), 7.5),
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('ALIGN', (2,1), (-1,-1), 'RIGHT'),
        ('GRID', (0,0), (-1,-1), 0.25, HexColor("#CCCCCC")),
        ('FONTNAME', (3,-1), (-1,-1), 'Helvetica-Bold'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    return t


def _build_items_table_alt_headers(inv, primary_color):
    """Table with non-standard column headers to test parsing."""
    styles = get_styles()
    tr = ParagraphStyle('tr', parent=styles['Normal'], fontSize=9, alignment=TA_RIGHT)

    # Non-standard headers
    data = [["Line", "Particulars", "Units", "Unit Cost", "Extended Price"]]
    for i, (desc, qty, rate, amt) in enumerate(inv['items'], 1):
        data.append([f"L{i:02d}", desc, f"{qty} pcs", f"{rate:,.2f}", f"{amt:,.2f}"])

    data.append(["", "", "", "Gross Amount", f"{inv['subtotal']:,.2f}"])
    if inv['discount']:
        data.append(["", "", "", "Trade Discount", f"({inv['discount']:,.2f})"])
    if inv['tax'] > 0:
        data.append(["", "", "", f"Output Tax {inv['tax_rate']}", f"{inv['tax']:,.2f}"])
    data.append(["", "", "", "Net Amount Due", f"{inv['total']:,.2f}"])

    t = Table(data, colWidths=[1.2*cm, 8*cm, 2.3*cm, 3*cm, 3.5*cm])
    num_items = len(inv['items'])
    t.setStyle(TableStyle([
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('BACKGROUND', (0,0), (-1,0), HexColor("#ECEFF1")),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0,0), (-1,0), primary_color),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        ('ALIGN', (2,1), (-1,-1), 'RIGHT'),
        ('LINEBELOW', (0,0), (-1,0), 1.5, primary_color),
        ('LINEBELOW', (0,num_items), (-1,num_items), 0.5, HexColor("#AAAAAA")),
        ('ROWBACKGROUNDS', (0,1), (-1,num_items), [white, HexColor("#FAFAFA")]),
        ('FONTNAME', (3,-1), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (4,-1), (4,-1), 10),
        ('LINEABOVE', (3,-1), (-1,-1), 1.5, primary_color),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    return t


# ============================================================
# MAIN - Generate all 10 invoices with different layouts
# ============================================================

LAYOUT_FUNCTIONS = [
    layout_1_standard,
    layout_2_right_aligned,
    layout_3_centered,
    layout_4_minimal,
    layout_5_dense,
    layout_6_grid_header,
    layout_7_letterhead,
    layout_8_mirrored,
    layout_9_boxed_header,
    layout_10_mixed,
]

if __name__ == "__main__":
    print("Generating 10 test invoice PDFs with DIFFERENT LAYOUTS...")
    print(f"Output directory: {OUTPUT_DIR}\n")

    for i, (inv, layout_fn) in enumerate(zip(invoices, LAYOUT_FUNCTIONS)):
        filename = f"{inv['number'].replace('/', '_').replace(' ', '_')}.pdf"
        filepath = os.path.join(OUTPUT_DIR, filename)
        layout_fn(inv, filepath)
        print(f"  [{i+1:2d}] {inv['number']:<25} Layout: {layout_fn.__name__:<25} -> {filename}")

    print(f"\nDone! {len(invoices)} invoices generated in: {OUTPUT_DIR}")
    print("\n" + "=" * 90)
    print("VARIABILITY SUMMARY:")
    print("=" * 90)
    print(f"{'#':<3} {'Layout':<22} {'Date Format':<18} {'Currency':<6} {'Seller Industry':<20} {'Page'}")
    print("-" * 90)
    formats = [
        "DD-Mon-YYYY", "DD/MM/YYYY", "Month DD, YYYY", "DD Month YYYY",
        "YYYY-MM-DD", "D Month YYYY", "DD-Mon-YY", "DD.MM.YYYY",
        "Month DD, YYYY", "DD/MM/YYYY"
    ]
    industries = [
        "Petrochemicals", "Food & Beverage", "Medical Supplies", "Automotive",
        "Textiles", "IT Hardware", "Pharmaceuticals", "Steel/Metals",
        "Gourmet Foods", "Furniture"
    ]
    pages = ["A4","A4","A4","Letter","A4","A4","A4","A4","Letter","A4"]
    for i, (inv, fn) in enumerate(zip(invoices, LAYOUT_FUNCTIONS)):
        print(f"{i+1:<3} {fn.__name__:<22} {formats[i]:<18} {inv['currency']:<6} {industries[i]:<20} {pages[i]}")
