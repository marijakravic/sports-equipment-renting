export default function EquipmentCard() {
    return (
        <div className="card h-100">
            <img src={item.image} className="card-img-top" alt={item.name} />

            <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.sport}</p>
                <p className="card-text">Size: {item.size}</p>
            </div>
        </div>
    )
}
