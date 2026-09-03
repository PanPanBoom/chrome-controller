import Database from 'better-sqlite3';

const db = new Database('local.db');

export const getAllShows = () => db.prepare('SELECT * FROM shows').all();

export const saveShow = (showId, episodeInfo) => db.prepare('INSERT INTO shows (id, currentSeason, currentEpisode) VALUES (?, ?, ?)').run(showId, episodeInfo.season, episodeInfo.episode);

export const removeShowById = (id) => db.prepare('DELETE FROM shows WHERE id = ?').run(id);

export const removeShowByTitle = (title) => db.prepare('DELETE FROM shows WHERE title = ?').run(title);

export const getShowById = (id) => db.prepare('SELECT * FROM shows where id = ?').get(id);

export const getShowByTitle = (title) => db.prepare('SELECT * FROM shows WHERE title = ?').get(title);

export const updateNextStartTime = (id, nextStartTime) => db.prepare('UPDATE shows SET nextStartTime = ? WHERE id = ?').run(nextStartTime, id);

export const upsertNextStartTime = (showId, episodeInfo = null, nextStartTime, percentageWatched) => db.prepare('INSERT INTO shows (id, currentSeason, currentEpisode, nextStartTime, percentageWatched) VALUES (?, ?, ?, ?, ?) ON CONFLICT (id) DO UPDATE SET currentSeason = ?, currentEpisode = ?, nextStartTime = ?, percentageWatched = ? WHERE id = ?').run(showId, episodeInfo?.season, episodeInfo?.episode, nextStartTime, percentageWatched, episodeInfo?.season, episodeInfo?.episode, nextStartTime, percentageWatched, showId);

// export const getLaunchInfo

export const getNextStartTime = (id) => db.prepare('SELECT nextStartTime FROM shows WHERE id = ?').get(id)?.nextStartTime;