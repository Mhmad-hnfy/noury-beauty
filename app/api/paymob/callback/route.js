import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const body = await req.json();
    const { obj } = body;
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;

    // Verify HMAC to ensure this request is truly from Paymob
    const data = [
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
      obj.success,
    ].join('');

    const hmacCalculated = crypto.createHmac('sha512', hmacSecret).update(data, 'utf8').digest('hex');
    const hmacReceived = req.nextUrl.searchParams.get('hmac');

    if (hmacCalculated !== hmacReceived) {
      console.error('HMAC Verification Failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Payment Webhook Received:', obj.id, 'Success:', obj.success);
    
    // In a real DB, you would update the order status here. 
    // Since we use localStorage, we will rely on the redirect success page for client-side updates.

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
    // Paymob will redirect the user to success/failure via this GET request
    const searchParams = req.nextUrl.searchParams;
    const success = searchParams.get('success') === 'true';
    const txnId = searchParams.get('id');
    
    // Redirect the user to our frontend success/failure pages
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    const targetUrl = success ? `${baseUrl}/checkout/success?id=${txnId}` : `${baseUrl}/checkout/failure?id=${txnId}`;
    
    return NextResponse.redirect(targetUrl);
}
