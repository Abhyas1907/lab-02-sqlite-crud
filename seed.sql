CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price INTEGER NOT NULL CHECK(price >= 0),
  pages INTEGER NOT NULL CHECK(pages > 0)
);

INSERT INTO book (title, author, price, pages) VALUES
('The Alchemist', 'Paulo Coelho', 350, 208),
('Wings of Fire', 'A. P. J. Abdul Kalam', 280, 180),
('Atomic Habits', 'James Clear', 499, 320),
('The Guide', 'R. K. Narayan', 250, 220),
('Ikigai', 'Hector Garcia', 399, 194),
('Deep Work', 'Cal Newport', 450, 296),
('The Blue Umbrella', 'Ruskin Bond', 180, 180),
('The Hobbit', 'J. R. R. Tolkien', 550, 310),
('Think Like a Monk', 'Jay Shetty', 425, 352),
('Rich Dad Poor Dad', 'Robert Kiyosaki', 399, 336);
