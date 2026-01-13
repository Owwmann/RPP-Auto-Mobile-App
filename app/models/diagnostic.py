"""
Diagnostic Models: OBD Scans, DTC Codes, Reports
"""
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum as SQLEnum, DECIMAL, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum

from app.database import Base


class ScanType(str, enum.Enum):
    QUICK = "quick"
    FULL = "full"
    CONTINUOUS = "continuous"


class DTCSeverity(str, enum.Enum):
    CRITICAL = "critical"
    WARNING = "warning"
    MODERATE = "moderate"
    INFO = "info"


class DTCStatus(str, enum.Enum):
    ACTIVE = "active"
    PENDING = "pending"
    CLEARED = "cleared"
    RESOLVED = "resolved"


class UrgencyLevel(str, enum.Enum):
    IMMEDIATE = "immediate"
    SOON = "soon"
    ROUTINE = "routine"
    MONITOR = "monitor"


class OBDScanSession(Base):
    __tablename__ = "obd_scan_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scan_type = Column(SQLEnum(ScanType), nullable=False)
    adapter_type = Column(String(100))
    adapter_mac_address = Column(String(50))
    scan_status = Column(String(50), default="pending")
    total_dtc_count = Column(Integer, default=0)
    confirmed_dtc_count = Column(Integer, default=0)
    pending_dtc_count = Column(Integer, default=0)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    vehicle = relationship("Vehicle", back_populates="obd_scans")
    dtc_codes = relationship("DTCCode", back_populates="scan_session", cascade="all, delete-orphan")
    diagnostic_report = relationship("DiagnosticReport", back_populates="scan_session", uselist=False)

    def __repr__(self):
        return f"<OBDScanSession(id={self.id}, vehicle_id={self.vehicle_id})>"


class DTCCode(Base):
    __tablename__ = "dtc_codes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_session_id = Column(UUID(as_uuid=True), ForeignKey("obd_scan_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    code = Column(String(10), nullable=False)
    description = Column(Text)
    severity = Column(SQLEnum(DTCSeverity))
    status = Column(SQLEnum(DTCStatus), default=DTCStatus.ACTIVE)
    freeze_frame_data = Column(JSONB)
    motor_daas_data = Column(JSONB)
    ai_diagnosis = Column(Text)
    estimated_repair_cost_min = Column(DECIMAL(10, 2))
    estimated_repair_cost_max = Column(DECIMAL(10, 2))
    detected_at = Column(DateTime(timezone=True), server_default=func.now())
    cleared_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    scan_session = relationship("OBDScanSession", back_populates="dtc_codes")

    def __repr__(self):
        return f"<DTCCode(code={self.code}, severity={self.severity})>"


class DiagnosticReport(Base):
    __tablename__ = "diagnostic_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_session_id = Column(UUID(as_uuid=True), ForeignKey("obd_scan_sessions.id", ondelete="CASCADE"), nullable=False)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    report_type = Column(String(50), default="standard")
    overall_health_score = Column(Integer)
    severity_level = Column(String(50))
    ai_summary = Column(Text)
    recommended_actions = Column(JSONB)
    estimated_total_cost_min = Column(DECIMAL(10, 2))
    estimated_total_cost_max = Column(DECIMAL(10, 2))
    urgency_level = Column(SQLEnum(UrgencyLevel))
    pdf_url = Column(Text)
    pdf_generated_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint('overall_health_score >= 0 AND overall_health_score <= 100', name='check_health_score'),
    )

    # Relationships
    scan_session = relationship("OBDScanSession", back_populates="diagnostic_report")
    vehicle = relationship("Vehicle", back_populates="diagnostic_reports")
    user = relationship("User", back_populates="diagnostic_reports")

    def __repr__(self):
        return f"<DiagnosticReport(id={self.id}, health_score={self.overall_health_score})>"
