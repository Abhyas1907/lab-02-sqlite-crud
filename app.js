const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(express.json());

// GET /dashboard/ - interactive HTML demo page for screenshots
app.get('/dashboard/', (request, response) => {
  response.setHeader('Content-Type', 'text/html');
  response.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Books API – CRUD Demo</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #0f0f1a; color: #e2e8f0; min-height: 100vh; padding: 24px; }
    h1 { font-size: 1.75rem; font-weight: 700; color: #818cf8; margin-bottom: 6px; letter-spacing: -0.5px; }
    .subtitle { color: #64748b; font-size: 0.875rem; margin-bottom: 28px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(480px, 1fr)); gap: 20px; }
    .card { background: #1e1e2e; border: 1px solid #2d2d42; border-radius: 12px; overflow: hidden; }
    .card-header { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-bottom: 1px solid #2d2d42; }
    .badge { padding: 3px 10px; border-radius: 20px; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.5px; }
    .badge.GET { background: #064e3b; color: #6ee7b7; }
    .badge.POST { background: #1e3a5f; color: #93c5fd; }
    .badge.PUT { background: #451a03; color: #fbbf24; }
    .badge.DELETE { background: #450a0a; color: #fca5a5; }
    .card-title { font-size: 0.875rem; font-weight: 600; color: #94a3b8; }
    .status-badge { margin-left: auto; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-family: 'JetBrains Mono', monospace; }
    .status-2xx { background: #14532d; color: #4ade80; }
    .status-4xx { background: #450a0a; color: #f87171; }
    .status-err { background: #3b1a1a; color: #f87171; }
    .card-body { padding: 16px 18px; }
    pre { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; white-space: pre-wrap; word-break: break-all; color: #a5f3fc; line-height: 1.6; max-height: 260px; overflow-y: auto; }
    .loading { color: #64748b; font-style: italic; }
    .url-line { font-size: 0.72rem; color: #475569; font-family: 'JetBrains Mono', monospace; margin-bottom: 8px; }
    .db-section { margin-top: 28px; }
    .db-section h2 { font-size: 1.1rem; font-weight: 700; color: #818cf8; margin-bottom: 14px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
    th { background: #1e1e2e; color: #64748b; text-align: left; padding: 10px 14px; border-bottom: 1px solid #2d2d42; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 0.7rem; }
    td { padding: 10px 14px; border-bottom: 1px solid #1a1a2e; color: #e2e8f0; }
    tr:hover td { background: #1e1e2e; }
    .price { color: #4ade80; font-family: 'JetBrains Mono', monospace; }
    .pages { color: #a5f3fc; font-family: 'JetBrains Mono', monospace; }
    .id { color: #818cf8; font-family: 'JetBrains Mono', monospace; font-weight: 600; }
  </style>
</head>
<body>
  <h1>📚 Books API — CRUD Demo</h1>
  <p class="subtitle">Server running at http://localhost:3000 &nbsp;|&nbsp; SQLite database: books.db</p>

  <div class="grid">
    <div class="card" id="c1">
      <div class="card-header">
        <span class="badge GET">GET</span>
        <span class="card-title">GET all books &nbsp;/books/</span>
        <span class="status-badge" id="s1"></span>
      </div>
      <div class="card-body">
        <div class="url-line">GET http://localhost:3000/books/</div>
        <pre id="r1" class="loading">Loading…</pre>
      </div>
    </div>

    <div class="card" id="c2">
      <div class="card-header">
        <span class="badge GET">GET</span>
        <span class="card-title">GET single book &nbsp;/books/1/</span>
        <span class="status-badge" id="s2"></span>
      </div>
      <div class="card-body">
        <div class="url-line">GET http://localhost:3000/books/1/</div>
        <pre id="r2" class="loading">Loading…</pre>
      </div>
    </div>

    <div class="card" id="c3">
      <div class="card-header">
        <span class="badge POST">POST</span>
        <span class="card-title">POST new book &nbsp;/books/</span>
        <span class="status-badge" id="s3"></span>
      </div>
      <div class="card-body">
        <div class="url-line">POST http://localhost:3000/books/</div>
        <pre id="r3" class="loading">Loading…</pre>
      </div>
    </div>

    <div class="card" id="c4">
      <div class="card-header">
        <span class="badge PUT">PUT</span>
        <span class="card-title">PUT update book &nbsp;/books/:id/</span>
        <span class="status-badge" id="s4"></span>
      </div>
      <div class="card-body">
        <div class="url-line" id="u4">PUT http://localhost:3000/books/…/</div>
        <pre id="r4" class="loading">Waiting for POST…</pre>
      </div>
    </div>

    <div class="card" id="c5">
      <div class="card-header">
        <span class="badge DELETE">DELETE</span>
        <span class="card-title">DELETE book &nbsp;/books/:id/</span>
        <span class="status-badge" id="s5"></span>
      </div>
      <div class="card-body">
        <div class="url-line" id="u5">DELETE http://localhost:3000/books/…/</div>
        <pre id="r5" class="loading">Waiting for PUT…</pre>
      </div>
    </div>

    <div class="card" id="c6">
      <div class="card-header">
        <span class="badge GET">GET</span>
        <span class="card-title">GET all books (after DELETE)</span>
        <span class="status-badge" id="s6"></span>
      </div>
      <div class="card-body">
        <div class="url-line">GET http://localhost:3000/books/</div>
        <pre id="r6" class="loading">Waiting for DELETE…</pre>
      </div>
    </div>
  </div>

  <div class="db-section">
    <h2>🗄️ SQLite Database — books.db (live state)</h2>
    <table id="db-table">
      <thead><tr><th>ID</th><th>Title</th><th>Author</th><th>Price (₹)</th><th>Pages</th></tr></thead>
      <tbody id="db-body"><tr><td colspan="5" style="color:#64748b;font-style:italic">Loading…</td></tr></tbody>
    </table>
  </div>

  <script>
    function setResult(id, status, data) {
      const el = document.getElementById('r' + id);
      const sb = document.getElementById('s' + id);
      el.classList.remove('loading');
      el.textContent = JSON.stringify(data, null, 2);
      const cls = status >= 200 && status < 300 ? 'status-2xx' : 'status-4xx';
      sb.className = 'status-badge ' + cls;
      sb.textContent = status + ' ' + (status === 200 ? 'OK' : status === 201 ? 'Created' : status === 404 ? 'Not Found' : '');
    }

    async function runDemo() {
      // GET all
      try {
        const r1 = await fetch('/books/');
        setResult(1, r1.status, await r1.json());
      } catch(e) { document.getElementById('r1').textContent = 'Error: ' + e; }

      // GET single
      try {
        const r2 = await fetch('/books/1/');
        setResult(2, r2.status, await r2.json());
      } catch(e) { document.getElementById('r2').textContent = 'Error: ' + e; }

      // POST new book
      let newId;
      try {
        const r3 = await fetch('/books/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 299, pages: 180 }) });
        const d3 = await r3.json();
        setResult(3, r3.status, d3);
        newId = d3.bookId;
      } catch(e) { document.getElementById('r3').textContent = 'Error: ' + e; return; }

      // PUT update
      document.getElementById('u4').textContent = 'PUT http://localhost:3000/books/' + newId + '/';
      document.getElementById('r4').textContent = 'Loading…';
      try {
        const r4 = await fetch('/books/' + newId + '/', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'The Great Gatsby — Updated Edition', author: 'F. Scott Fitzgerald', price: 350, pages: 200 }) });
        setResult(4, r4.status, await r4.json());
      } catch(e) { document.getElementById('r4').textContent = 'Error: ' + e; }

      // DELETE
      document.getElementById('u5').textContent = 'DELETE http://localhost:3000/books/' + newId + '/';
      document.getElementById('r5').textContent = 'Loading…';
      try {
        const r5 = await fetch('/books/' + newId + '/', { method: 'DELETE' });
        setResult(5, r5.status, await r5.json());
      } catch(e) { document.getElementById('r5').textContent = 'Error: ' + e; }

      // GET all after delete
      try {
        const r6 = await fetch('/books/');
        const d6 = await r6.json();
        setResult(6, r6.status, d6);
        // populate table
        const tbody = document.getElementById('db-body');
        tbody.innerHTML = d6.map(b =>
          '<tr><td class="id">' + b.id + '</td><td>' + b.title + '</td><td>' + b.author + '</td><td class="price">₹' + b.price + '</td><td class="pages">' + b.pages + '</td></tr>'
        ).join('');
      } catch(e) { document.getElementById('r6').textContent = 'Error: ' + e; }
    }

    runDemo();
  </script>
</body>
</html>`);
});

let db;

function isValidBook(book) {
  return book &&
    typeof book.title === 'string' && book.title.trim() !== '' &&
    typeof book.author === 'string' && book.author.trim() !== '' &&
    Number.isInteger(book.price) && book.price >= 0 &&
    Number.isInteger(book.pages) && book.pages > 0;
}

async function initializeDBAndServer() {
  try {
    const dbPath = process.env.DB_PATH
      ? path.resolve(process.env.DB_PATH)
      : path.join(__dirname, 'books.db');

    db = await open({ filename: dbPath, driver: sqlite3.Database });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL CHECK(price >= 0),
        pages INTEGER NOT NULL CHECK(pages > 0)
      );
    `);

    const port = Number(process.env.PORT) || 3000;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log(`Connected to SQLite database: ${dbPath}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
}

// GET /books/ - retrieve all books
app.get('/books/', async (request, response) => {
  try {
    const books = await db.all('SELECT * FROM book ORDER BY id;');
    response.status(200).send(books);
  } catch (error) {
    response.status(500).send({ error: 'Unable to retrieve books.' });
  }
});

// GET /books/:bookId/ - retrieve one book
app.get('/books/:bookId/', async (request, response) => {
  const { bookId } = request.params;
  if (!/^\d+$/.test(bookId)) {
    return response.status(400).send({ error: 'bookId must be a positive integer.' });
  }
  try {
    const book = await db.get('SELECT * FROM book WHERE id = ?;', [Number(bookId)]);
    if (!book) return response.status(404).send({ error: 'Book not found.' });
    response.status(200).send(book);
  } catch (error) {
    response.status(500).send({ error: 'Unable to retrieve the book.' });
  }
});

// POST /books/ - add a book
app.post('/books/', async (request, response) => {
  const { title, author, price, pages } = request.body;
  const newBook = { title, author, price, pages };
  if (!isValidBook(newBook)) {
    return response.status(400).send({
      error: 'Provide title and author as non-empty strings, price as a non-negative integer, and pages as a positive integer.'
    });
  }
  try {
    const result = await db.run(
      'INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?);',
      [title.trim(), author.trim(), price, pages]
    );
    response.status(201).send({ message: 'Book added successfully.', bookId: result.lastID });
  } catch (error) {
    response.status(500).send({ error: 'Unable to add the book.' });
  }
});

// PUT /books/:bookId/ - update a book
app.put('/books/:bookId/', async (request, response) => {
  const { bookId } = request.params;
  const { title, author, price, pages } = request.body;
  if (!/^\d+$/.test(bookId)) {
    return response.status(400).send({ error: 'bookId must be a positive integer.' });
  }
  const updatedBook = { title, author, price, pages };
  if (!isValidBook(updatedBook)) {
    return response.status(400).send({
      error: 'Provide title and author as non-empty strings, price as a non-negative integer, and pages as a positive integer.'
    });
  }
  try {
    const result = await db.run(
      'UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?;',
      [title.trim(), author.trim(), price, pages, Number(bookId)]
    );
    if (result.changes === 0) return response.status(404).send({ error: 'Book not found.' });
    response.status(200).send({ message: 'Book updated successfully.' });
  } catch (error) {
    response.status(500).send({ error: 'Unable to update the book.' });
  }
});

// DELETE /books/:bookId/ - delete a book
app.delete('/books/:bookId/', async (request, response) => {
  const { bookId } = request.params;
  if (!/^\d+$/.test(bookId)) {
    return response.status(400).send({ error: 'bookId must be a positive integer.' });
  }
  try {
    const result = await db.run('DELETE FROM book WHERE id = ?;', [Number(bookId)]);
    if (result.changes === 0) return response.status(404).send({ error: 'Book not found.' });
    response.status(200).send({ message: 'Book deleted successfully.' });
  } catch (error) {
    response.status(500).send({ error: 'Unable to delete the book.' });
  }
});

// Handle malformed JSON and unexpected errors.
app.use((error, request, response, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return response.status(400).send({ error: 'Invalid JSON request body.' });
  }
  response.status(500).send({ error: 'Internal server error.' });
});

initializeDBAndServer();
