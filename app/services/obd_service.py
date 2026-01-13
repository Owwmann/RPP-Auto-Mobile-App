"""
OBD2 Service - Vehicle Diagnostics Integration
Handles OBD2 adapter communication and DTC code management
"""
from typing import List, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import asyncio
from datetime import datetime

from app.models.diagnostic import OBDScanSession, DTCCode, ScanType, DTCSeverity, DTCStatus
from app.models.vehicle import Vehicle


class OBDService:
    """
    Service for OBD2 adapter integration and diagnostic scanning

    Supports:
    - Bluetooth OBD2 adapters (ELM327-based)
    - WiFi OBD2 adapters
    - USB OBD2 adapters
    """

    def __init__(self):
        self.supported_protocols = [
            "SAE J1850 PWM",
            "SAE J1850 VPW", 
            "ISO 9141-2",
            "ISO 14230-4 KWP",
            "ISO 15765-4 CAN"
        ]

    async def start_scan_session(
        self,
        db: AsyncSession,
        vehicle_id: str,
        user_id: str,
        scan_type: ScanType = ScanType.FULL,
        adapter_type: Optional[str] = None,
        adapter_mac: Optional[str] = None
    ) -> OBDScanSession:
        """Start a new OBD2 scan session"""

        # Create scan session
        session = OBDScanSession(
            vehicle_id=vehicle_id,
            user_id=user_id,
            scan_type=scan_type,
            adapter_type=adapter_type or "ELM327_BLUETOOTH",
            adapter_mac_address=adapter_mac,
            scan_status="in_progress",
            started_at=datetime.utcnow()
        )

        db.add(session)
        await db.commit()
        await db.refresh(session)

        return session

    async def read_dtc_codes(
        self,
        db: AsyncSession,
        scan_session_id: str,
        vehicle_id: str
    ) -> List[DTCCode]:
        """
        Read DTC codes from vehicle

        In production, this would communicate with actual OBD2 adapter.
        For now, we'll simulate the process and integrate with Motor DaaS.
        """

        # Simulate reading DTC codes
        # In production, this would use PyOBD, python-OBD, or similar library
        # to communicate with the physical adapter

        # Example DTC codes that might be read
        simulated_dtcs = [
            {"code": "P0420", "status": "confirmed"},
            {"code": "P0171", "status": "pending"},
        ]

        dtc_objects = []
        for dtc_data in simulated_dtcs:
            dtc = DTCCode(
                scan_session_id=scan_session_id,
                code=dtc_data["code"],
                status=DTCStatus.ACTIVE if dtc_data["status"] == "confirmed" else DTCStatus.PENDING,
                detected_at=datetime.utcnow()
            )
            db.add(dtc)
            dtc_objects.append(dtc)

        await db.commit()

        # Update session counts
        result = await db.execute(
            select(OBDScanSession).where(OBDScanSession.id == scan_session_id)
        )
        session = result.scalar_one()
        session.total_dtc_count = len(dtc_objects)
        session.confirmed_dtc_count = len([d for d in simulated_dtcs if d["status"] == "confirmed"])
        session.pending_dtc_count = len([d for d in simulated_dtcs if d["status"] == "pending"])

        await db.commit()

        return dtc_objects

    async def complete_scan_session(
        self,
        db: AsyncSession,
        scan_session_id: str
    ) -> OBDScanSession:
        """Mark scan session as complete"""

        result = await db.execute(
            select(OBDScanSession).where(OBDScanSession.id == scan_session_id)
        )
        session = result.scalar_one()
        session.scan_status = "completed"
        session.completed_at = datetime.utcnow()

        await db.commit()
        await db.refresh(session)

        return session

    def parse_dtc_code(self, code: str) -> Dict[str, str]:
        """
        Parse DTC code to extract system and fault type

        Format: [P/C/B/U][0-3][0-9][0-9][0-9]
        P = Powertrain
        C = Chassis
        B = Body
        U = Network
        """
        if len(code) != 5:
            return {"system": "Unknown", "type": "Invalid Code"}

        system_codes = {
            "P": "Powertrain",
            "C": "Chassis", 
            "B": "Body",
            "U": "Network"
        }

        system = system_codes.get(code[0], "Unknown")

        # Determine if generic or manufacturer-specific
        if code[1] == "0":
            code_type = "Generic (SAE)"
        elif code[1] == "1":
            code_type = "Manufacturer Specific"
        elif code[1] == "2":
            code_type = "Generic (SAE)"
        else:
            code_type = "Manufacturer Specific"

        return {
            "system": system,
            "type": code_type,
            "full_code": code
        }
