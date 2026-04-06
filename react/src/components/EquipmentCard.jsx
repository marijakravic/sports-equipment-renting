export default function EquipmentCard({item}) {
    return (
        <div className="card h-100">
            <img src={item.image} className="card-img-top" alt={item.name} />

            <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.model}</p>
                <p className="card-text">Price: {item.price}</p>
            </div>
        </div>
    );
}

