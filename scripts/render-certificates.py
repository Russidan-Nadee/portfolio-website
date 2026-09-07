"""Render page-one previews for the initial certificate import.

Install PyMuPDF in an isolated environment, then run this script before
scripts/import-certificates.ts. Source PDFs are never modified.
"""

from pathlib import Path
import os

import pymupdf


SOURCE_DIRECTORY = Path(
    os.environ.get("CERTIFICATE_SOURCE_DIR", Path.home() / "Downloads")
)
OUTPUT_DIRECTORY = Path("tmp/pdfs")
CERTIFICATES = [
    ("growth-mindset", "certificates_futureskill_growth-mindset.pdf"),
    ("money-planning", "certificates_set_เงินทองต้องวางแผน.pdf"),
    (
        "python-fundamentals",
        "certificates_พระนครเหนือ-มจพ_การเขียนภาษาไพธอน-ระดับเบื้องต้น.pdf",
    ),
    (
        "industrial-robot-digital-twin",
        "certificates_พระนครเหนือ-มจพ_การเขียนโปรแกรมควบคุมแขนกลอุตสาหกรรมด้วยเทคโนโลยีคู่เสมือนดิจิทัลทางไกล-แขนกลระดับสูง.pdf",
    ),
]


def main() -> None:
    sources = [(slug, SOURCE_DIRECTORY / filename) for slug, filename in CERTIFICATES]
    missing = [str(path) for _, path in sources if not path.is_file()]
    if missing:
        raise FileNotFoundError(f"Missing certificate PDFs: {missing}")

    OUTPUT_DIRECTORY.mkdir(parents=True, exist_ok=True)
    for slug, source in sources:
        with pymupdf.open(source) as document:
            page = document[0]
            print(f"\n===== {slug} =====")
            print(page.get_text("text").strip())
            pixmap = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), alpha=False)
            output = OUTPUT_DIRECTORY / f"{slug}.png"
            pixmap.save(output)
            print(f"Rendered {output} ({pixmap.width}x{pixmap.height})")


if __name__ == "__main__":
    main()
