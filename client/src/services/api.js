/* ============================================================
   api.js  –  single source of truth for all HTTP calls
   Base URL is read from VITE_API_URL env var (fallback: localhost:3000)
   ============================================================ */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

function getToken() {
  return localStorage.getItem('myfood_token')
}

function buildHeaders() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: buildHeaders(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const e = await res.json()
      msg = e.message || e.error || msg
    } catch { /* ignore parse errors */ }
    throw new Error(msg)
  }

  return res.json()
}

/* ── User APIs ─────────────────────────────────────────────
   Schema: { id, name, email, password, gender, age, shipping_address, role }
   ────────────────────────────────────────────────────────── */
export const userAPI = {
  signup : (data)       => request('POST',   '/user',           data),
  login  : (data)       => request('POST',   '/user/login',     data),
  get    : (id)         => request('GET',    `/users?id=${id}`),
  update : (id, data)   => request('PATCH',  `/users?id=${id}`, data),
  delete : (id)         => request('DELETE', `/user?id=${id}`),
}

/* ── Product APIs ──────────────────────────────────────────
   Schema: { id, name, tag_line, description, nutrients,
             ingredients, retailer, amount, price }
   ────────────────────────────────────────────────────────── */
export const productAPI = {
  create : (data)       => request('POST',   '/products',            data),
  getAll : ()           => request('GET',    '/products'),
  get    : (id)         => request('GET',    `/products?id=${id}`),
  update : (id, data)   => request('PATCH',  `/products?id=${id}`,   data),
  delete : (id)         => request('DELETE', `/products?id=${id}`),
}

/* ── Order APIs ────────────────────────────────────────────
   Schema: { id, ordered_by, status, product_id }
   ────────────────────────────────────────────────────────── */
export const orderAPI = {
  create : (data)       => request('POST',   '/orders',            data),
  get    : (id)         => request('GET',    `/orders?id=${id}`),
  update : (id, data)   => request('PATCH',  `/orders?id=${id}`,   data),
  delete : (id)         => request('DELETE', `/orders?id=${id}`),
}
