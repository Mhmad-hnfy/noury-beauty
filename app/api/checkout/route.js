import { NextResponse } from 'next/server';

const PAYMOB_API_URL = 'https://accept.paymob.com/api';

export async function POST(req) {
  try {
    const { amount, customer, items, paymentMethod } = await req.json();

    const apiKey = process.env.PAYMOB_API_KEY;
    const integrationId = paymentMethod === 'card' 
      ? process.env.PAYMOB_CARD_INTEGRATION_ID 
      : process.env.PAYMOB_WALLET_INTEGRATION_ID;

    if (!apiKey || apiKey === 'YOUR_PAYMOB_API_KEY_HERE') {
      return NextResponse.json({ error: 'Paymob API key is not configured.' }, { status: 500 });
    }

    // Step 1: Authentication
    const authRes = await fetch(`${PAYMOB_API_URL}/auth/tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey }),
    });
    const { token: authToken } = await authRes.json();

    if (!authToken) throw new Error('Failed to authenticate with Paymob');

    // Step 2: Order Registration
    const orderRes = await fetch(`${PAYMOB_API_URL}/ecommerce/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: "false",
        amount_cents: Math.round(amount * 100), // Amount is 20% of total
        currency: "EGP",
        items: [
          {
            name: `Order Deposit (20%)`,
            amount_cents: Math.round(amount * 100),
            quantity: 1
          }
        ]
      }),
    });
    const orderData = await orderRes.json();
    const orderId = orderData.id;

    if (!orderId) throw new Error('Failed to create order on Paymob');

    // Step 3: Payment Key Generation
    const paymentKeyRes = await fetch(`${PAYMOB_API_URL}/acceptance/payment_keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: Math.round(amount * 100),
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: customer.apartment || "NA",
          email: customer.identity || "guest@example.com",
          floor: "NA",
          first_name: customer.firstName,
          street: customer.address,
          building: "NA",
        phone_number: (() => {
          let p = customer.phone.replace(/[^0-9]/g, '');
          if (p.startsWith('20')) p = p.substring(2);
          if (!p.startsWith('0') && p.length === 10) p = '0' + p;
          return p.slice(-11);
        })(),
          shipping_method: "PKG",
          postal_code: customer.postalCode || "NA",
          city: customer.city || "NA",
          country: "EGY",
          last_name: customer.lastName,
          state: customer.governorate
        },
        currency: "EGP",
        integration_id: integrationId,
      }),
    });

    const { token: paymentKey } = await paymentKeyRes.json();

    if (!paymentKey) throw new Error('Failed to generate payment key');

    // Step 4: Finalize Redirection
    if (paymentMethod === 'wallet') {
      // For wallets, we must request a redirection URL specifically
      let cleanPhone = customer.phone.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('20')) cleanPhone = cleanPhone.substring(2);
      if (!cleanPhone.startsWith('0') && cleanPhone.length === 10) cleanPhone = '0' + cleanPhone;
      if (cleanPhone.length > 11) cleanPhone = cleanPhone.slice(-11);

      const payRes = await fetch(`${PAYMOB_API_URL}/acceptance/payments/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: {
            identifier: cleanPhone,
            subtype: "WALLET",
            type: "wallet"
          },
          payment_token: paymentKey
        }),
      });
      const payData = await payRes.json();
      
      // If we have a redirection_url, use it. 
      // If not, but we have a transaction ID and it's pending, it means a USSD push was sent.
      if (payData.redirection_url) {
        return NextResponse.json({ 
          redirectUrl: payData.redirection_url,
          paymobOrderId: orderId
        });
      }

      if (payData.id && payData.pending === true) {
        return NextResponse.json({ 
          success: true,
          message: 'USSD_PUSH_SENT',
          paymobOrderId: orderId
        });
      }

      // If truly failed
      console.error('Paymob Wallet API Error:', payData);
      const detailMsg = payData.data?.message || payData.detail || payData.message || (payData.success === false ? 'Transaction Rejected by Provider' : JSON.stringify(payData));
      const errorMessage = `${detailMsg} (Sent Phone: ${cleanPhone})`;
      throw new Error(`Paymob Wallet Error: ${errorMessage}`);
    }

    // For Cards, use the traditional iframe flow
    return NextResponse.json({ 
      token: paymentKey,
      iframeId: process.env.PAYMOB_IFRAME_ID,
      paymobOrderId: orderId
    });

  } catch (error) {
    console.error('Paymob Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
