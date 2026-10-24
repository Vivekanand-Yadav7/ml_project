/* ============================================================
   api.js  –  single source of truth for all HTTP calls
   Base URL is read from VITE_API_URL env var (fallback: localhost:8000/api/v1)
   ============================================================ */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

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
      msg = e.detail || e.message || e.error || msg
    } catch { /* ignore parse errors */ }
    throw new Error(msg)
  }

  return res.json()
}

/* ── User APIs (Plural: /users) ───────────────────────────
   Schema: { id, name, email, password, gender, age, shipping_address, role, image_url }
   ────────────────────────────────────────────────────────── */
export const userAPI = {
  signup : (data)       => request('POST',   '/users',          { role: 'client', ...data }),
  login  : (data)       => request('POST',   '/users/login',    data),
  get    : (id)         => request('GET',    `/users?id=${id}`).catch(() => request('GET', `/users/${id}`)),
  update : (id, data)   => request('PATCH',  `/users?id=${id}`, data).catch(() => request('PATCH', `/users/${id}`, data)),
  delete : (id)         => request('DELETE', `/users?id=${id}`).catch(() => request('DELETE', `/users/${id}`)),
}

/* ── Product APIs (Plural: /products) ─────────────────────
   Schema: { id, name, tag_line, description, nutrients,
             ingredients, retailer, amount, price }
   ────────────────────────────────────────────────────────── */
export const productAPI = {
  create : (data)       => request('POST',   '/products',            data),
  getAll : (inStock)    => request('GET',    inStock ? '/products?in_stock=true' : '/products'),
  get    : (id)         => request('GET',    `/products?id=${id}`).catch(() => request('GET', `/products/${id}`)),
  update : (id, data)   => request('PATCH',  `/products?id=${id}`,   data).catch(() => request('PATCH', `/products/${id}`, data)),
  delete : (id)         => request('DELETE', `/products?id=${id}`).catch(() => request('DELETE', `/products/${id}`)),
}

/* ── Order APIs (Plural: /orders) ─────────────────────────
   Schema: { id, client_id, retailer_id, status, product_id, image_url }
   ────────────────────────────────────────────────────────── */
export const orderAPI = {
  create : (data)       => request('POST',   '/orders',            data),
  get    : (id)         => request('GET',    `/orders?id=${id}`).catch(() => request('GET', `/orders/${id}`)),
  update : (id, data)   => request('PATCH',  `/orders?id=${id}`,   data).catch(() => request('PATCH', `/orders/${id}`, data)),
  delete : (id)         => request('DELETE', `/orders?id=${id}`).catch(() => request('DELETE', `/orders/${id}`)),
}

/* ── Upload APIs (Cloudinary via /upload) ─────────────────── */
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const token = getToken()
    const res = await fetch(`${BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })
    if (!res.ok) {
      let msg = `Upload failed (HTTP ${res.status})`
      try {
        const e = await res.json()
        msg = e.detail || e.message || msg
      } catch { /* ignore parse errors */ }
      throw new Error(msg)
    }
    return res.json()
  },
}
