/**
 * /src/utils/orderService.js
 *
 * Handles order submission logic.
 * - Logs order to console (mock)
 * - Builds WhatsApp deep-link for seller notification
 *
 * TODO: Replace mockSubmitOrder with a real API call:
 *   import axios from 'axios';
 *   const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, orderPayload);
 */

import { SAREES } from "../data/sarees";

// ─── CONFIG ────────────────────────────────────────────────────────────────
// TODO: Move to .env file:  REACT_APP_SELLER_WHATSAPP=919876543210
const SELLER_WHATSAPP = process.env.REACT_APP_SELLER_WHATSAPP || "919876543210";

// ─── Build WhatsApp message ─────────────────────────────────────────────────
export function buildWhatsAppUrl(customer, cart, grandTotal) {
  const itemLines = cart
    .map((c) => {
      const s = SAREES.find((x) => x.id === c.id);
      if (!s) return null;
      return `  • ${s.name} (${s.type}, ${s.color}) × ${c.qty} = ₹${(
        s.price * c.qty
      ).toLocaleString("en-IN")}`;
    })
    .filter(Boolean)
    .join("\n");

  const message = `🛍️ *New Order — City Girl Sarees*

👤 *Customer:* ${customer.name}
📞 *Phone:* ${customer.phone}
📍 *Address:* ${customer.address}
${customer.notes ? `📝 *Notes:* ${customer.notes}` : ""}

🧵 *Items Ordered:*
${itemLines}

💰 *Order Total:* ₹${grandTotal.toLocaleString("en-IN")}

_Sent via City Girl website_`;

  return `https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

// ─── Submit order (mock — replace with real API) ────────────────────────────
export async function submitOrder(customer, cart, grandTotal) {
  const orderPayload = {
    orderId: `CG-${Date.now()}`,
    customer,
    items: cart.map((c) => {
      const s = SAREES.find((x) => x.id === c.id);
      return {
        id: c.id,
        name: s?.name,
        type: s?.type,
        color: s?.color,
        qty: c.qty,
        price: s?.price,
        subtotal: (s?.price || 0) * c.qty,
      };
    }),
    grandTotal,
    timestamp: new Date().toISOString(),
    status: "pending",
  };

  // ── Mock: log to console ──────────────────────────────────────────────────
  console.log("📦 ORDER SUBMITTED:", orderPayload);

  // ── TODO: Real API call ───────────────────────────────────────────────────
  // const res = await axios.post(
  //   `${process.env.REACT_APP_API_URL}/api/orders`,
  //   orderPayload
  // );
  // return res.data;

  // ── TODO: Send email via backend (Nodemailer / SendGrid) ──────────────────
  // This would be triggered server-side when the order is received.

  return orderPayload;
}
