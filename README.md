# Lab 2: SQLite database and CRUD routes

**Name:** A. Abhyas  
**Registration number:** 252U1R1009  
**Section:** CSE-2A  
**Faculty name:** Sai Siva Teja

## Live link

Not deployed. Run the project locally using the instructions below. The API test script and Postman collection are included so that all five endpoints can be verified. Add the deployed public URL here after deployment, if required by the faculty.

## Objective

Connect an Express server to an SQLite database and expose Create, Read, Update and Delete (CRUD) operations over HTTP.

## Project files

- `app.js` — Express server, database connection and five CRUD routes.
- `books.db` — SQLite database containing 10 sample book records.
- `seed.sql` — SQL schema and sample INSERT statements.
- `postman_collection.json` — requests for testing all five endpoints.
- `test-api.js` — automated end-to-end API check using Node's built-in `fetch`.
- `.env.example` — example configuration; do not commit a real `.env` file.

## Requirements

- Node.js 18 or later
- npm

## How to install and run

1. Open a terminal in the `lab-02` folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. (Optional) Copy `.env.example` to `.env` and change the values if needed. The defaults are `PORT=3000` and `DB_PATH=./books.db`. Do not commit `.env`.
4. Start with automatic restart during development:

   ```bash
   npm run dev
   ```

   Or start normally:

   ```bash
   npm start
   ```

5. The server runs at `http://localhost:3000` by default.

The database connection is awaited before the server starts. The table is created automatically if it does not already exist.

## Endpoints

| Method | Path | Description | Success status |
|---|---|---|---|
| GET | `/books/` | Retrieve all books. | 200 OK |
| GET | `/books/:bookId/` | Retrieve one book using its ID. | 200 OK |
| POST | `/books/` | Add a book. | 201 Created |
| PUT | `/books/:bookId/` | Replace a book's title, author, price and page count. | 200 OK |
| DELETE | `/books/:bookId/` | Delete a book using its ID. | 200 OK |

### POST and PUT request body

Send JSON with all four fields. `title` and `author` must be non-empty strings; `price` must be a non-negative integer; `pages` must be a positive integer.

```json
{
  "title": "Sample Book",
  "author": "Sample Author",
  "price": 300,
  "pages": 200
}
```

Invalid input returns `400 Bad Request`; a valid ID that does not exist returns `404 Not Found`. Unexpected server/database errors return `500 Internal Server Error`.

## Testing

### Postman

Import `postman_collection.json` into Postman. Start the server and run the requests in this order: Get all books, Get one book, Add a book, Update a book, Delete a book. The collection uses `http://localhost:3000` as its base URL and stores the created ID in a collection variable.

### Automated API test

With the server running in one terminal, open a second terminal and run:

```bash
npm run test:api
```

The script checks all five routes, verifies that a deleted book returns 404, and prints the response status and body. It creates and deletes its own test record.

### SQLite CLI verification

If the SQLite CLI is installed, run:

```bash
sqlite3 books.db
SELECT * FROM book;
.quit
```

Run the SELECT statement again after POST, PUT and DELETE to confirm that the database changes.

## Screenshots

Create a `screenshots/` folder and add genuine screenshots from your own Postman run and SQLite CLI verification. Suggested filenames:

- `get-all-books.png`
- `get-one-book.png`
- `post-book.png`
- `put-book.png`
- `delete-book.png`
- `sqlite-database.png`

Insert them here after capturing:

```md
![GET all books](screenshots/get-all-books.png)
![GET one book](screenshots/get-one-book.png)
![POST book](screenshots/post-book.png)
![PUT book](screenshots/put-book.png)
![DELETE book](screenshots/delete-book.png)
![SQLite database](screenshots/sqlite-database.png)
```

## Notes: problems faced and how they were solved

- The server must not accept requests before the database connection is ready. This is handled by awaiting the SQLite connection inside `initializeDBAndServer()` before calling `app.listen()`.
- User input is passed through `?` placeholders and parameter arrays. This avoids building SQL statements by concatenating user input and helps prevent SQL injection.
- Route handlers use `async/await` so database operations complete before the HTTP response is sent.
- Input validation and appropriate HTTP status codes are used for invalid data and missing book IDs.

## Viva preparation

**1. Why await the database call?**  
`await` pauses the async function until the database operation finishes. This ensures that the application does not use a database connection or query result before it is ready.

**2. What is SQL injection and how do placeholders prevent it?**  
SQL injection is an attack in which malicious input changes the meaning of an SQL query. Parameterised queries keep SQL instructions separate from user-supplied values, so values are treated as data rather than executable SQL.

**3. When is PUT used instead of POST?**  
POST is used to create a new resource. PUT is used to update or replace an existing resource identified by its URL, such as `/books/3/`.

## Git submission checklist

- Place this folder inside the course repository as `lab-02/`.
- Keep the repository public or share it with the faculty.
- Do not commit `node_modules/` or `.env`.
- Commit regularly with meaningful messages.
- Add the real Postman and SQLite screenshots before submission.
