import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const body = await req.json();
    const { obj } = body;
    
    // ... (HMAC verification remains same)
    const url = new URL(req.url);
    const receivedHmac = url.searchParams.get('hmac');

    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;

    if (!hmacSecret || hmacSecret === 'YOUR_PAYMOB_HMAC_SECRET_HERE') {
      return NextResponse.json({ error: 'HMAC secret not configured' }, { status: 500 });
    }

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

    const calculatedHmac = crypto
      .createHmac('sha512', hmacSecret)
      .update(hmacString)
      .digest('hex');

    if (calculatedHmac !== receivedHmac) {
      console.warn('Invalid HMAC signature received from Paymob');
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    // Step 4: Handle Success
    if (obj.success === true || obj.success === 'true') {
      const paymobOrderId = obj.order.id;
      const transactionId = obj.id;

      // Update order in Supabase by Paymob Order ID
      const { data, error: updateError } = await supabase
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

      if (updateError) {
          console.error(`Error updating order for Paymob Order ID ${paymobOrderId}:`, updateError);
      } else {
          console.log(`Payment successful and order updated for Paymob Order ID: ${paymobOrderId}`);
      }
    } else {
      console.log('Payment transaction was not successful:', obj.success);
    }

    return NextResponse.json({ message: 'Webhook received and processed' });

  } catch (error) {
    console.error('Paymob Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
