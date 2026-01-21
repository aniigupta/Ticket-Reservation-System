import './Seat.css';

const Seat = ({ seat, isSelected, onToggle }) => {
    const isOccupied = seat.status === 'occupied';

    const handleClick = () => {
        if (!isOccupied) {
            onToggle(seat);
        }
    };

    return (
        <div
            className={`seat ${seat.category} ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
            onClick={handleClick}
            role="button"
            tabIndex={isOccupied ? -1 : 0}
            aria-label={`${seat.row}${seat.number} price ${seat.price}`}
        >
        </div>
    );
};

export default Seat;
