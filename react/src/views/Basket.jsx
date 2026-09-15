import {useEffect, useState} from "react";
import {useBasket} from "../contexts/BasketContext.jsx";
import axiosClient from "../axios-client.js";
import BasketItemCard from "../components/BasketItemCard.jsx";

export default function Basket() {
    const [items, setItems] = useState([]);
    const { basket, removeFromBasket, clearBasket } = useBasket();
    const [reservation, setReservation] = useState({
        startDate: "", endDate: "", name: "", surname: "", contact: "", personalDocument: ""
    });
    const [submitting, setSubmitting] = useState(false);

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
    const unavailableItems = items.filter((item) => item.equipment_state?.name === "WrittenOff" || Boolean(item.is_occupied));
    const hasUnavailableItems = unavailableItems.length > 0;
    const dailyPrice = items.reduce((sum, item) => sum + Number(item.price), 0);
    const rentalDays = (() => {
        if (!reservation.startDate || !reservation.endDate) return 0;
        const start = new Date(`${reservation.startDate}T00:00:00`);
        const end = new Date(`${reservation.endDate}T00:00:00`);
        if (end < start) return 0;
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    })();
    const totalPrice = dailyPrice * rentalDays;
    const handleChange = (e) => {
        setReservation({
            ...reservation, [e.target.name]: e.target.value
        });
    };
    const handleReserve = async () => {
        if (items.length === 0) {
            alert("Korpa je prazna.");
            return;
        }

        const payload = {
            reservation_date: reservation.startDate,
            return_date: reservation.endDate,
            name: reservation.name,
            surname: reservation.surname,
            phone: reservation.contact,
            identification_document: reservation.personalDocument || null,
            equipment_item_ids: items.map(item => item.id)
        };

        setSubmitting(true);
        try {
            await axiosClient.post("/reservations", payload);
            alert("Rezervacija je uspješno kreirana!");
            clearBasket();
            setReservation({
                startDate: "", endDate: "", name: "", surname: "", contact: "", personalDocument: ""
            });
        } catch (error) {
            console.log(error.response?.data);
            const message = error.response?.data?.message || "Greška prilikom kreiranja rezervacije.";
            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (<div className="container mt-4">
        <h2 className="mb-4">
            Korpa
        </h2>
        {hasUnavailableItems && (
            <div className="alert alert-secondary">
                Zauzeta ili otpisana oprema se ne može rezervisati. Uklonite je iz korpe da biste nastavili.
            </div>
        )}
        {items.map(item => (<BasketItemCard
            key={item.id}
            item={item}
            onRemove={removeItem}
        />))}
        <div className="card mt-4">
            <div className="card-header">
                Podaci za rezervaciju
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label>Početak rezervacije</label>
                        <input
                            type="date"
                            className="form-control"
                            name="startDate"
                            value={reservation.startDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Kraj rezervacije</label>
                        <input
                            type="date"
                            className="form-control"
                            name="endDate"
                            value={reservation.endDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Ime</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={reservation.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Prezime</label>
                        <input
                            type="text"
                            className="form-control"
                            name="surname"
                            value={reservation.surname}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Kontakt telefon</label>
                        <input
                            type="text"
                            className="form-control"
                            name="contact"
                            value={reservation.contact}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Lični dokument</label>
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
                <h4>Ukupno po danu: {dailyPrice.toFixed(2)} KM</h4>
                <p className="mb-1">Broj dana najma: {rentalDays || "—"}</p>
                <h4>Ukupna cijena: {totalPrice.toFixed(2)} KM</h4>
                <button
                    className="btn btn-success mt-3"
                    onClick={handleReserve}
                    disabled={submitting || rentalDays === 0 || hasUnavailableItems}
                >
                    {submitting ? "Slanje..." : "Rezerviši"}
                </button>
            </div>
        </div>
    </div>);
}
