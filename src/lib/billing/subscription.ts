/**
 * Subscription Management
 * إدارة الاشتراكات
 * 
 * TODO: Replace with Stripe integration
 * - Use Stripe Customer Portal for management
 * - Webhooks for subscription updates
 */

import type { UserPlan } from '../tools/types';

const SUBSCRIPTION_KEY = 'mahni_subscription';

// ============================================
// Subscription Interface
// ============================================

export interface Subscription {
  id: string;
  userId: string;
  plan: UserPlan;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: number;
  updatedAt: number;
}

// ============================================
// Mock Subscription Store (localStorage)
// ============================================

export function getSubscription(): Subscription | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(SUBSCRIPTION_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading subscription:', error);
  }

  // Return default free subscription
  return createDefaultSubscription();
}

function createDefaultSubscription(): Subscription {
  const now = Date.now();
  return {
    id: 'sub_free_default',
    userId: 'user_default',
    plan: 'free',
    status: 'active',
    currentPeriodStart: now,
    currentPeriodEnd: now + 365 * 24 * 60 * 60 * 1000, // 1 year
    cancelAtPeriodEnd: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function saveSubscription(subscription: Subscription): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
  } catch (error) {
    console.error('Error saving subscription:', error);
  }
}

// ============================================
// Get Current Plan
// ============================================

export function getCurrentPlan(): UserPlan {
  const subscription = getSubscription();
  return subscription?.plan || 'free';
}

// ============================================
// Update Plan (for testing/admin)
// ============================================

export function updatePlan(newPlan: UserPlan): Subscription {
  const subscription = getSubscription() || createDefaultSubscription();
  
  const updated: Subscription = {
    ...subscription,
    plan: newPlan,
    updatedAt: Date.now(),
  };

  saveSubscription(updated);
  console.log('[Billing] Plan updated to:', newPlan);
  return updated;
}

// ============================================
// Check Subscription Status
// ============================================

export function isSubscriptionActive(): boolean {
  const subscription = getSubscription();
  if (!subscription) return true; // Free plan is always active

  return ['active', 'trialing'].includes(subscription.status);
}

export function isSubscriptionExpiringSoon(days: number = 7): boolean {
  const subscription = getSubscription();
  if (!subscription || subscription.plan === 'free') return false;

  const daysInMs = days * 24 * 60 * 60 * 1000;
  return subscription.currentPeriodEnd - Date.now() < daysInMs;
}

export function getDaysUntilRenewal(): number {
  const subscription = getSubscription();
  if (!subscription || subscription.plan === 'free') return -1;

  const msUntilRenewal = subscription.currentPeriodEnd - Date.now();
  return Math.ceil(msUntilRenewal / (24 * 60 * 60 * 1000));
}

// ============================================
// Stripe Integration Placeholders
// ============================================

export interface CheckoutSessionRequest {
  plan: UserPlan;
  billing: 'monthly' | 'yearly';
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

/**
 * TODO: Implement with Stripe
 * Creates a checkout session for subscription
 */
export async function createCheckoutSession(
  request: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  // TODO: Call your backend API which creates Stripe checkout session
  // const response = await fetch('/api/create-checkout-session', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(request),
  // });
  // return response.json();

  console.log('[Billing] Creating checkout session for:', request.plan);
  
  // Mock response for now
  return {
    sessionId: 'mock_session_' + Date.now(),
    url: '/account?checkout=success',
  };
}

/**
 * TODO: Implement with Stripe
 * Creates a customer portal session
 */
export async function createCustomerPortalSession(_returnUrl: string): Promise<{ url: string }> {
  // TODO: Call your backend API
  // const response = await fetch('/api/create-portal-session', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ returnUrl }),
  // });
  // return response.json();

  console.log('[Billing] Creating customer portal session');
  
  return {
    url: '/account',
  };
}

/**
 * TODO: Implement with Stripe
 * Cancels subscription at period end
 */
export async function cancelSubscription(): Promise<boolean> {
  // TODO: Call your backend API
  // const response = await fetch('/api/cancel-subscription', {
  //   method: 'POST',
  // });
  // return response.ok;

  const subscription = getSubscription();
  if (subscription) {
    subscription.cancelAtPeriodEnd = true;
    subscription.updatedAt = Date.now();
    saveSubscription(subscription);
  }

  console.log('[Billing] Subscription cancelled');
  return true;
}

/**
 * TODO: Implement with Stripe
 * Reactivates a cancelled subscription
 */
export async function reactivateSubscription(): Promise<boolean> {
  // TODO: Call your backend API

  const subscription = getSubscription();
  if (subscription) {
    subscription.cancelAtPeriodEnd = false;
    subscription.updatedAt = Date.now();
    saveSubscription(subscription);
  }

  console.log('[Billing] Subscription reactivated');
  return true;
}

// ============================================
// Webhook Handler Placeholder
// ============================================

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: {
      id: string;
      customer: string;
      status: string;
      // ... other Stripe fields
    };
  };
}

/**
 * TODO: Implement webhook handler on your backend
 * This should be called by Stripe webhooks
 */
export function handleStripeWebhook(event: StripeWebhookEvent): void {
  console.log('[Billing] Webhook received:', event.type);

  switch (event.type) {
    case 'customer.subscription.created':
      // Handle new subscription
      break;
    case 'customer.subscription.updated':
      // Handle subscription update
      break;
    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      break;
    case 'invoice.payment_succeeded':
      // Handle successful payment
      break;
    case 'invoice.payment_failed':
      // Handle failed payment
      break;
    default:
      console.log('[Billing] Unhandled webhook event:', event.type);
  }
}

// ============================================
// Pricing Display
// ============================================

export function formatPrice(price: number, currency: string = 'SAR'): string {
  if (price === 0) return 'مجاني';
  
  const formatter = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  });

  return formatter.format(price);
}

export function calculateYearlySavings(monthlyPrice: number, yearlyPrice: number): {
  amount: number;
  percentage: number;
} {
  const yearlyFromMonthly = monthlyPrice * 12;
  const savings = yearlyFromMonthly - (yearlyPrice * 12);
  const percentage = (savings / yearlyFromMonthly) * 100;

  return {
    amount: savings,
    percentage: Math.round(percentage),
  };
}
