import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, billingData, walletNumber } = body;

    // Use Wallet Integration ID by default
    const integrationId = process.env.PAYMOB_WALLET_INTEGRATION_ID || "5579763";

    console.log('--- Paymob Step 1: Authentication ---');
    const authResponse = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
    });

    if (!authResponse.ok) {
        const err = await authResponse.text();
        throw new Error(`Auth Failed: ${err}`);
    }
    const { token: authToken } = await authResponse.json();

    console.log('--- Paymob Step 2: Order Registration ---');
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
      throw new Error(`Order Registration Failed: ${JSON.stringify(errorData)}`);
    }
    const { id: orderId } = await orderResponse.json();

    console.log('--- Paymob Step 3: Payment Key Generation ---');
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
          city: billingData.province || "Cairo",
          country: "EG",
          last_name: "User",
          state: billingData.province || "Egypt"
        },
        currency: "EGP",
        integration_id: integrationId,
      }),
    });

    if (!paymentKeyResponse.ok) {
      const errorData = await paymentKeyResponse.json();
      throw new Error(`Payment Key Failed: ${JSON.stringify(errorData)}`);
    }
    const { token: paymentKey } = await paymentKeyResponse.json();

    console.log('--- Paymob Step 4: Wallet Redirection ---');
    // If a wallet number is provided, we can trigger the "Direct Pay" API
    const payResponse = await fetch('https://accept.paymob.com/api/acceptance/payments/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            source: {
                subtype: "WALLET",
                identifier: walletNumber
            },
            payment_token: paymentKey
        }),
    });

    if (!payResponse.ok) {
        const errorData = await payResponse.json();
        console.error('Wallet Pay Error:', errorData);
        throw new Error(`Wallet Pay Failed: ${JSON.stringify(errorData)}`);
    }

    const payData = await payResponse.json();
    const redirectionUrl = payData.iframe_redirection_url || payData.redirect_url || payData.url;

    return NextResponse.json({ 
      paymentKey, 
      redirectionUrl 
    });
    
  } catch (error) {
    console.error('Paymob Detailed Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
