import Seat from './Seat';
import './SeatGrid.css';

const SeatGrid = ({ layout, selectedSeats, onSeatClick }) => {
    return (
        <div className="cinema-container">
            <div className="screen-container">
                <div className="screen"></div>
                <p className="screen-text">screen this way</p>
            </div>

            <div className="grid-container">
                {layout.map((row) => (
                    <div key={row.row} className="seat-row">
                        <span className="row-label">{row.row}</span>
                        <div className="seats-in-row">
                            {row.seats.map((seat) => (
                                <Seat
                                    key={seat.id}
                                    seat={seat}
                                    isSelected={selectedSeats.includes(seat.id)}
                                    onToggle={onSeatClick}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeatGrid;
