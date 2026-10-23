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