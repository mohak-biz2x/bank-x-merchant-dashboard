"""Generate sample invoice PDFs for the May 21st demo."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
import os

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

# Biz2X green
GREEN = HexColor("#036836")
LIGHT_GREEN = HexColor("#E8F5E9")
GRAY = HexColor("#F5F5F5")

invoices = [
    {
        "invoice_number": "ANB-INV-2025-001",
        "invoice_date": "05 May 2025",
        "due_date": "03 Aug 2025",
        "supplier_name": "Al Noor Building Materials Trading LLC",
        "supplier_tln": "TL-789012",
        "supplier_address": "Plot 45, Mussafah Industrial Area\nAbu Dhabi, UAE",
        "supplier_phone": "+971 2 443 8800",
        "buyer_name": "Al Masraf Industries LLC",
        "buyer_address": "Office 1201, Business Bay Tower\nDubai, UAE",
        "items": [
            ("Portland Cement (50kg bags) - Grade 42.5", "500 bags", "45.00", "22,500.00"),
            ("Steel Reinforcement Bars 12mm", "2,000 kg", "38.50", "77,000.00"),
            ("Concrete Blocks 400x200x200mm", "3,000 pcs", "12.00", "36,000.00"),
            ("Waterproofing Membrane Roll", "150 rolls", "185.00", "27,750.00"),
            ("Sand (Fine Grade) per ton", "80 tons", "95.00", "7,600.00"),
        ],
        "subtotal": "170,850.00",
        "vat": "8,542.50",
        "total": "179,392.50",
        "currency": "AED",
        "bank_name": "Abu Dhabi Commercial Bank (ADCB)",
        "iban": "AE290260001015432187690",
        "swift": "ADCBAEAAXXX",
    },
    {
        "invoice_number": "ANB-INV-2025-002",
        "invoice_date": "12 May 2025",
        "due_date": "10 Aug 2025",
        "supplier_name": "Al Noor Building Materials Trading LLC",
        "supplier_tln": "TL-789012",
        "supplier_address": "Plot 45, Mussafah Industrial Area\nAbu Dhabi, UAE",
        "supplier_phone": "+971 2 443 8800",
        "buyer_name": "Al Masraf Industries LLC",
        "buyer_address": "Office 1201, Business Bay Tower\nDubai, UAE",
        "items": [
            ("Aluminum Composite Panels 4mm", "200 sheets", "320.00", "64,000.00"),
            ("Electrical Conduit PVC 25mm (3m)", "1,500 pcs", "18.00", "27,000.00"),
            ("Ceramic Floor Tiles 600x600mm", "800 sqm", "55.00", "44,000.00"),
            ("Plumbing Pipes PPR 20mm", "600 pcs", "28.00", "16,800.00"),
        ],
        "subtotal": "151,800.00",
        "vat": "7,590.00",
        "total": "159,390.00",
        "currency": "AED",
        "bank_name": "Abu Dhabi Commercial Bank (ADCB)",
        "iban": "AE290260001015432187690",
        "swift": "ADCBAEAAXXX",
    },
    {
        "invoice_number": "ANB-INV-2025-003",
        "invoice_date": "15 May 2025",
        "due_date": "13 Aug 2025",
        "supplier_name": "Al Noor Building Materials Trading LLC",
        "supplier_tln": "TL-789012",
        "supplier_address": "Plot 45, Mussafah Industrial Area\nAbu Dhabi, UAE",
        "supplier_phone": "+971 2 443 8800",
        "buyer_name": "Al Masraf Industries LLC",
        "buyer_address": "Office 1201, Business Bay Tower\nDubai, UAE",
        "items": [
            ("Ready Mix Concrete Grade C40", "50 cubic m", "450.00", "22,500.00"),
            ("Scaffolding Pipes 48mm (6m)", "300 pcs", "85.00", "25,500.00"),
            ("Safety Netting (per roll 50m)", "40 rolls", "220.00", "8,800.00"),
            ("Gypsum Board 12.5mm (1200x2400)", "500 sheets", "42.00", "21,000.00"),
            ("Paint - Exterior Weather Shield 20L", "100 drums", "380.00", "38,000.00"),
            ("Glass Panels 10mm Tempered", "80 sqm", "290.00", "23,200.00"),
        ],
        "subtotal": "139,000.00",
        "vat": "6,950.00",
        "total": "145,950.00",
        "currency": "AED",
        "bank_name": "Abu Dhabi Commercial Bank (ADCB)",
        "iban": "AE290260001015432187690",
        "swift": "ADCBAEAAXXX",
    },
]


def create_invoice_pdf(inv, output_path):
    doc = SimpleDocTemplate(output_path, pagesize=A4, topMargin=1.5*cm, bottomMargin=1.5*cm, leftMargin=1.5*cm, rightMargin=1.5*cm)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle('InvTitle', parent=styles['Heading1'], fontSize=22, textColor=GREEN, spaceAfter=2*mm)
    header_style = ParagraphStyle('Header', parent=styles['Normal'], fontSize=9, textColor=black, leading=13)
    section_style = ParagraphStyle('Section', parent=styles['Heading2'], fontSize=11, textColor=GREEN, spaceBefore=4*mm, spaceAfter=2*mm)
    normal_style = ParagraphStyle('Norm', parent=styles['Normal'], fontSize=9, leading=12)
    right_style = ParagraphStyle('Right', parent=styles['Normal'], fontSize=9, alignment=TA_RIGHT)
    bold_style = ParagraphStyle('Bold', parent=styles['Normal'], fontSize=9, leading=12)
    
    elements = []
    
    # Header
    elements.append(Paragraph(f"<b>TAX INVOICE</b>", title_style))
    elements.append(Spacer(1, 2*mm))
    
    # Invoice info + supplier info side by side
    inv_info = [
        [Paragraph(f"<b>Invoice No:</b> {inv['invoice_number']}", header_style),
         Paragraph(f"<b>From:</b>", header_style)],
        [Paragraph(f"<b>Date:</b> {inv['invoice_date']}", header_style),
         Paragraph(f"{inv['supplier_name']}", header_style)],
        [Paragraph(f"<b>Due Date:</b> {inv['due_date']}", header_style),
         Paragraph(f"TL: {inv['supplier_tln']}", header_style)],
        [Paragraph(f"<b>Currency:</b> {inv['currency']}", header_style),
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
    
    # Totals
    table_data.append(["", "", "", Paragraph("<b>Subtotal</b>", right_style), inv['subtotal']])
    table_data.append(["", "", "", Paragraph("<b>VAT (5%)</b>", right_style), inv['vat']])
    table_data.append(["", "", "", Paragraph(f"<b>TOTAL ({inv['currency']})</b>", right_style), inv['total']])
    
    items_table = Table(table_data, colWidths=[1*cm, 8*cm, 2.5*cm, 3*cm, 3.5*cm])
    items_table.setStyle(TableStyle([
        # Header row
        ('BACKGROUND', (0, 0), (-1, 0), GREEN),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        # Body
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ALIGN', (0, 1), (0, -1), 'CENTER'),
        ('ALIGN', (2, 1), (2, -1), 'CENTER'),
        ('ALIGN', (3, 1), (-1, -1), 'RIGHT'),
        # Alternating rows
        ('ROWBACKGROUNDS', (0, 1), (-1, -4), [white, GRAY]),
        # Grid
        ('GRID', (0, 0), (-1, -4), 0.5, HexColor("#DDDDDD")),
        ('LINEBELOW', (0, 0), (-1, 0), 1, GREEN),
        # Totals section
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
    elements.append(Paragraph("<b>Terms & Conditions:</b>", ParagraphStyle('Terms', parent=styles['Normal'], fontSize=8, textColor=HexColor("#666666"))))
    elements.append(Paragraph("1. Payment is due within 90 days of invoice date.", ParagraphStyle('T', parent=styles['Normal'], fontSize=8, textColor=HexColor("#666666"))))
    elements.append(Paragraph("2. Late payments are subject to 2% monthly interest.", ParagraphStyle('T', parent=styles['Normal'], fontSize=8, textColor=HexColor("#666666"))))
    elements.append(Paragraph("3. All disputes must be raised within 7 days of receipt.", ParagraphStyle('T', parent=styles['Normal'], fontSize=8, textColor=HexColor("#666666"))))
    
    doc.build(elements)
    print(f"  Created: {output_path}")


if __name__ == "__main__":
    print("Generating invoice PDFs...")
    for inv in invoices:
        filename = f"{inv['invoice_number'].replace('-', '_')}.pdf"
        filepath = os.path.join(OUTPUT_DIR, filename)
        create_invoice_pdf(inv, filepath)
    print(f"\nDone! {len(invoices)} invoices generated in: {OUTPUT_DIR}")
