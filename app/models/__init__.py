"""
SQLAlchemy Models
"""
from app.models.user import User, UserPreference
from app.models.vehicle import Vehicle
from app.models.diagnostic import OBDScanSession, DTCCode, DiagnosticReport

__all__ = [
    "User",
    "UserPreference",
    "Vehicle",
    "OBDScanSession",
    "DTCCode",
    "DiagnosticReport",
]
