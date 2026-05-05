// src/utils/orderService.js
const SELLER_WHATSAPP = process.env.REACT_APP_SELLER_WHATSAPP || '919492901993';

export function buildWhatsAppUrl(customer, cart, sareeData, grandTotal) {
  const divider = '━━━━━━━━━━━━━━━━━━━━';

  const itemLines = cart
    .map(c => {
      const s = sareeData[c.id];
      if (!s) return null;
      return `   ${c.qty}x ${s.name}\n       ${s.type} · ${s.color} · ₹${(s.price * c.qty).toLocaleString('en-IN')}`;
    })
    .filter(Boolean)
    .join('\n\n');

  const message =
`${divider}
*CITY GIRL SAREES*
*New Order Received*
${divider}

*CUSTOMER DETAILS*
Name       : ${customer.name}
Phone    : ${customer.phone}
Address : ${customer.address}${customer.notes ? `\nNotes     : ${customer.notes}` : ''}

${divider}

*ITEMS ORDERED*

${itemLines}

${divider}

*ORDER TOTAL : ₹${grandTotal.toLocaleString('en-IN')}*

${divider}
_Sent from City Girl website_`;

  const SELLER_WHATSAPP = process.env.REACT_APP_SELLER_WHATSAPP || '919876543210';
  return `https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export async function submitOrder(orderPayload) {
  // If backend URL is configured, send to API
  if (process.env.REACT_APP_API_URL) {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order failed');
    return data;
  }

  // Fallback: log to console
  console.log('ORDER:', orderPayload);
  return { orderId: `CG-${Date.now()}` };
}