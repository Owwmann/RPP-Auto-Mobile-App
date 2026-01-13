from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.get("/me")
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "subscription_tier": current_user.subscription_tier,
        "is_active": current_user.is_active
    }


@router.put("/me")
async def update_current_user(
    full_name: str = None,
    phone: str = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if full_name:
        current_user.full_name = full_name
    if phone:
        current_user.phone = phone

    await db.commit()
    await db.refresh(current_user)

    return {"message": "User updated successfully"}
