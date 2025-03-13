import fitz
import pytesseract
from pdf2image import convert_from_path


def extract_text_from_pdf_fitz(pdf_path):
    text = ""
    doc = fitz.open(pdf_path)
    for page in doc:
        text += page.get_text("text") + "\n"
    return text.strip()


def extract_text_with_ocr(pdf_path):
    images = convert_from_path(pdf_path)  # Convert PDF pages to images
    text = ""
    for img in images:
        text += pytesseract.image_to_string(img) + "\n"
    return text.strip()


def extract_text(pdf_path):
    result = extract_text_from_pdf_fitz(pdf_path)
    if len(result) < 1000:
        result = extract_text_with_ocr(pdf_path)
    return result
