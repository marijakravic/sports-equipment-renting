export default function BasketItemCard({item, onRemove}) {
    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-md-9">
                        <h5>{item.name}</h5>
                        <div>
                            <strong>Sport:</strong> {item.equipment_type?.sport?.name}
                        </div>
                        <div>
                            <strong>Size:</strong> {item.size}
                        </div>
                        <div>
                            <strong>Price:</strong> {item.price} KM
                        </div>
                    </div>
                    <div className="col-md-3 text-end">
                        <button className="btn btn-danger" onClick={() => onRemove(item.id)}>
                            Remove
                        </button>
                    </div>
                </div>
        </div>
    </div>
    );
}
