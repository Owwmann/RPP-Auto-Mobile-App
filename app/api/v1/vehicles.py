from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from app.database import get_db
from app.models.user import User
from app.models.vehicle import Vehicle
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.post("/")
async def create_vehicle(
    year: int,
    make: str,
    model: str,
    vin: str = None,
    trim: str = None,
    nickname: str = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    vehicle = Vehicle(
        user_id=current_user.id,
        year=year,
        make=make,
        model=model,
        vin=vin,
        trim=trim,
        nickname=nickname
    )
    db.add(vehicle)
    await db.commit()
    await db.refresh(vehicle)

    return {
        "message": "Vehicle created successfully",
        "vehicle_id": str(vehicle.id),
        "vehicle": {
            "id": str(vehicle.id),
            "year": vehicle.year,
            "make": vehicle.make,
            "model": vehicle.model,
            "nickname": vehicle.nickname
        }
    }


@router.get("/")
async def list_vehicles(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Vehicle).where(Vehicle.user_id == current_user.id, Vehicle.is_active == True)
    )
    vehicles = result.scalars().all()

    return {
        "vehicles": [
            {
                "id": str(v.id),
                "year": v.year,
                "make": v.make,
                "model": v.model,
                "trim": v.trim,
                "vin": v.vin,
                "nickname": v.nickname,
                "current_mileage": v.current_mileage,
                "is_primary": v.is_primary
            }
            for v in vehicles
        ]
    }


@router.get("/{vehicle_id}")
async def get_vehicle(
    vehicle_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Vehicle).where(
            Vehicle.id == uuid.UUID(vehicle_id),
            Vehicle.user_id == current_user.id
        )
    )
    vehicle = result.scalar_one_or_none()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    return {
        "id": str(vehicle.id),
        "year": vehicle.year,
        "make": vehicle.make,
        "model": vehicle.model,
        "trim": vehicle.trim,
        "vin": vehicle.vin,
        "engine": vehicle.engine,
        "transmission": vehicle.transmission,
        "nickname": vehicle.nickname,
        "current_mileage": vehicle.current_mileage
    }


@router.put("/{vehicle_id}")
async def update_vehicle(
    vehicle_id: str,
    nickname: str = None,
    current_mileage: int = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Vehicle).where(
            Vehicle.id == uuid.UUID(vehicle_id),
            Vehicle.user_id == current_user.id
        )
    )
    vehicle = result.scalar_one_or_none()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    if nickname:
        vehicle.nickname = nickname
    if current_mileage:
        vehicle.current_mileage = current_mileage

    await db.commit()
    await db.refresh(vehicle)

    return {"message": "Vehicle updated successfully"}


@router.delete("/{vehicle_id}")
async def delete_vehicle(
    vehicle_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Vehicle).where(
            Vehicle.id == uuid.UUID(vehicle_id),
            Vehicle.user_id == current_user.id
        )
    )
    vehicle = result.scalar_one_or_none()

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    vehicle.is_active = False
    await db.commit()

    return {"message": "Vehicle deleted successfully"}
