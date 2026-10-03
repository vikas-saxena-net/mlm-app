import type { RazorpayOrderResponse, VerifyRazorpayPaymentRequest } from "../types/registration.types";

const CHECKOUT_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

interface RazorpayFailureEvent {
  error?: { description?: string; reason?: string };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", handler: (response: RazorpayFailureEvent) => void) => void;
}

interface RazorpayConstructorOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name?: string; email?: string; contact?: string };
  theme: { color: string };
  handler: (response: VerifyRazorpayPaymentRequest) => void;
  modal: { ondismiss: () => void };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayConstructorOptions) => RazorpayInstance;
  }
}

/** Why Razorpay Checkout ended without a successful payment. */
export interface RazorpayCheckoutError {
  /** True when the customer simply closed the popup. */
  dismissed: boolean;
  message: string;
}

let scriptPromise: Promise<void> | null = null;

/** Loads Razorpay's checkout.js once; resolves when window.Razorpay is available. */
export function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null; // allow a retry
      script.remove();
      reject(new Error("Could not load the Razorpay payment window. Check your connection and try again."));
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Opens Razorpay Checkout for the given server-created order. Resolves with the signed result on a
 * successful payment; rejects with a {@link RazorpayCheckoutError} if the popup is closed or the
 * payment fails. The result must be sent to the server for verification before the order is trusted.
 */
export async function openRazorpayCheckout(order: RazorpayOrderResponse): Promise<VerifyRazorpayPaymentRequest> {
  await loadRazorpayScript();

  const RazorpayCheckout = window.Razorpay;
  if (!RazorpayCheckout) {
    throw { dismissed: false, message: "The Razorpay payment window is unavailable." } satisfies RazorpayCheckoutError;
  }

  return new Promise<VerifyRazorpayPaymentRequest>((resolve, reject) => {
    const checkout = new RazorpayCheckout({
      key: order.key_id,
      amount: order.amount,
      currency: order.currency,
      name: order.merchant_name,
      description: order.description,
      order_id: order.razorpay_order_id,
      prefill: {
        name: order.prefill_name ?? undefined,
        email: order.prefill_email ?? undefined,
        contact: order.prefill_contact ?? undefined,
      },
      theme: { color: "#f5810c" },
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject({ dismissed: true, message: "Payment cancelled." } satisfies RazorpayCheckoutError),
      },
    });

    checkout.on("payment.failed", (response) => {
      reject({
        dismissed: false,
        message: response.error?.description || response.error?.reason || "Payment failed.",
      } satisfies RazorpayCheckoutError);
    });

    checkout.open();
  });
}
