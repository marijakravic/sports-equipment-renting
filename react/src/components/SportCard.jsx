import { Link } from "react-router-dom";

export default function SportCard({ sport, reservationId }) {
    return (
        <Link
            to={`/equipment?sport=${sport.id}${reservationId ? `&reservation=${reservationId}` : ""}`}
            state={{ sportName: sport.name }}
            className="sport-card"
        >
            <div className="sport-card-media">
                {sport.imageurl ? (
                    <img
                        src={`http://localhost:8000/storage/${sport.imageurl}`}
                        alt={sport.name}
                    />
                ) : (
                    <div className="sport-card-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>
                    </div>
                )}
            </div>
            <div className="sport-card-label">{sport.name}</div>
        </Link>
    );
}
