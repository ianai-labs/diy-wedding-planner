/**
 * Format ISO date string to dd/mm/yyyy
 * @param {string|null} iso - ISO date string like "2027-04-22T00:00:00.000000Z"
 * @returns {string} formatted date "22/04/2027" or "-"
 */
export function formatDate(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '-';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

/**
 * Format number as Indonesian Rupiah
 */
export function formatRp(n) {
    return new Intl.NumberFormat('id-ID').format(n || 0);
}
