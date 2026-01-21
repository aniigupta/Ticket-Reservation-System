import './BookingSummary.css';

const BookingSummary = ({ selectedSeats, layout, onBook }) => {
    // Flatten layout to find seat details easily
    const allSeats = layout.flatMap(row => row.seats);

    const selectedSeatDetails = allSeats.filter(seat => selectedSeats.includes(seat.id));
    const totalPrice = selectedSeatDetails.reduce((sum, seat) => sum + seat.price, 0);

    return (
        <div className="booking-summary">
            <div className="summary-details">
                <h3>Booking Summary</h3>
                <p className="summary-info">Selected Seats: <span>{selectedSeatDetails.length}</span></p>

                {selectedSeatDetails.length > 0 && (
                    <div className="selected-list">
                        {selectedSeatDetails.map(seat => (
                            <span key={seat.id} className="summary-tag">
                                {seat.row}{seat.number}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="total-action">
                <div className="total-price">
                    <span>Total Price</span>
                    <h2>₹{totalPrice}</h2>
                </div>
                <button
                    className="book-btn"
                    disabled={selectedSeats.length === 0}
                    onClick={onBook}
                >
                    Book Ticket
                </button>
            </div>
        </div>
    );
};

export default BookingSummary;
