import Database from 'better-sqlite3';

const db = new Database('local.db');

export const getAllShows = () => db.prepare('SELECT * FROM shows ORDER BY lastUpdate DESC').all();

export const getShowsByFilter = (filter) => db.prepare("SELECT * FROM shows WHERE id LIKE ? ORDER BY lastUpdate DESC").all(filter + '%');

export const saveShow = (showId, episodeInfo) => db.prepare('INSERT INTO shows (id, currentSeason, currentEpisode, lastUpdate) VALUES (?, ?, ?, ?)').run(showId, episodeInfo.season, episodeInfo.episode, Date.now());

export const removeShowById = (id) => db.prepare('DELETE FROM shows WHERE id = ?').run(id);

export const removeShowByTitle = (title) => db.prepare('DELETE FROM shows WHERE title = ?').run(title);

export const getShowById = (id) => db.prepare('SELECT * FROM shows where id = ?').get(id);

export const getShowByTitle = (title) => db.prepare('SELECT * FROM shows WHERE title = ?').get(title);

export const updateNextStartTime = (id, nextStartTime) => db.prepare('UPDATE shows SET nextStartTime = ?, lastUpdate = ? WHERE id = ?').run(nextStartTime, Date.now(), id);

export const upsertNextStartTime = (showId, episodeInfo = null, nextStartTime, percentageWatched) => {
    const now = Date.now();
    return db.prepare('INSERT INTO shows (id, currentSeason, currentEpisode, nextStartTime, percentageWatched, lastUpdate) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO UPDATE SET currentSeason = ?, currentEpisode = ?, nextStartTime = ?, percentageWatched = ?, lastUpdate = ? WHERE id = ?').run(showId, episodeInfo?.season, episodeInfo?.episode, nextStartTime, percentageWatched, now, episodeInfo?.season, episodeInfo?.episode, nextStartTime, percentageWatched, now, showId);
} 

// export const getLaunchInfo

export const getNextStartTime = (id) => db.prepare('SELECT nextStartTime FROM shows WHERE id = ?').get(id)?.nextStartTime;