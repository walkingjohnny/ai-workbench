"""
Validate DOCX document XML files against XSD schemas.

Usage:
    python validate.py <path> [--auto-repair]

The first argument can be either:
- An unpacked directory containing the document XML files
- A packed .docx file which will be unpacked to a temp directory

Auto-repair fixes:
- paraId/durableId values that exceed OOXML limits
- Missing xml:space="preserve" on w:t elements with whitespace
"""

import argparse
import sys
import tempfile
import zipfile
from pathlib import Path

from validators import DOCXSchemaValidator


def main():
    parser = argparse.ArgumentParser(description="Validate DOCX document XML files")
    parser.add_argument(
        "path",
        help="Path to unpacked directory or .docx file",
    )
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="Enable verbose output",
    )
    parser.add_argument(
        "--auto-repair",
        action="store_true",
        help="Automatically repair common issues (hex IDs, whitespace preservation)",
    )
    args = parser.parse_args()

    path = Path(args.path)
    assert path.exists(), f"Error: {path} does not exist"

    if path.is_file() and path.suffix.lower() == ".docx":
        temp_dir = tempfile.mkdtemp()
        with zipfile.ZipFile(path, "r") as zf:
            zf.extractall(temp_dir)
        unpacked_dir = Path(temp_dir)
    else:
        assert path.is_dir(), f"Error: {path} is not a directory or .docx file"
        unpacked_dir = path

    validators = [
        DOCXSchemaValidator(unpacked_dir, verbose=args.verbose),
    ]

    if args.auto_repair:
        total_repairs = sum(v.repair() for v in validators)
        if total_repairs:
            print(f"Auto-repaired {total_repairs} issue(s)")

    success = all(v.validate() for v in validators)

    if success:
        print("All validations PASSED!")

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
