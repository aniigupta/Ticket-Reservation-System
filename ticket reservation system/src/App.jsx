import { useEffect, useState } from 'react';
import './App.css';
import BookingSummary from './components/BookingSummary';
import Legend from './components/Legend';
import SeatGrid from './components/SeatGrid';
import { MOVIE_INFO } from './seatData';

function App() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatLayout, setSeatLayout] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/seats');
      const data = await response.json();
      setSeatLayout(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching seats:', error);
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
    } else {
      if (selectedSeats.length >= 8) {
        alert("You can only select up to 8 seats");
        return;
      }
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const handleBooking = async () => {
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seatIds: selectedSeats }),
      });

      if (response.ok) {
        alert("Booking Successful!");
        setSelectedSeats([]);
        fetchSeats(); // Refresh data to show occupied seats
      } else {
        const errorData = await response.json();
        alert(`Booking Failed: ${errorData.message}`);
        fetchSeats(); // Refresh to mitigate sync issues
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert("An error occurred while booking.");
    }
  };

  if (loading) return <div className="loading">Loading Theater...</div>;

  return (
    <div className="app">
      <header className="header">
        <div className="movie-details">
          <h1>{MOVIE_INFO.title}</h1>
          <p className="subtitle">{MOVIE_INFO.theater} • {MOVIE_INFO.screen}</p>
          <div className="tags">
            <span className="tag">{MOVIE_INFO.language}</span>
            <span className="tag">{MOVIE_INFO.certification}</span>
            <span className="time-badge">{MOVIE_INFO.time}</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Legend />
        <SeatGrid
          layout={seatLayout}
          selectedSeats={selectedSeats}
          onSeatClick={handleSeatClick}
        />
      </main>

      <BookingSummary
        selectedSeats={selectedSeats}
        layout={seatLayout}
        onBook={handleBooking} // Reusing the component, need to update it to accept onBook prop
      />
    </div>
  );
}

export default App;
