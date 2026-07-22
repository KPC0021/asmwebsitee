export type PaymentMethod = 'cod' | 'card' | 'momo' | 'vnpay' | 'zalopay';

export interface PaymentGatewayResponse {
  success: boolean;
  message: string;
  redirectUrl?: string;
  orderId: string;
}

/**
 * Giả lập kết nối thanh toán thật với các cổng trực tuyến.
 * Sẵn sàng để tích hợp API/Backend thực tế ở đây mà không lộ Secret Key.
 */
export const initiatePayment = async (
  method: PaymentMethod,
  amount: number,
  orderDetails: {
    name: string;
    phone: string;
    address: string;
    note?: string;
    itemsCount: number;
  }
): Promise<PaymentGatewayResponse> => {
  // Trì hoãn 1.5 giây để tạo trải nghiệm "Redirecting to secure gateway..." thực tế
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const mockOrderId = `FA-${Date.now().toString().slice(-6)}`;

  if (method === 'cod') {
    return {
      success: true,
      message: "Đặt hàng thành công với phương thức Thanh toán khi nhận hàng (COD).",
      orderId: mockOrderId,
    };
  }

  // Đối với thanh toán trực tuyến (Card, Momo, Vnpay, Zalopay)
  let gatewayName = "";
  let redirectUrl = "";

  switch (method) {
    case 'card':
      gatewayName = "Cổng bảo mật thẻ quốc tế Stripe/Mollie";
      redirectUrl = `https://stripe.com/demo/secure?order=${mockOrderId}&amount=${amount}`;
      break;
    case 'momo':
      gatewayName = "Cổng thanh toán MoMo Partner";
      redirectUrl = `https://test-payment.momo.vn/secure?order=${mockOrderId}&value=${amount}`;
      break;
    case 'vnpay':
      gatewayName = "Trang thanh toán VNPAY-Gateway";
      redirectUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?orderId=${mockOrderId}`;
      break;
    case 'zalopay':
      gatewayName = "ZaloPay Merchant Payment Portal";
      redirectUrl = `https://payment.zalopay.vn/merchant?billId=${mockOrderId}&val=${amount}`;
      break;
    default:
      gatewayName = "Cổng thanh toán an toàn";
      redirectUrl = "#";
  }

  return {
    success: true,
    message: `Đang chuyển hướng tới ${gatewayName} để hoàn tất thanh toán...`,
    redirectUrl,
    orderId: mockOrderId,
  };
};
