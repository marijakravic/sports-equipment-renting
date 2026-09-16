import { useNavigate } from "react-router-dom";
import {useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

const STATE_STYLES = {
    Available: { label: "Dostupno", className: "chip-success" },
    Dostupno: { label: "Dostupno", className: "chip-success" },
    Damaged: { label: "Oštećeno", className: "chip-warning" },
    Oštećeno: { label: "Oštećeno", className: "chip-warning" },
    WrittenOff: { label: "Otpisano", className: "chip-danger" },
    Otpisano: { label: "Otpisano", className: "chip-danger" },
    Otpisana: { label: "Otpisano", className: "chip-danger" },
};

export default function EquipmentCard({ item, reservationId = null }) {
    const navigate = useNavigate();
    const {user} = useStateContext();
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState("");
    const isWrittenOff = ["WrittenOff", "Otpisano", "Otpisana"].includes(item.equipment_state?.name);
    const isOccupied = Boolean(item.is_occupied);
    const state = item.equipment_state?.name
        ? STATE_STYLES[item.equipment_state.name] || {
        label: item.equipment_state.name,
        className: "chip-neutral",
    }
        : null;
    const cardStatus = isOccupied
        ? { label: "Zauzeto", className: "chip-neutral" }
        : state;
    const meta = [item.brand, item.model].filter(Boolean).join(" · ");
    const addToReservation = async (event) => {
        event.stopPropagation();
        setAdding(true); setError("");
        try {
            await axiosClient.post(`/reservations/${reservationId}/equipment-items`, {equipment_item_id: item.id});
            navigate(`/reservations/${reservationId}`);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Opremu nije moguće dodati rezervaciji.");
        } finally { setAdding(false); }
    };

    return (
        <div
            className={`equipment-card ${isWrittenOff ? "equipment-card-unavailable" : ""}`}
            onClick={() =>
                navigate(`/equipment/${item.id}`, { state: { item } })
            }
        >
            <div className="equipment-card-media">
                {item.imageurl ? (
                    <img
                        src={`http://localhost:8000/storage/${item.imageurl}`}
                        alt={item.name}
                    />
                ) : (
                    <div className="equipment-card-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>
                    </div>
                )}
                {cardStatus && (
                    <span className={`chip ${cardStatus.className} equipment-card-chip`}>
                        {cardStatus.label}
                    </span>
                )}
            </div>

            <div className="equipment-card-body">
                {item.equipment_type?.name && (
                    <div className="equipment-card-eyebrow">{item.equipment_type.name}</div>
                )}
                <h3 className="equipment-card-title">{item.name}</h3>
                <p className="equipment-card-meta">{meta || " "}</p>
                <p className="equipment-card-size">Veličina: {item.size || "Nije navedena"}</p>
                <div className="equipment-card-footer">
                    <span className="equipment-card-price">
                        {Number(item.price).toFixed(2)} KM<span> / dan</span>
                    </span>
                    <div className="equipment-card-actions">
                        {reservationId && user && <button className="btn btn-primary btn-sm" onClick={addToReservation} disabled={adding || isWrittenOff || isOccupied}>{adding ? "Dodavanje..." : "Dodaj"}</button>}
                        {user?.role === "admin" && <button className="btn btn-outline-secondary btn-sm equipment-card-edit" onClick={(event) => { event.stopPropagation(); navigate(`/equipment/${item.id}/edit`); }}>Uredi</button>}
                    </div>
                </div>
                {error && <p className="equipment-card-error">{error}</p>}
            </div>
        </div>
    );
}
