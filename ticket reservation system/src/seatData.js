export const SEAT_CATEGORIES = {
    VIP: { id: 'vip', name: 'VIP', price: 500, color: 'var(--price-vip)' },
    PREMIUM: { id: 'premium', name: 'Premium', price: 300, color: 'var(--price-premium)' },
    NORMAL: { id: 'normal', name: 'Normal', price: 150, color: 'var(--price-normal)' },
};

export const MOVIE_INFO = {
    title: "Inception: Re-Release",
    time: "Today, 19:30",
    theater: "IMAX 4D, Downtown",
    screen: "Screen 1",
    language: "English",
    certification: "UA"
};

// Helper to generate rows
const createRow = (id, count, category, startIdx = 1) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `${id}${startIdx + i}`,
        row: id,
        number: startIdx + i,
        category: category.id,
        status: Math.random() < 0.2 ? 'occupied' : 'available', // Randomly occupy some seats
        price: category.price
    }));
};

export const SEAT_LAYOUT = [
    { row: 'A', seats: createRow('A', 8, SEAT_CATEGORIES.VIP) },
    { row: 'B', seats: createRow('B', 8, SEAT_CATEGORIES.VIP) },
    { row: 'C', seats: createRow('C', 10, SEAT_CATEGORIES.PREMIUM) },
    { row: 'D', seats: createRow('D', 10, SEAT_CATEGORIES.PREMIUM) },
    { row: 'E', seats: createRow('E', 12, SEAT_CATEGORIES.NORMAL) },
    { row: 'F', seats: createRow('F', 12, SEAT_CATEGORIES.NORMAL) },
    { row: 'G', seats: createRow('G', 12, SEAT_CATEGORIES.NORMAL) },
];
