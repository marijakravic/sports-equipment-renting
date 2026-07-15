import { useNavigate } from "react-router-dom";

export default function EquipmentCard({ item }) {

    const navigate = useNavigate();

    return (
        <div
            className="card h-100"
            style={{ cursor: "pointer" }}
            onClick={() =>
                navigate(`/equipment/${item.id}`, {
                    state: { item }
                })
            }
        >
            <img
                src={`http://localhost:8000/storage/${item.imageurl}`}
                className="card-img-top"
                alt={item.name}
            />

            <div className="card-body">
                <h5 className="card-title">{item.name}</h5>

                <p className="card-text">
                    Model: {item.model}
                </p>

                <p className="card-text">
                    Brand: {item.brand}
                </p>

                <p className="card-text">
                    Price: {item.price} KM
                </p>

                <p className="card-text">
                    Status: {item.equipment_state?.name}
                </p>

                <p className="card-text">
                    Type: {item.equipment_type?.name}
                </p>
            </div>
        </div>
    );
}
