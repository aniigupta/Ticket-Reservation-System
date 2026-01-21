import './Legend.css';

const Legend = () => {
    return (
        <div className="legend">
            <div className="legend-item">
                <div className="seat-preview available"></div>
                <span>Available</span>
            </div>
            <div className="legend-item">
                <div className="seat-preview selected"></div>
                <span>Selected</span>
            </div>
            <div className="legend-item">
                <div className="seat-preview occupied"></div>
                <span>Sold</span>
            </div>
            <div className="legend-divider"></div>
            <div className="legend-item">
                <div className="seat-preview vip"></div>
                <span>VIP (₹500)</span>
            </div>
            <div className="legend-item">
                <div className="seat-preview premium"></div>
                <span>Premium (₹300)</span>
            </div>
            <div className="legend-item">
                <div className="seat-preview normal"></div>
                <span>Normal (₹150)</span>
            </div>
        </div>
    );
};

export default Legend;
