import {useEffect, useState} from "react";
import {useBasket} from "../contexts/BasketContext.jsx";
import axiosClient from "../axios-client.js";
import BasketItemCard from "../components/BasketItemCard.jsx";

export default function Basket() {
    const [items, setItems] = useState([]);
    const { basket, removeFromBasket } = useBasket();
    const [reservation, setReservation] = useState({
        startDate: "", endDate: "", name: "", surname: "", contact: "", personalDocument: ""
    });

    useEffect(() => {

        if (basket.length === 0) {
            setItems([]);
            return;
        }
        console.log("Basket IDs:", basket);
        axiosClient.post("/basket", { ids: basket })
            .then(({ data }) => {
                console.log("Returned items:", data);
                setItems(data);
            })
            .catch(console.error);
    }, [basket]);

    const removeItem = (id) => {
        removeFromBasket(id);
    };
    const totalPrice = items.reduce((sum, item) => sum + Number(item.price), 0);
    const handleChange = (e) => {
        setReservation({
            ...reservation, [e.target.name]: e.target.value
        });
    };
    const handleReserve = () => {
        const data = {
            ...reservation, items
        };
        console.log(data);
        // axiosClient.post("/reservations", data)
    };

    return (<div className="container mt-4">
            <h2 className="mb-4">
                Basket
            </h2>
            {items.map(item => (<BasketItemCard
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                />))}
            <div className="card mt-4">
                <div className="card-header">
                    Reservation Information
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Start date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="startDate"
                                value={reservation.startDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>End date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="endDate"
                                value={reservation.endDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={reservation.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Surname</label>
                            <input
                                type="text"
                                className="form-control"
                                name="surname"
                                value={reservation.surname}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Contact</label>
                            <input
                                type="text"
                                className="form-control"
                                name="contact"
                                value={reservation.contact}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Personal document</label>
                            <input
                                type="text"
                                className="form-control"
                                name="personalDocument"
                                value={reservation.personalDocument}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <hr/>
                    <h4>Total price: {totalPrice} KM</h4>
                    <button
                        className="btn btn-success mt-3"
                        onClick={handleReserve}
                    >
                        Reserve
                    </button>
                </div>
            </div>
        </div>);
}
