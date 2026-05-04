// src/utils/orderService.js
const SELLER_WHATSAPP = process.env.REACT_APP_SELLER_WHATSAPP || '919492901993';

export function buildWhatsAppUrl(customer, cart, sareeData, grandTotal) {
  const itemLines = cart
    .map(c => {
      const s = sareeData[c.id];
      if (!s) return null;
      return `  • ${s.name} (${s.type}, ${s.color}) × ${c.qty} = ₹${(s.price * c.qty).toLocaleString('en-IN')}`;
    })
    .filter(Boolean)
    .join('\n');

  const message =
`🛍️ *New Order — City Girl Sarees*

👤 *Customer:* ${customer.name}
📞 *Phone:* ${customer.phone}
📍 *Address:* ${customer.address}
${customer.notes ? `📝 *Notes:* ${customer.notes}` : ''}

🧵 *Items Ordered:*
${itemLines}

💰 *Total:* ₹${grandTotal.toLocaleString('en-IN')}

_Sent via City Girl website_`;

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