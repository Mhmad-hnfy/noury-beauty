import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const body = await req.json();
    const { obj } = body;
    
    // Paymob sends the HMAC in the query parameter for simple callbacks, 
    // but in webhooks it's usually in the URL or the payload.
    // However, the standard way to verify a transaction webhook is by using 
    // the query parameter 'hmac' passed in the notification URL.
    const url = new URL(req.url);
    const receivedHmac = url.searchParams.get('hmac');

    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;

    if (!hmacSecret || hmacSecret === 'YOUR_PAYMOB_HMAC_SECRET_HERE') {
      return NextResponse.json({ error: 'HMAC secret not configured' }, { status: 500 });
    }

    // Step 1: Extract and concatenate fields in exact order
    // Order: amount_cents, created_at, currency, error_occured, has_parent_transaction, 
    // id, integration_id, is_3d_secure, is_auth, is_capture, is_refunded, 
    // is_standalone_payment, is_voided, order.id, owner, pending, 
    // source_data.pan, source_data.sub_type, source_data.type, success
    
    const hmacString = [
      obj.amount_cents,
      obj.created_at,
      obj.currency,
      obj.error_occured,
      obj.has_parent_transaction,
      obj.id,
      obj.integration_id,
      obj.is_3d_secure,
      obj.is_auth,
      obj.is_capture,
      obj.is_refunded,
      obj.is_standalone_payment,
      obj.is_voided,
      obj.order.id,
      obj.owner,
      obj.pending,
      obj.source_data.pan,
      obj.source_data.sub_type,
      obj.source_data.type,
      obj.success
    ].join('');

    // Step 2: Calculate HMAC-SHA512
    const calculatedHmac = crypto
      .createHmac('sha512', hmacSecret)
      .update(hmacString)
      .digest('hex');

    // Step 3: Compare
    if (calculatedHmac !== receivedHmac) {
      console.warn('Invalid HMAC signature received from Paymob');
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    // Step 4: Handle Success
    if (obj.success === true || obj.success === 'true') {
      const paymobOrderId = obj.order.id;
      const transactionId = obj.id;

      if (supabase) {
        // Find order by Paymob Order ID and update it
        const { error } = await supabase
          .from('orders')
          .update({ 
            status: 'confirmed', 
            deposit_paid: true,
            payment_details: {
              transaction_id: transactionId,
              paymob_order_id: paymobOrderId,
              paid_at: new Date().toISOString()
            }
          })
          .eq('paymob_order_id', paymobOrderId);

        if (error) {
          console.error('Error updating order in Supabase:', error.message);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }
      }

      console.log(`Payment successful for Paymob Order ID: ${paymobOrderId}`);
    } else {
      console.log('Payment transaction was not successful:', obj.success);
    }

    return NextResponse.json({ message: 'Webhook received and processed' });

  } catch (error) {
    console.error('Paymob Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
