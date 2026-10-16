export const pad = (n) => String(n).padStart(2, "0");
export const toYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const getLastMonthRange = () => {
    const now = new Date();
    return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1), // 1er du mois précédent
        end: new Date(now.getFullYear(), now.getMonth(), 0),       // jour 0 = dernier jour du mois précédent
    };
};