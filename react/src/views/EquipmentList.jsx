import { useEffect, useState } from "react";
import EquipmentCard from "../components/EquipmentCard";

export default function EquipmentList() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/equipment-items")
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="container mt-4">
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
