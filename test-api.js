const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

async function request(method, route, body) {
  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const text = await response.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  console.log(`${method} ${route} -> ${response.status}`, data);
  return { status: response.status, data };
}

(async () => {
  const all = await request('GET', '/books/');
  if (all.status !== 200) throw new Error('GET all books failed');

  const created = await request('POST', '/books/', {
    title: 'API Test Book', author: 'Test Author', price: 199, pages: 150
  });
  if (created.status !== 201) throw new Error('POST failed');
  const id = created.data.bookId;

  const one = await request('GET', `/books/${id}/`);
  if (one.status !== 200) throw new Error('GET one failed');

  const updated = await request('PUT', `/books/${id}/`, {
    title: 'Updated API Test Book', author: 'Test Author', price: 225, pages: 160
  });
  if (updated.status !== 200) throw new Error('PUT failed');

  const deleted = await request('DELETE', `/books/${id}/`);
  if (deleted.status !== 200) throw new Error('DELETE failed');

  const missing = await request('GET', `/books/${id}/`);
  if (missing.status !== 404) throw new Error('Expected 404 after deletion');

  console.log('\nAll API checks passed.');
})().catch(error => {
  console.error(error.message);
  process.exit(1);
});
