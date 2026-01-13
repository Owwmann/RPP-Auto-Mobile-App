"""
Payments & Subscriptions API
Stripe integration for billing
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta

from app.database import get_db
from app.models.user import User
from app.api.v1.auth import get_current_user
from app.services.payment_service import PaymentService

router = APIRouter()


@router.post("/subscribe")
async def create_subscription(
    price_id: str,
    trial_days: int = 7,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Subscribe user to a plan

    Plans:
    - Basic: $9.99/month
    - Pro: $19.99/month
    - Premium: $29.99/month
    """

    payment_service = PaymentService()

    # Create Stripe customer if not exists
    if not current_user.stripe_customer_id:
        customer_id = await payment_service.create_customer(
            email=current_user.email,
            name=current_user.full_name,
            metadata={"user_id": str(current_user.id)}
        )
        current_user.stripe_customer_id = customer_id
        await db.commit()

    # Create subscription
    subscription = await payment_service.create_subscription(
        customer_id=current_user.stripe_customer_id,
        price_id=price_id,
        trial_days=trial_days
    )

    # Update user subscription status
    current_user.subscription_status = subscription["status"]
    if subscription.get("current_period_end"):
        current_user.subscription_end_date = datetime.fromtimestamp(
            subscription["current_period_end"]
        )

    await db.commit()

    return {
        "subscription_id": subscription["subscription_id"],
        "status": subscription["status"],
        "trial_end": subscription.get("trial_end"),
        "message": "Subscription created successfully"
    }


@router.delete("/subscription")
async def cancel_subscription(
    immediate: bool = False,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cancel user subscription"""

    if not current_user.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No active subscription")

    payment_service = PaymentService()

    # Get user's subscription ID (would be stored in a subscriptions table in production)
    # For now, simplified version

    result = await payment_service.cancel_subscription(
        subscription_id="sub_xxx",  # Would fetch from DB
        immediate=immediate
    )

    if immediate:
        current_user.subscription_status = "cancelled"
    else:
        current_user.subscription_status = "cancelling"

    await db.commit()

    return {
        "message": "Subscription cancelled",
        "immediate": immediate
    }


@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Handle Stripe webhook events

    Events:
    - customer.subscription.updated
    - customer.subscription.deleted
    - invoice.payment_succeeded
    - invoice.payment_failed
    """

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    payment_service = PaymentService()

    try:
        event = payment_service.construct_webhook_event(payload, sig_header)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")

    # Handle different event types
    if event["type"] == "customer.subscription.updated":
        # Update user subscription status
        pass
    elif event["type"] == "customer.subscription.deleted":
        # Mark subscription as cancelled
        pass
    elif event["type"] == "invoice.payment_failed":
        # Handle failed payment
        pass

    return {"received": True}
