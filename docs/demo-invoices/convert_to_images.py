"""Convert 5 random invoice PDFs (layouts 2, 4, 6, 8, 10) to PNG images."""
import fitz  # PyMuPDF
import os

INPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test-invoices")
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test-invoices-images")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Pick layouts 2, 4, 6, 8, 10 (indices 1, 3, 5, 7, 9 from the generated set)
TARGET_PDFS = [
    "BFF-24-00892.pdf",           # Layout 2: Right-aligned box
    "KAP-W-10032025-007.pdf",    # Layout 4: Minimal/modern
    "QITS-2025-INV-0078.pdf",    # Layout 6: Grid header
    "ADSM-2025-05-0019.pdf",     # Layout 8: Mirrored columns
    "SFM_2025_INV_00312.pdf",    # Layout 10: Mixed/non-standard
]

print("Converting 5 invoice PDFs to PNG images...")
print(f"Input:  {INPUT_DIR}")
print(f"Output: {OUTPUT_DIR}\n")

for pdf_name in TARGET_PDFS:
    pdf_path = os.path.join(INPUT_DIR, pdf_name)
    if not os.path.exists(pdf_path):
        print(f"  SKIP (not found): {pdf_name}")
        continue

    doc = fitz.open(pdf_path)
    page = doc[0]
    # Render at 2x resolution for clarity
    mat = fitz.Matrix(2, 2)
    pix = page.get_pixmap(matrix=mat)

    img_name = os.path.splitext(pdf_name)[0] + ".png"
    img_path = os.path.join(OUTPUT_DIR, img_name)
    pix.save(img_path)
    doc.close()
    print(f"  Created: {img_name} ({pix.width}x{pix.height}px)")

print(f"\nDone! Images saved to: {OUTPUT_DIR}")
