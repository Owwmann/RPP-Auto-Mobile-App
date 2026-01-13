// Subscription management with Free, Pro, Business, Enterprise tiers
export interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  features: string[];
}

class SubscriptionService {
  private static instance: SubscriptionService;
  
  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }
}

export default SubscriptionService;