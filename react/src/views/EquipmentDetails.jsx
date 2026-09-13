import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { useBasket } from "../contexts/BasketContext.jsx";

const STATE_STYLES = {
    Available: { label: "Dostupno", className: "chip-success" },
    Dostupno: { label: "Dostupno", className: "chip-success" },
    Damaged: { label: "Oštećeno", className: "chip-warning" },
    Oštećeno: { label: "Oštećeno", className: "chip-warning" },
    WrittenOff: { label: "Otpisano", className: "chip-danger" },
    Otpisano: { label: "Otpisano", className: "chip-danger" },
    Otpisana: { label: "Otpisano", className: "chip-danger" },
};

export default function EquipmentDetails() {
    const {state} = useLocation();
    const navigate = useNavigate();
    const item = state?.item;
    const { addToBasket } = useBasket();
    const [added, setAdded] = useState(false);

    if (!item) {
        return (
            <div className="detail-empty">
                <h3>Oprema nije pronađena.</h3>
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Nazad</button>
            </div>
        );
    }

    const equipmentState = item.equipment_state?.name
        ? STATE_STYLES[item.equipment_state.name] || { label: item.equipment_state.name, className: "chip-neutral" }
        : null;
    const isWrittenOff = ["WrittenOff", "Otpisano", "Otpisana"].includes(item.equipment_state?.name);
    const isOccupied = Boolean(item.is_occupied);
    const isUnavailable = isWrittenOff || isOccupied;
    const unavailableMessage = isOccupied ? "Oprema je trenutno zauzeta." : "Oprema je otpisana i nije dostupna za najam.";
    const detailStatus = isOccupied
        ? { label: "Zauzeto", className: "chip-neutral" }
        : equipmentState;

    const specs = [
        { label: "Vrsta", value: item.equipment_type?.name },
        { label: "Brend", value: item.brand },
        { label: "Model", value: item.model },
        { label: "Veličina", value: item.size },
        { label: "Serijski broj", value: item.serial_number },
        { label: "Barkod", value: item.barcode },
    ].filter(row => row.value);

    const handleAdd = () => {
        if (isUnavailable) return;

        addToBasket(item.id);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    return (
        <div className="detail-page">
            <button className="detail-back" onClick={() => navigate(-1)}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Nazad
            </button>

            <div className={`detail-card ${isWrittenOff ? "detail-card-unavailable" : ""}`}>
                <div className="detail-media">
                    {item.imageurl ? (
                        <img
                            src={`http://localhost:8000/storage/${item.imageurl}`}
                            alt={item.name}
                        />
                    ) : (
                        <div className="detail-media-placeholder">
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>
                        </div>
                    )}
                </div>

                <div className="detail-info">
                    <div className="detail-header">
                        {detailStatus && (
                            <span className={`chip ${detailStatus.className}`}>{detailStatus.label}</span>
                        )}
                        {item.equipment_type?.name && (
                            <span className="detail-eyebrow">{item.equipment_type.name}</span>
                        )}
                        <h1 className="detail-title">{item.name}</h1>
                        <div className="detail-price">
                            {Number(item.price).toFixed(2)} KM<span> / dan</span>
                        </div>
                    </div>

                    {item.description && (
                        <p className="detail-description">{item.description}</p>
                    )}

                    <div className="detail-specs">
                        {specs.map(row => (
                            <div className="detail-spec-row" key={row.label}>
                                <span className="detail-spec-label">{row.label}</span>
                                <span className="detail-spec-value">{row.value}</span>
                            </div>
                        ))}
                    </div>

                    {item.notes && (
                        <p className="detail-notes">
                            <strong>Napomena:</strong> {item.notes}
                        </p>
                    )}

                    <button
                        className={`btn btn-primary detail-cta ${added ? "detail-cta-added" : ""}`}
                        onClick={handleAdd}
                        disabled={isUnavailable}
                    >
                        {isUnavailable ? unavailableMessage : added ? "Dodato u korpu ✓" : "Dodaj u korpu"}
                    </button>
                </div>
            </div>
        </div>
    );
}
