export const pad = (n) => String(n).padStart(2, "0");
export const toYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const getLastMonthRange = () => {
    const now = new Date();
    return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1), // 1er du mois précédent
        end: new Date(now.getFullYear(), now.getMonth(), 0),       // jour 0 = dernier jour du mois précédent
    };
};

export const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

export const serverLog = (...logs) => {
    const pad = (n, size = 2) => String(n).padStart(size, '0');
    const time = new Date();
    console.log(`[${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}.${pad(time.getMilliseconds(), 3)}]`, ...logs);
}

export const runAt = (hour, minute, callback) => {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
    
    if (next <= now)
        next.setDate(next.getDate() + 1);

    setTimeout(async () => {
        try { await callback(); } catch (e) { console.error(e); }
        runAt(hour, minute, callback);
    }, next - now);
}

export const dateParser = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}