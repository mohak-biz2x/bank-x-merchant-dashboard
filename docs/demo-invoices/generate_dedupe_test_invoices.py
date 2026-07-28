"""
Generate sample invoice PDFs to test the Invoice Dedupe Logic.

Test Scenarios:
1. Within-batch duplicate: Two invoices with the SAME invoice number (INV-DUP-001)
2. Cross-request duplicate: Invoice with number "12345" (known historical duplicate)
3. Clean invoice: A normal invoice that should pass without flags

Upload all 5 PDFs together in one batch to test:
- Invoices 1 & 2 share the same number → within-batch duplicate (R1)
- Invoice 3 has number "12345" → cross-request duplicate (R4/R12)
- Invoices 4 & 5 are clean → no flags
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT
import os

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dedupe-test-invoices")
os.makedirs(OUTPUT_DIR, exist_ok=True)

GREEN = HexColor("#036836")
LIGHT_GREEN = HexColor("#E8F5E9")
GRAY = HexColor("#F5F5F5")

invoices = [
    # --- WITHIN-BATCH DUPLICATE PAIR (same invoice number INV-DUP-001) ---
    {
        "filename": "01_DUPLICATE_BATCH_invoice_A.pdf",
        "invoice_number": "INV-DUP-001",
        "invoice_date": "15 May 2025",
        "due_date": "13 Aug 2025",
        "supplier_name": "Gulf Materials Trading LLC",
        "supplier_tln": "TLN-100891",
        "supplier_trn": "100345678900003",
        "supplier_address": "Warehouse 12, Jebel Ali Free Zone\nDubai, UAE",
        "supplier_phone": "+971 4 887 2200",
        "buyer_name": "Al Masraf Industries LLC",
        "buyer_address": "Office 1201, Business Bay Tower\nDubai, UAE",
        "items": [
            ("Structural Steel Beams HEB 200", "50 pcs", "1,200.00", "60,000.00"),
            ("Welding Electrodes E7018 (5kg pack)", "200 packs", "85.00", "17,000.00"),
            ("Safety Helmets (EN 397)", "100 pcs", "45.00", "4,500.00"),
        ],
        "subtotal": "81,500.00",
        "vat": "4,075.00",
        "total": "85,575.00",
        "currency": "AED",
        "bank_name": "Emirates NBD",
        "iban": "AE070331234567890123456",
        "swift": "EABORAEADXXX",
    },
    {
        "filename": "02_DUPLICATE_BATCH_invoice_B.pdf",
        "invoice_number": "INV-DUP-001",  # SAME number as above — triggers within-batch dedupe
        "invoice_date": "18 May 2025",
        "due_date": "16 Aug 2025",
        "supplier_name": "Gulf Materials Trading LLC",
        "supplier_tln": "TLN-100891",
        "supplier_trn": "100345678900003",
        "supplier_address": "Warehouse 12, Jebel Ali Free Zone\nDubai, UAE",
        "supplier_phone": "+971 4 887 2200",
        "buyer_name": "Al Masraf Industries LLC",
        "buyer_address": "Office 1201, Business Bay Tower\nDubai, UAE",
        "items": [
            ("Concrete Mixer Rental (1 month)", "2 units", "8,500.00", "17,000.00"),
            ("Rebar Tying Wire (25kg coil)", "80 coils", "120.00", "9,600.00"),
        ],
        "subtotal": "26,600.00",
        "vat": "1,330.00",
        "total": "27,930.00",
        "currency": "AED",
        "bank_name": "Emirates NBD",
        "iban": "AE070331234567890123456",
        "swift": "EABORAEADXXX",
    },
    # --- CROSS-REQUEST DUPLICATE (invoice number "12345" — known historical duplicate) ---
    {
        "filename": "03_DUPLICATE_CROSS_REQUEST_12345.pdf",
        "invoice_number": "12345",  # Triggers cross-request dedupe
        "invoice_date": "20 May 2025",
        "due_date": "18 Aug 2025",
        "supplier_name": "Tech Suppliers LLC",
        "supplier_tln": "TLN-100234",
        "supplier_trn": "100123456700001",
        "supplier_address": "Office 501, Dubai Silicon Oasis\nDubai, UAE",
        "supplier_phone": "+971 4 501 3300",
        "buyer_name": "Al Masraf Industries LLC",
        "buyer_address": "Office 1201, Business Bay Tower\nDubai, UAE",
        "items": [
            ("Network Switch 48-Port PoE+", "5 units", "4,200.00", "21,000.00"),
            ("CAT6A Ethernet Cable (305m box)", "20 boxes", "650.00", "13,000.00"),
            ("Server Rack 42U", "2 units", "3,800.00", "7,600.00"),
        ],
        "subtotal": "41,600.00",
        "vat": "2,080.00",
        "total": "43,680.00",
        "currency": "AED",
        "bank_name": "First Abu Dhabi Bank (FAB)",
        "iban": "AE410090004001234567890",
        "swift": "NBABORAEAXXX",
    },
    # --- CLEAN INVOICES (no duplicates — should pass) ---
    {
        "filename": "04_CLEAN_plumbing_supplies.pdf",
        "invoice_number": "INV-2025-PLM-044",
        "invoice_date": "22 May 2025",
        "due_date": "20 Aug 2025",
        "supplier_name": "Industrial Parts Co.",
        "supplier_tln": "TLN-100567",
        "supplier_trn": "100234567800002",
        "supplier_address": "Block C, Sharjah Industrial Area 6\nSharjah, UAE",
        "supplier_phone": "+971 6 534 1100",
        "buyer_name": "Al Masraf Industries LLC",
        "buyer_address": "Office 1201, Business Bay Tower\nDubai, UAE",
        "items": [
            ("PPR Pipes 63mm (4m length)", "300 pcs", "48.00", "14,400.00"),
            ("Ball Valves Brass 2 inch", "150 pcs", "95.00", "14,250.00"),
            ("Water Heater 80L Electric", "25 units", "1,200.00", "30,000.00"),
            ("PVC Drainage Pipes 110mm (6m)", "200 pcs", "65.00", "13,000.00"),
        ],
        "subtotal": "71,650.00",
        "vat": "3,582.50",
        "total": "75,232.50",
        "currency": "AED",
        "bank_name": "Mashreq Bank",
        "iban": "AE560330000019876543210",
        "swift": "BOMABORAEXXX",
    },
    {
        "filename": "05_CLEAN_electrical_fittings.pdf",
        "invoice_number": "INV-2025-ELC-088",
        "invoice_date": "25 May 2025",
        "due_date": "23 Aug 2025",
        "supplier_name": "Industrial Parts Co.",
        "supplier_tln": "TLN-100567",
        "supplier_trn": "100234567800002",
        "supplier_address": "Block C, Sharjah Industrial Area 6\nSharjah, UAE",
        "supplier_phone": "+971 6 534 1100",
        "buyer_name": "Al Masraf Industries LLC",
        "buyer_address": "Office 1201, Business Bay Tower\nDubai, UAE",
        "items": [
            ("MCB Circuit Breaker 32A", "200 pcs", "35.00", "7,000.00"),
            ("LED Panel Light 60x60 40W", "150 pcs", "120.00", "18,000.00"),
            ("Electrical Cable 4mm² (100m roll)", "50 rolls", "280.00", "14,000.00"),
            ("Distribution Board 12-Way", "30 pcs", "450.00", "13,500.00"),
            ("Cable Tray 300mm (3m length)", "100 pcs", "185.00", "18,500.00"),
        ],
        "subtotal": "71,000.00",
        "vat": "3,550.00",
        "total": "74,550.00",
        "currency": "AED",
        "bank_name": "Mashreq Bank",
        "iban": "AE560330000019876543210",
        "swift": "BOMABORAEXXX",
    },
]


def create_invoice_pdf(inv, output_path):
    doc = SimpleDocTemplate(
        output_path, pagesize=A4,
        topMargin=1.5*cm, bottomMargin=1.5*cm,
        leftMargin=1.5*cm, rightMargin=1.5*cm,
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle('InvTitle', parent=styles['Heading1'], fontSize=22, textColor=GREEN, spaceAfter=2*mm)
    header_style = ParagraphStyle('Header', parent=styles['Normal'], fontSize=9, textColor=black, leading=13)
    section_style = ParagraphStyle('Section', parent=styles['Heading2'], fontSize=11, textColor=GREEN, spaceBefore=4*mm, spaceAfter=2*mm)
    normal_style = ParagraphStyle('Norm', parent=styles['Normal'], fontSize=9, leading=12)
    right_style = ParagraphStyle('Right', parent=styles['Normal'], fontSize=9, alignment=TA_RIGHT)

    elements = []

    # Header
    elements.append(Paragraph("<b>TAX INVOICE</b>", title_style))
    elements.append(Spacer(1, 2*mm))

    # Invoice info + supplier info
    inv_info = [
        [Paragraph(f"<b>Invoice No:</b> {inv['invoice_number']}", header_style),
         Paragraph("<b>From:</b>", header_style)],
        [Paragraph(f"<b>Date:</b> {inv['invoice_date']}", header_style),
         Paragraph(f"{inv['supplier_name']}", header_style)],
        [Paragraph(f"<b>Due Date:</b> {inv['due_date']}", header_style),
         Paragraph(f"TL: {inv['supplier_tln']}", header_style)],
        [Paragraph(f"<b>Currency:</b> {inv['currency']}", header_style),
         Paragraph(f"TRN: {inv['supplier_trn']}", header_style)],
        [Paragraph("", header_style),
         Paragraph(f"{inv['supplier_address'].replace(chr(10), '<br/>')}", header_style)],
        [Paragraph("", header_style),
         Paragraph(f"Tel: {inv['supplier_phone']}", header_style)],
    ]

    info_table = Table(inv_info, colWidths=[9*cm, 9*cm])
    info_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 1),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 4*mm))

    # Bill To
    elements.append(Paragraph("<b>Bill To:</b>", section_style))
    elements.append(Paragraph(f"{inv['buyer_name']}", normal_style))
    elements.append(Paragraph(f"{inv['buyer_address'].replace(chr(10), ', ')}", normal_style))
    elements.append(Spacer(1, 4*mm))

    # Items table
    table_data = [["#", "Description", "Quantity", "Unit Price (AED)", "Amount (AED)"]]
    for i, (desc, qty, unit, amount) in enumerate(inv['items'], 1):
        table_data.append([str(i), desc, qty, unit, amount])

    table_data.append(["", "", "", Paragraph("<b>Subtotal</b>", right_style), inv['subtotal']])
    table_data.append(["", "", "", Paragraph("<b>VAT (5%)</b>", right_style), inv['vat']])
    table_data.append(["", "", "", Paragraph(f"<b>TOTAL ({inv['currency']})</b>", right_style), inv['total']])

    items_table = Table(table_data, colWidths=[1*cm, 8*cm, 2.5*cm, 3*cm, 3.5*cm])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), GREEN),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ALIGN', (0, 1), (0, -1), 'CENTER'),
        ('ALIGN', (2, 1), (2, -1), 'CENTER'),
        ('ALIGN', (3, 1), (-1, -1), 'RIGHT'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -4), [white, GRAY]),
        ('GRID', (0, 0), (-1, -4), 0.5, HexColor("#DDDDDD")),
        ('LINEBELOW', (0, 0), (-1, 0), 1, GREEN),
        ('LINEABOVE', (3, -3), (-1, -3), 1, HexColor("#CCCCCC")),
        ('LINEABOVE', (3, -1), (-1, -1), 1.5, GREEN),
        ('FONTNAME', (4, -1), (4, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (4, -1), (4, -1), 11),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(items_table)
    elements.append(Spacer(1, 6*mm))

    # Payment details
    elements.append(Paragraph("<b>Payment Details:</b>", section_style))
    payment_info = [
        ["Bank:", inv['bank_name']],
        ["Account Name:", inv['supplier_name']],
        ["IBAN:", inv['iban']],
        ["SWIFT:", inv['swift']],
    ]
    pay_table = Table(payment_info, colWidths=[3.5*cm, 14*cm])
    pay_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_GREEN),
        ('BOX', (0, 0), (-1, -1), 0.5, GREEN),
    ]))
    elements.append(pay_table)
    elements.append(Spacer(1, 8*mm))

    # Terms
    terms_style = ParagraphStyle('Terms', parent=styles['Normal'], fontSize=8, textColor=HexColor("#666666"))
    elements.append(Paragraph("<b>Terms & Conditions:</b>", terms_style))
    elements.append(Paragraph("1. Payment is due within 90 days of invoice date.", terms_style))
    elements.append(Paragraph("2. Late payments are subject to 2% monthly interest.", terms_style))
    elements.append(Paragraph("3. All disputes must be raised within 7 days of receipt.", terms_style))

    doc.build(elements)
    print(f"  ✓ Created: {os.path.basename(output_path)}")


if __name__ == "__main__":
    print("=" * 60)
    print("  INVOICE DEDUPE TEST — Generating 5 Test Invoices")
    print("=" * 60)
    print()
    print("Test Scenarios:")
    print("  1 & 2: Same invoice number (INV-DUP-001) → Within-batch duplicate")
    print("  3:     Invoice number '12345' → Cross-request duplicate")
    print("  4 & 5: Unique numbers → Clean (no flags)")
    print()

    for inv in invoices:
        filepath = os.path.join(OUTPUT_DIR, inv['filename'])
        create_invoice_pdf(inv, filepath)

    print()
    print(f"Done! {len(invoices)} invoices generated in:")
    print(f"  {OUTPUT_DIR}")
    print()
    print("Testing Instructions:")
    print("  1. Go to Payable or Receivable invoice module")
    print("  2. Click '+ Add Invoice'")
    print("  3. Configure payment type and tenure")
    print("  4. Upload ALL 5 PDFs together")
    print("  5. After parsing, in the Review section you should see:")
    print("     - Invoices 1 & 2: Red border, '— Duplicate' label")
    print("       Reason: 'Duplicate invoice number within this request'")
    print("     - Invoice 3: Red border, '— Duplicate' label")
    print("       Reason: 'Invoice number already exists in prior submissions'")
    print("     - Invoices 4 & 5: Green checkmark, no flags")
    print("  6. Try clicking 'Submit Invoices' → should show error toast")
    print("     'Cannot submit: Duplicate invoices detected...'")
    print("  7. Remove duplicates or change their invoice numbers → submit should work")
