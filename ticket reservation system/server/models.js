import mongoose from 'mongoose';

const SeatSchema = new mongoose.Schema({
    id: { type: String, required: true },
    row: { type: String, required: true },
    number: { type: Number, required: true },
    category: { type: String, required: true }, // 'vip', 'premium', 'normal'
    status: { type: String, default: 'available', enum: ['available', 'occupied', 'selected'] },
    price: { type: Number, required: true },
});

const EventSchema = new mongoose.Schema({
    title: String,
    time: String,
    theater: String,
    screen: String,
    language: String,
    certification: String,
    seats: [SeatSchema] // Embedding seats for simplicity in this MVP
});

export const Event = mongoose.model('Event', EventSchema);
