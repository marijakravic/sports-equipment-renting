export default function BasketItemCard({item, onRemove}) {
    const isWrittenOff = ["WrittenOff", "Otpisano", "Otpisana"].includes(item.equipment_state?.name);

    return (
        <div className={`card shadow-sm mb-3 ${isWrittenOff ? "basket-item-unavailable" : ""}`}>
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-md-9">
                        <h5>{item.name}</h5>
                        {item.is_occupied ? <span className="badge text-bg-secondary mb-2">Zauzeto</span> : isWrittenOff && <span className="badge text-bg-danger mb-2">Otpisano</span>}
                        <div>
                            <strong>Sport:</strong> {item.equipment_type?.sport?.name}
                        </div>
                        <div>
                            <strong>Veličina:</strong> {item.size || "Nije navedena"}
                        </div>
                        <div>
                            <strong>Cijena:</strong> {item.price} KM
                        </div>
                    </div>
                    <div className="col-md-3 text-end">
                        <button className="btn btn-danger" onClick={() => onRemove(item.id)}>
                            Ukloni
                        </button>
                    </div>
                </div>
        </div>
    </div>
    );
}
