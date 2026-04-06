import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, billingData, integrationId } = body;

    // 1. Auth Step
    const authResponse = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
    });

    if (!authResponse.ok) throw new Error('Paymob Auth Failed');
    const { token: authToken } = await authResponse.json();

    // 2. Order Registration
    const orderResponse = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: Math.round(amount * 100),
        currency: "EGP",
        items: []
      }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error('Paymob Order Registration Failed:', errorData);
      throw new Error(`Order Registration Failed: ${JSON.stringify(errorData)}`);
    }
    const { id: orderId } = await orderResponse.json();

    // 3. Payment Key Generation
    const paymentKeyResponse = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: Math.round(amount * 100),
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: "NA",
          email: billingData.email || "guest@nourybeauty.com",
          floor: "NA",
          first_name: billingData.name || "Guest",
          street: billingData.address || "NA",
          building: "NA",
          phone_number: billingData.phone || "01200000000",
          shipping_method: "PKG",
          postal_code: "NA",
          city: billingData.city || "Cairo",
          country: "EG",
          last_name: "User",
          state: billingData.state || "Egypt"
        },
        currency: "EGP",
        integration_id: integrationId,
      }),
    });

    if (!paymentKeyResponse.ok) {
      const errorData = await paymentKeyResponse.json();
      console.error('Paymob Payment Key Generation Failed:', errorData);
      throw new Error(`Payment Key Generation Failed: ${JSON.stringify(errorData)}`);
    }
    const { token: paymentKey } = await paymentKeyResponse.json();

    // 4. Direct Wallet Pay (Optional but better for UX)
    let redirectionUrl = null;
    if (body.walletNumber) {
      const payResponse = await fetch('https://accept.paymob.com/api/acceptance/payments/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_data: {
            type: "wallet",
            identifier: body.walletNumber
          },
          payment_token: paymentKey
        }),
      });

      if (payResponse.ok) {
        const payData = await payResponse.json();
        redirectionUrl = payData.iframe_redirection_url || payData.redirect_url;
      } else {
        const errorData = await payResponse.json();
        console.error('Paymob Direct Wallet Pay Failed:', errorData);
      }
    }

    return NextResponse.json({ 
      paymentKey, 
      iframeId: process.env.PAYMOB_IFRAME_ID,
      redirectionUrl 
    });
    
  } catch (error) {
    console.error('Paymob Integration Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "This endpoint only accepts POST requests from the checkout page.",
    hint: "Please go to the checkout page to initiate a payment."
  }, { status: 405 });
}
