import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EquipmentCard from "../components/EquipmentCard";
import { useLocation } from "react-router-dom";

export default function SportEquipment() {
    const { id } = useParams();
    const location = useLocation();
    const sportName = location.state?.sportName;

    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8000/api/sports/${id}/equipment`)
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => console.error(err));
    }, [id]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4"> Oprema za {sportName}</h2>

            <div className="row">
                {items.map(item => (
                    <div key={item.id} className="col-md-4 mb-4">
                        <EquipmentCard item={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}
