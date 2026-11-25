import Database from 'better-sqlite3';

const db = new Database('local.db');

export const getAllShows = () => db.prepare('SELECT * FROM shows ORDER BY lastUpdate DESC').all();

export const getShowsByPage = (page, nbElements = 20) => db.prepare('SELECT * FROM shows LIMIT ? OFFSET ?').all(nbElements, (page - 1) * nbElements);

export const getMaxPage = (nbElements = 20) => Math.max(Math.trunc(db.prepare('SELECT count(*) / ? FROM shows;').all(nbElements).values()[0]), 1);

export const getShowsByFilter = (filter) => db.prepare("SELECT * FROM shows WHERE id LIKE ? ORDER BY lastUpdate DESC").all(filter + '%');

export const saveShow = (showId, episodeInfo) => db.prepare('INSERT INTO shows (id, currentSeason, currentEpisode, lastUpdate) VALUES (?, ?, ?, ?)').run(showId, episodeInfo.season, episodeInfo.episode, Date.now());

export const removeShowById = (id) => db.prepare('DELETE FROM shows WHERE id = ?').run(id);

export const removeShowByTitle = (title) => db.prepare('DELETE FROM shows WHERE title = ?').run(title);

export const getShowById = (id) => db.prepare('SELECT * FROM shows where id = ?').get(id);

export const getShowByTitle = (title) => db.prepare('SELECT * FROM shows WHERE title = ?').get(title);

export const updateNextStartTime = (id, nextStartTime) => db.prepare('UPDATE shows SET nextStartTime = ?, lastUpdate = ? WHERE id = ?').run(nextStartTime, Date.now(), id);

export const upsertNextStartTime = (showId, episodeInfo = null, nextStartTime, percentageWatched, imgPath) => {
    const now = Date.now();
    return db.prepare('INSERT INTO shows (id, currentSeason, currentEpisode, nextStartTime, percentageWatched, imgPath, lastUpdate) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO UPDATE SET currentSeason = ?, currentEpisode = ?, nextStartTime = ?, percentageWatched = ?, imgPath = ?, lastUpdate = ? WHERE id = ?').run(showId, episodeInfo?.season, episodeInfo?.episode, nextStartTime, percentageWatched, imgPath, now, episodeInfo?.season, episodeInfo?.episode, nextStartTime, percentageWatched, imgPath, now, showId);
} 

// export const getLaunchInfo

export const getNextStartTime = (id) => db.prepare('SELECT nextStartTime FROM shows WHERE id = ?').get(id)?.nextStartTime;