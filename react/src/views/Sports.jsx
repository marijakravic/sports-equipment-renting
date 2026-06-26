import { useEffect, useState } from "react";
import SportCard from "../components/SportCard";

export default function Sports() {
    const [sports, setSports] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/sports")
            .then((res) => res.json())
            .then((data) => setSports(data))
            .catch((err) => console.error("Error fetching sports:", err));
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                {sports.map((sport) => (
                    <div key={sport.id} className="col-md-4 col-lg-3 mb-4">
                        <SportCard sport={sport} />
                    </div>
                ))}
            </div>
        </div>
    );
}
