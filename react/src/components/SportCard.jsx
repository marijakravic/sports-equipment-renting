import { Link } from "react-router-dom";

export default function SportCard({ sport }) {
    return (
        <Link
            to={`/equipment?sport=${sport.id}`}
            state={{ sportName: sport.name }}
            className="text-decoration-none text-dark"
        >
            <div className="card h-100 shadow-sm">
                <img
                    src={`http://localhost:8000/storage/${sport.imageurl}`}
                    className="card-img-top"
                    alt={sport.name}
                />

                <div className="card-body text-center">
                    <h5>{sport.name}</h5>
                </div>
            </div>
        </Link>
    );
}
