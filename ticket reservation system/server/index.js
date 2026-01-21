import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { Event } from './models.js';

dotenv.config({ path: '../.env' }); // Load from parent directory

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(process.cwd(), 'dist')));

// Constants for Seeding
const SEAT_CATEGORIES = {
    VIP: { id: 'vip', name: 'VIP', price: 500 },
    PREMIUM: { id: 'premium', name: 'Premium', price: 300 },
    NORMAL: { id: 'normal', name: 'Normal', price: 150 },
};

const createRow = (id, count, category, startIdx = 1) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `${id}${startIdx + i}`,
        row: id,
        number: startIdx + i,
        category: category.id,
        status: 'available', // Default to available for persistent storage
        price: category.price
    }));
};

const INITIAL_SEAT_LAYOUT = [
    ...createRow('A', 8, SEAT_CATEGORIES.VIP),
    ...createRow('B', 8, SEAT_CATEGORIES.VIP),
    ...createRow('C', 10, SEAT_CATEGORIES.PREMIUM),
    ...createRow('D', 10, SEAT_CATEGORIES.PREMIUM),
    ...createRow('E', 12, SEAT_CATEGORIES.NORMAL),
    ...createRow('F', 12, SEAT_CATEGORIES.NORMAL),
    ...createRow('G', 12, SEAT_CATEGORIES.NORMAL),
];

const MOVIE_INFO = {
    title: "Inception: Re-Release",
    time: "Today, 19:30",
    theater: "IMAX 4D, Downtown",
    screen: "Screen 1",
    language: "English",
    certification: "UA"
};

// ---------------------------------------------------------
// MOCK DATA STORE (Fallback if no DB)
// ---------------------------------------------------------
let useMockData = false;
let mockEvent = {
    ...MOVIE_INFO,
    seats: JSON.parse(JSON.stringify(INITIAL_SEAT_LAYOUT)) // Deep copy
};

// Connect to MongoDB
// Connect to MongoDB
if (!MONGO_URI) {
    console.log('------------------------------------------------');
    console.log('NOTICE: No MONGO_URI environment variable found.');
    console.log('Starting in IN-MEMORY MOCK MODE immediately.');
    console.log('------------------------------------------------');
    useMockData = true;

    // Initialize mock data
    mockEvent.seats.forEach(seat => {
        if (Math.random() < 0.2) seat.status = 'occupied';
    });
} else {
    mongoose.connect(MONGO_URI)
        .then(() => {
            console.log('MongoDB Connected');
            seedData();
        })
        .catch(err => {
            console.error('MongoDB Connection Error:', err);
            console.log('------------------------------------------------');
            console.log('WARNING: Switching to IN-MEMORY MOCK MODE.');
            console.log('Data will NOT be persisted/saved to a database.');
            console.log('------------------------------------------------');
            useMockData = true;

            // Randomly occupy some seats in mock data for realism
            mockEvent.seats.forEach(seat => {
                if (Math.random() < 0.2) seat.status = 'occupied';
            });
        });
}

// Seed Data
const seedData = async () => {
    try {
        const count = await Event.countDocuments();
        console.log('Current event count:', count);
        if (count === 0) {
            console.log('Seeding initial data...');
            const event = new Event({
                ...MOVIE_INFO,
                seats: INITIAL_SEAT_LAYOUT
            });
            // Randomly occupy some seats for realism
            event.seats.forEach(seat => {
                if (Math.random() < 0.2) seat.status = 'occupied';
            });
            await event.save();
            console.log('Data seeded successfully.');
        } else {
            console.log('Database already has data.');
        }
    } catch (err) {
        console.error('Error seeding data:', err);
    }
};

// Helper: Format seats into rows (Shared logic)
const formatSeatsForFrontend = (seatList) => {
    const rows = {};
    seatList.forEach(seat => {
        if (!rows[seat.row]) rows[seat.row] = [];
        rows[seat.row].push(seat);
    });
    return Object.keys(rows).sort().map(rowKey => ({
        row: rowKey,
        seats: rows[rowKey].sort((a, b) => a.number - b.number)
    }));
};

// Routes
app.get('/api/seats', async (req, res) => {
    try {
        let seats = [];
        if (useMockData) {
            seats = mockEvent.seats;
        } else {
            const event = await Event.findOne();
            if (event) seats = event.seats;
        }

        const layout = formatSeatsForFrontend(seats);
        res.json(layout);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/book', async (req, res) => {
    const { seatIds } = req.body;

    if (!seatIds || !Array.isArray(seatIds)) {
        return res.status(400).json({ message: 'Invalid seat selection' });
    }

    try {
        if (useMockData) {
            // Mock Mode Logic
            const seatsToBook = mockEvent.seats.filter(s => seatIds.includes(s.id));
            if (seatsToBook.length !== seatIds.length) {
                return res.status(400).json({ message: 'Invalid seat IDs found.' });
            }
            const unavailbleSeat = seatsToBook.find(s => s.status !== 'available');
            if (unavailbleSeat) {
                return res.status(409).json({ message: `Seat ${unavailbleSeat.row}${unavailbleSeat.number} is no longer available.` });
            }
            // Update
            mockEvent.seats.forEach(seat => {
                if (seatIds.includes(seat.id)) seat.status = 'occupied';
            });
            return res.json({ message: 'Booking successful (Mock)', bookedSeats: seatIds });
        }

        // MongoDB Logic
        const event = await Event.findOne();
        if (!event) throw new Error('Event not found');

        // 1. Verify all seats are available
        const seatsToBook = event.seats.filter(s => seatIds.includes(s.id));

        if (seatsToBook.length !== seatIds.length) {
            return res.status(400).json({ message: 'Invalid seat IDs found.' });
        }

        const unavailbleSeat = seatsToBook.find(s => s.status !== 'available');
        if (unavailbleSeat) {
            return res.status(409).json({ message: `Seat ${unavailbleSeat.row}${unavailbleSeat.number} is no longer available.` });
        }

        // 2. Mark them as occupied
        seatIds.forEach(id => {
            const seat = event.seats.find(s => s.id === id);
            if (seat) seat.status = 'occupied';
        });

        // 3. Save
        await event.save();

        res.json({ message: 'Booking successful', bookedSeats: seatIds });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Reset for testing
app.post('/api/reset', async (req, res) => {
    await Event.deleteMany({});
    await seedData();
    res.json({ message: 'Reset successful' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// specific handling for React's client-side routing
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});
