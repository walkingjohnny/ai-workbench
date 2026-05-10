"""
Validation modules for Word document processing.
"""

from .base import BaseSchemaValidator
from .docx import DOCXSchemaValidator

__all__ = [
    "BaseSchemaValidator",
    "DOCXSchemaValidator",
]
