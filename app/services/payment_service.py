"""
Payment Service - Stripe Integration
Handles subscriptions, payments, and billing
"""
import stripe
from typing import Dict, Optional
from app.config import settings


class PaymentService:
    """
    Stripe Payment Processing

    Features:
    - Subscription management
    - One-time payments
    - Customer management
    - Webhook handling
    """

    def __init__(self):
        stripe.api_key = settings.STRIPE_SECRET_KEY
        self.publishable_key = settings.STRIPE_PUBLISHABLE_KEY

    async def create_customer(
        self,
        email: str,
        name: Optional[str] = None,
        metadata: Optional[Dict] = None
    ) -> str:
        """
        Create a Stripe customer

        Returns:
            Customer ID (cus_xxx)
        """
        try:
            customer = stripe.Customer.create(
                email=email,
                name=name,
                metadata=metadata or {}
            )
            return customer.id
        except stripe.error.StripeError as e:
            print(f"Stripe Error: {str(e)}")
            raise

    async def create_subscription(
        self,
        customer_id: str,
        price_id: str,
        trial_days: int = 0
    ) -> Dict:
        """
        Create a subscription for a customer

        Args:
            customer_id: Stripe customer ID
            price_id: Stripe price ID for the plan
            trial_days: Number of trial days (0 = no trial)

        Returns:
            Subscription object
        """
        try:
            subscription_data = {
                "customer": customer_id,
                "items": [{"price": price_id}]
            }

            if trial_days > 0:
                subscription_data["trial_period_days"] = trial_days

            subscription = stripe.Subscription.create(**subscription_data)

            return {
                "subscription_id": subscription.id,
                "status": subscription.status,
                "current_period_end": subscription.current_period_end,
                "trial_end": subscription.trial_end if hasattr(subscription, "trial_end") else None
            }
        except stripe.error.StripeError as e:
            print(f"Stripe Subscription Error: {str(e)}")
            raise

    async def cancel_subscription(self, subscription_id: str, immediate: bool = False) -> Dict:
        """
        Cancel a subscription

        Args:
            subscription_id: Stripe subscription ID
            immediate: If True, cancel immediately. If False, cancel at period end.
        """
        try:
            if immediate:
                subscription = stripe.Subscription.delete(subscription_id)
            else:
                subscription = stripe.Subscription.modify(
                    subscription_id,
                    cancel_at_period_end=True
                )

            return {
                "subscription_id": subscription.id,
                "status": subscription.status,
                "canceled": True
            }
        except stripe.error.StripeError as e:
            print(f"Stripe Cancel Error: {str(e)}")
            raise

    async def create_payment_intent(
        self,
        amount: int,
        currency: str = "usd",
        customer_id: Optional[str] = None,
        metadata: Optional[Dict] = None
    ) -> Dict:
        """
        Create a payment intent for one-time payment

        Args:
            amount: Amount in cents (e.g., 1000 = $10.00)
            currency: Currency code (default: usd)
            customer_id: Optional Stripe customer ID
            metadata: Additional metadata
        """
        try:
            intent_data = {
                "amount": amount,
                "currency": currency,
                "metadata": metadata or {}
            }

            if customer_id:
                intent_data["customer"] = customer_id

            intent = stripe.PaymentIntent.create(**intent_data)

            return {
                "payment_intent_id": intent.id,
                "client_secret": intent.client_secret,
                "status": intent.status,
                "amount": intent.amount
            }
        except stripe.error.StripeError as e:
            print(f"Stripe Payment Intent Error: {str(e)}")
            raise

    async def get_subscription_status(self, subscription_id: str) -> Dict:
        """Get current subscription status"""
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)

            return {
                "subscription_id": subscription.id,
                "status": subscription.status,
                "current_period_end": subscription.current_period_end,
                "cancel_at_period_end": subscription.cancel_at_period_end
            }
        except stripe.error.StripeError as e:
            print(f"Stripe Retrieve Error: {str(e)}")
            raise

    def construct_webhook_event(self, payload: bytes, sig_header: str):
        """
        Verify and construct webhook event from Stripe

        Used in webhook endpoint to validate incoming events
        """
        try:
            event = stripe.Webhook.construct_event(
                payload,
                sig_header,
                settings.STRIPE_WEBHOOK_SECRET
            )
            return event
        except ValueError as e:
            # Invalid payload
            raise ValueError("Invalid payload")
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            raise ValueError("Invalid signature")
