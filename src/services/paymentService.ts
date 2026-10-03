import httpClient from "./api/httpClient";
import { unwrapApiResponse } from "../utils/apiResponse";
import type {
  ApiResponse,
  RazorpayOrderResponse,
  VerifyRazorpayPaymentRequest,
  VerifyRazorpayPaymentResponse,
} from "../types/registration.types";

/** Creates the Razorpay order for an already-created (Pending, Online) order. The amount is decided by the server. */
export async function createRazorpayOrder(mainId: number): Promise<RazorpayOrderResponse> {
  const response = await httpClient.post<ApiResponse<RazorpayOrderResponse>>("/payments/razorpay/order", {
    main_id: mainId,
  });
  return unwrapApiResponse(response.data);
}

/** Sends Razorpay Checkout's result to the server, which verifies the signature and settles the order. */
export async function verifyRazorpayPayment(
  payload: VerifyRazorpayPaymentRequest
): Promise<VerifyRazorpayPaymentResponse> {
  const response = await httpClient.post<ApiResponse<VerifyRazorpayPaymentResponse>>(
    "/payments/razorpay/verify",
    payload
  );
  return unwrapApiResponse(response.data);
}
