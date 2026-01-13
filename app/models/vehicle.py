"""
Vehicle Model
"""
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    vin = Column(String(17), unique=True, index=True)
    year = Column(Integer, nullable=False)
    make = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    trim = Column(String(100))
    engine = Column(String(255))
    transmission = Column(String(100))
    fuel_type = Column(String(50))
    color = Column(String(50))
    license_plate = Column(String(20))
    current_mileage = Column(Integer)
    purchase_date = Column(Date)
    nickname = Column(String(100))
    avatar_url = Column(String)
    is_primary = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="vehicles")
    obd_scans = relationship("OBDScanSession", back_populates="vehicle", cascade="all, delete-orphan")
    diagnostic_reports = relationship("DiagnosticReport", back_populates="vehicle")

    def __repr__(self):
        return f"<Vehicle(id={self.id}, {self.year} {self.make} {self.model})>"
