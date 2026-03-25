import Database from 'better-sqlite3';

const db = new Database('local.db');

export const getAllShows = () => db.prepare('SELECT * FROM shows').all();

export const saveShow = (showData) => db.prepare('INSERT INTO shows (id, title, img, link, overview) VALUES (?, ?, ?, ?, ?)').run(showData.id, showData.title, showData.img, showData.link, showData.overview);

export const removeShowById = (id) => db.prepare('DELETE FROM shows WHERE id = ?').run(id);

export const removeShowByTitle = (title) => db.prepare('DELETE FROM shows WHERE title = ?').run(title);

export const getShowById = (id) => db.prepare('SELECT * FROM shows where id = ?').get(id);

export const getShowByTitle = (title) => db.prepare('SELECT * FROM shows WHERE title = ?').get(title);