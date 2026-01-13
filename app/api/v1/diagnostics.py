"""
Diagnostics API Endpoints
OBD2 Scanning and AI-powered diagnosis
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from app.database import get_db
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.diagnostic import OBDScanSession, DTCCode, DiagnosticReport
from app.api.v1.auth import get_current_user
from app.services.obd_service import OBDService
from app.services.motor_daas_service import MotorDaaSService
from app.services.ai_service import AIService

router = APIRouter()


@router.post("/scan")
async def start_diagnostic_scan(
    vehicle_id: str,
    scan_type: str = "full",
    adapter_mac: str = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Start a new OBD2 diagnostic scan

    Workflow:
    1. Create scan session
    2. Read DTC codes from vehicle
    3. Fetch code descriptions from Motor DaaS
    4. Generate AI diagnosis
    5. Create diagnostic report
    """

    # Verify vehicle ownership
    result = await db.execute(
        select(Vehicle).where(
            Vehicle.id == uuid.UUID(vehicle_id),
            Vehicle.user_id == current_user.id
        )
    )
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # Initialize services
    obd_service = OBDService()
    motor_daas = MotorDaaSService()
    ai_service = AIService()

    # Step 1: Start scan session
    scan_session = await obd_service.start_scan_session(
        db=db,
        vehicle_id=vehicle_id,
        user_id=str(current_user.id),
        scan_type=scan_type,
        adapter_mac=adapter_mac
    )

    # Step 2: Read DTC codes
    dtc_codes = await obd_service.read_dtc_codes(
        db=db,
        scan_session_id=str(scan_session.id),
        vehicle_id=vehicle_id
    )

    # Step 3: Enrich with Motor DaaS data
    enriched_codes = []
    for dtc in dtc_codes:
        motor_info = await motor_daas.get_dtc_info(
            dtc_code=dtc.code,
            vehicle_year=vehicle.year,
            vehicle_make=vehicle.make,
            vehicle_model=vehicle.model
        )

        # Update DTC with enriched data
        dtc.description = motor_info.get("description")
        dtc.severity = motor_info.get("severity")
        dtc.motor_daas_data = motor_info
        dtc.estimated_repair_cost_min = motor_info.get("estimated_cost_min")
        dtc.estimated_repair_cost_max = motor_info.get("estimated_cost_max")

        enriched_codes.append({
            "code": dtc.code,
            "description": dtc.description,
            "severity": dtc.severity,
            "estimated_cost_min": dtc.estimated_repair_cost_min,
            "estimated_cost_max": dtc.estimated_repair_cost_max
        })

    await db.commit()

    # Step 4: Generate AI diagnosis
    vehicle_info = {
        "year": vehicle.year,
        "make": vehicle.make,
        "model": vehicle.model
    }

    ai_diagnosis = await ai_service.generate_diagnosis(
        dtc_codes=enriched_codes,
        vehicle_info=vehicle_info,
        mileage=vehicle.current_mileage
    )

    # Step 5: Calculate health score
    health_score = await ai_service.calculate_health_score(
        dtc_count=len(dtc_codes),
        severity_levels=[c["severity"] for c in enriched_codes if c.get("severity")],
        vehicle_age=2026 - vehicle.year,
        mileage=vehicle.current_mileage or 0
    )

    # Step 6: Create diagnostic report
    report = DiagnosticReport(
        scan_session_id=scan_session.id,
        vehicle_id=vehicle.id,
        user_id=current_user.id,
        overall_health_score=health_score,
        severity_level=ai_diagnosis.get("urgency_level"),
        ai_summary=ai_diagnosis.get("summary"),
        recommended_actions={"actions": ai_diagnosis.get("recommended_actions", [])},
        estimated_total_cost_min=ai_diagnosis["estimated_cost_range"]["min"],
        estimated_total_cost_max=ai_diagnosis["estimated_cost_range"]["max"],
        urgency_level=ai_diagnosis.get("urgency_level")
    )

    db.add(report)
    await db.commit()
    await db.refresh(report)

    # Complete scan session
    await obd_service.complete_scan_session(db, str(scan_session.id))

    return {
        "scan_session_id": str(scan_session.id),
        "report_id": str(report.id),
        "health_score": health_score,
        "dtc_count": len(dtc_codes),
        "urgency": ai_diagnosis.get("urgency_level"),
        "summary": ai_diagnosis.get("summary"),
        "estimated_cost": {
            "min": report.estimated_total_cost_min,
            "max": report.estimated_total_cost_max
        }
    }


@router.get("/reports")
async def list_diagnostic_reports(
    vehicle_id: str = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's diagnostic reports"""

    query = select(DiagnosticReport).where(DiagnosticReport.user_id == current_user.id)

    if vehicle_id:
        query = query.where(DiagnosticReport.vehicle_id == uuid.UUID(vehicle_id))

    result = await db.execute(query.order_by(DiagnosticReport.created_at.desc()))
    reports = result.scalars().all()

    return {
        "reports": [
            {
                "id": str(r.id),
                "vehicle_id": str(r.vehicle_id),
                "health_score": r.overall_health_score,
                "urgency": r.urgency_level,
                "summary": r.ai_summary,
                "created_at": r.created_at.isoformat()
            }
            for r in reports
        ]
    }


@router.get("/reports/{report_id}")
async def get_diagnostic_report(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get detailed diagnostic report"""

    result = await db.execute(
        select(DiagnosticReport).where(
            DiagnosticReport.id == uuid.UUID(report_id),
            DiagnosticReport.user_id == current_user.id
        )
    )
    report = result.scalar_one_or_none()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    # Get associated DTC codes
    dtc_result = await db.execute(
        select(DTCCode).where(DTCCode.scan_session_id == report.scan_session_id)
    )
    dtc_codes = dtc_result.scalars().all()

    return {
        "id": str(report.id),
        "vehicle_id": str(report.vehicle_id),
        "health_score": report.overall_health_score,
        "urgency": report.urgency_level,
        "summary": report.ai_summary,
        "recommended_actions": report.recommended_actions,
        "estimated_cost": {
            "min": float(report.estimated_total_cost_min) if report.estimated_total_cost_min else 0,
            "max": float(report.estimated_total_cost_max) if report.estimated_total_cost_max else 0
        },
        "dtc_codes": [
            {
                "code": dtc.code,
                "description": dtc.description,
                "severity": dtc.severity,
                "status": dtc.status
            }
            for dtc in dtc_codes
        ],
        "created_at": report.created_at.isoformat()
    }
