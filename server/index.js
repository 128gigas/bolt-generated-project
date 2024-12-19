import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';

const app = express();
const db = new Database('football.db');

app.use(cors());
app.use(express.json());

// Inicializar base de datos
db.exec(`
  CREATE TABLE IF NOT EXISTS clubs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    founded_year INTEGER,
    city TEXT
  );

  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    position TEXT,
    number INTEGER,
    club_id INTEGER,
    FOREIGN KEY(club_id) REFERENCES clubs(id)
  );
`);

// Rutas para clubes
app.get('/api/clubs', (req, res) => {
  const clubs = db.prepare('SELECT * FROM clubs').all();
  res.json(clubs);
});

app.post('/api/clubs', (req, res) => {
  const { name, founded_year, city } = req.body;
  const insert = db.prepare('INSERT INTO clubs (name, founded_year, city) VALUES (?, ?, ?)');
  const result = insert.run(name, founded_year, city);
  res.json({ id: result.lastInsertRowid });
});

// Rutas para jugadores
app.get('/api/players', (req, res) => {
  const players = db.prepare('SELECT * FROM players').all();
  res.json(players);
});

app.post('/api/players', (req, res) => {
  const { name, position, number, club_id } = req.body;
  const insert = db.prepare('INSERT INTO players (name, position, number, club_id) VALUES (?, ?, ?, ?)');
  const result = insert.run(name, position, number, club_id);
  res.json({ id: result.lastInsertRowid });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
