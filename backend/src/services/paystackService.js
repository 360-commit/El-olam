/**
 * PayStack Payment Service
 * Ghana's most popular payment gateway
 * Docs: https://paystack.com/docs/api/
 *
 * Supports: Cards, Mobile Money (MTN, Vodafone, AirtelTigo), Bank Transfer
 */

const PAYSTACK_BASE = "https://api.paystack.co";

const headers = () => ({
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  "Content-Type": "application/json",
});

// ── INITIALIZE TRANSACTION ────────────────────────────────────────────────────
/**
 * Returns an authorization_url to redirect user to for payment
 */
const initializePayment = async ({ email, amount, reference, metadata = {}, callbackUrl }) => {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    console.log(`💳 [DEV] PayStack: Init payment ${reference} for ${email} — ₵${amount}`);
    return { success: true, dev: true, authorization_url: "#", reference };
  }

  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method:  "POST",
    headers: headers(),
    body: JSON.stringify({
      email,
      amount:       Math.round(amount * 100), // PayStack uses kobo/pesewas (smallest unit)
      reference,
      currency:     "GHS",
      callback_url: callbackUrl || process.env.CLIENT_URL + "/fees/payment-callback",
      metadata:     { ...metadata, custom_fields: [{ display_name: "School", variable_name: "school", value: "El-Olam International School" }] },
    }),
  });

  const data = await res.json();
  if (!data.status) throw new Error(data.message || "PayStack initialisation failed.");

  return {
    success:           true,
    authorization_url: data.data.authorization_url,
    reference:         data.data.reference,
    access_code:       data.data.access_code,
  };
};

// ── VERIFY TRANSACTION ────────────────────────────────────────────────────────
/**
 * Verify after callback — always verify server-side before recording payment
 */
const verifyPayment = async (reference) => {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    console.log(`💳 [DEV] PayStack: Verify ${reference}`);
    return { success: true, dev: true, paid: true, amount: 0 };
  }

  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
    headers: headers(),
  });

  const data = await res.json();
  if (!data.status) throw new Error(data.message || "Verification failed.");

  const txn = data.data;
  return {
    success:   true,
    paid:      txn.status === "success",
    amount:    txn.amount / 100, // convert back to GHS
    currency:  txn.currency,
    reference: txn.reference,
    channel:   txn.channel,    // card, mobile_money, etc.
    paidAt:    txn.paid_at,
    customer:  txn.customer,
  };
};

// ── LIST TRANSACTIONS ────────────────────────────────────────────────────────
const listTransactions = async ({ page = 1, perPage = 50 } = {}) => {
  if (!process.env.PAYSTACK_SECRET_KEY) return { success: true, dev: true, data: [] };

  const res = await fetch(`${PAYSTACK_BASE}/transaction?page=${page}&perPage=${perPage}`, {
    headers: headers(),
  });
  const data = await res.json();
  return { success: data.status, data: data.data || [] };
};

module.exports = { initializePayment, verifyPayment, listTransactions };
