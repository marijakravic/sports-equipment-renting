import {useLocation} from "react-router-dom";
import { useBasket } from "../contexts/BasketContext.jsx";

export default function EquipmentDetails() {
    const {state} = useLocation();
    const item = state?.item;
    const { addToBasket, basket } = useBasket();
    console.log(basket);

    if (!item) {
        return (<div className="container mt-5">
            <h3>Equipment not found.</h3>
        </div>);
    }

    return (<div className="container mt-5">
        <div className="row">
            <div className="col-md-5">
                <img
                    src={`http://localhost:8000/storage/${item.imageurl}`}
                    alt={item.name}
                    className="img-fluid rounded shadow"
                />
            </div>
            <div className="col-md-7">
                <h2>{item.name}</h2>
                <hr/>
                <p><strong>Type:</strong> {item.equipment_type?.name}</p>
                <p><strong>Brand:</strong> {item.brand}</p>
                <p><strong>Model:</strong> {item.model}</p>
                <p><strong>Price:</strong> {item.price} KM</p>
                <p><strong>Status:</strong> {item.equipment_state?.name}</p>
                <p><strong>Size:</strong> {item.size}</p>
                <p><strong>Description:</strong></p>
                <p>{item.description}</p>
                <hr/>
                <button
                    onClick={() => {
                        addToBasket(item.id);
                        console.log("Added:", item.id);
                    }}
                >
                    Add to Basket
                </button>

            </div>

        </div>

    </div>);
}
