import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import {useNavigate} from "react-router-dom";

const RESERVATION_LABELS = {
    Zatrazena: "Zatražena",
    Aktivna: "Aktivna",
    Otkazana: "Otkazana",
    Zavrsena: "Završena",
};

const STATE_LABELS = {
    Available: "Dostupno",
    Damaged: "Oštećeno",
    WrittenOff: "Otpisano",
};

const formatDate = (date) => date
    ? new Date(date).toLocaleDateString("sr-Latn-BA", {day: "2-digit", month: "2-digit", year: "numeric"})
    : "—";

export default function Reservations() {
    const {user} = useStateContext();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [states, setStates] = useState([]);
    const [sports, setSports] = useState([]);
    const [filters, setFilters] = useState({from: "", to: "", worker: "", customer: "", status: "", sport: ""});
    const [payment, setPayment] = useState({payment_status: "paid", payment_method: "cash"});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeReservation, setActiveReservation] = useState(null);
    const [returnedItems, setReturnedItems] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        Promise.all([axiosClient.get("/reservations"), axiosClient.get("/states"), axiosClient.get("/sports")])
            .then(([reservationResponse, stateResponse, sportsResponse]) => {
                setReservations(reservationResponse.data);
                setStates(stateResponse.data);
                setSports(sportsResponse.data);
            })
            .catch(() => setError("Rezervacije nije moguće učitati. Pokušajte ponovo."))
            .finally(() => setLoading(false));
    }, []);

    const startCompletion = (reservation) => {
        setActiveReservation(reservation);
        setReturnedItems(reservation.reserved_equipments.map((item) => ({
            id: item.id,
            name: item.name,
            equipment_state_id: item.equipment_state_id,
            notes: item.notes || "",
            price: item.price,
        })));
        setError("");
        setPayment({payment_status: reservation.payment_status || "paid", payment_method: reservation.payment_method || "cash"});
    };

    const updateReturnedItem = (id, field, value) => {
        setReturnedItems((items) => items.map((item) => item.id === id ? {...item, [field]: value} : item));
    };

    const completeReservation = async () => {
        if (!activeReservation) return;

        setSaving(true);
        setError("");
        try {
            const {data} = await axiosClient.put(`/reservations/${activeReservation.id}/complete`, {
                items: returnedItems,
                ...payment,
            });
            setReservations((items) => items.map((item) => item.id === data.id ? data : item));
            setActiveReservation(null);
            setReturnedItems([]);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Promjene nije moguće sačuvati.");
        } finally {
            setSaving(false);
        }
    };

    const changeReservationState = async (reservation, action) => {
        try {
            const {data} = await axiosClient.put(`/reservations/${reservation.id}/${action}`);
            setReservations((items) => items.map((item) => item.id === data.id ? data : item));
        } catch (requestError) { setError(requestError.response?.data?.message || "Status nije moguće promijeniti."); }
    };

    const downloadReceipt = async (reservation) => {
        try {
            const response = await axiosClient.get(`/reservations/${reservation.id}/receipt`, {responseType: "blob"});
            const url = URL.createObjectURL(response.data); const link = document.createElement("a");
            link.href = url; link.download = `racun-${reservation.receipt_number}.pdf`; link.click(); URL.revokeObjectURL(url);
        } catch (requestError) { setError(requestError.response?.data?.message || "Račun nije moguće preuzeti."); }
    };

    const workers = [...new Map(reservations.filter((reservation) => reservation.user).map((reservation) => [reservation.user.id, reservation.user])).values()];
    const filteredReservations = reservations.filter((reservation) => {
        const sportMatches = !filters.sport || reservation.reserved_equipments.some((item) => String(item.equipment_type?.sport?.id) === filters.sport);
        const customer = `${reservation.name} ${reservation.surname} ${reservation.phone}`.toLowerCase();
        return (!filters.from || reservation.reservation_date.slice(0, 10) >= filters.from) && (!filters.to || reservation.return_date.slice(0, 10) <= filters.to) && (!filters.worker || String(reservation.user_id) === filters.worker) && (!filters.customer || customer.includes(filters.customer.toLowerCase())) && (!filters.status || reservation.reservation_state?.name === filters.status) && sportMatches;
    });

    return (
        <div className="reservations-page">
            <div className="reservations-heading">
                <div>
                    <h1>Rezervacije</h1>
                    <p>Pregledajte sve rezervacije i evidentirajte vraćenu opremu.</p>
                </div>
                <span className="reservations-count">{reservations.length} ukupno</span>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            <div className="reservation-filters row g-2 mb-3">
                <div className="col-md-2"><input className="form-control" type="date" value={filters.from} onChange={(e) => setFilters({...filters, from: e.target.value})} /></div><div className="col-md-2"><input className="form-control" type="date" value={filters.to} onChange={(e) => setFilters({...filters, to: e.target.value})} /></div>
                <div className="col-md-2"><select className="form-select" value={filters.worker} onChange={(e) => setFilters({...filters, worker: e.target.value})}><option value="">Svi radnici</option>{workers.map((worker) => <option key={worker.id} value={worker.id}>{worker.name} {worker.surname}</option>)}</select></div>
                <div className="col-md-2"><select className="form-select" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}><option value="">Svi statusi</option>{Object.keys(RESERVATION_LABELS).map((status) => <option key={status} value={status}>{RESERVATION_LABELS[status]}</option>)}</select></div>
                <div className="col-md-2"><select className="form-select" value={filters.sport} onChange={(e) => setFilters({...filters, sport: e.target.value})}><option value="">Svi sportovi</option>{sports.map((sport) => <option key={sport.id} value={sport.id}>{sport.name}</option>)}</select></div><div className="col-md-2"><input className="form-control" placeholder="Kupac" value={filters.customer} onChange={(e) => setFilters({...filters, customer: e.target.value})} /></div>
            </div>

            {loading ? (
                <p className="text-muted">Učitavanje rezervacija...</p>
            ) : filteredReservations.length === 0 ? (
                <div className="reservations-empty">Još nema kreiranih rezervacija.</div>
            ) : (
                <div className="reservations-list">
                    {filteredReservations.map((reservation) => {
                        const stateName = reservation.reservation_state?.name;
                        const completed = stateName === "Zavrsena" || stateName === "Otkazana";

                        return (
                            <article className="reservation-card reservation-card-clickable" key={reservation.id} onClick={() => navigate(`/reservations/${reservation.id}`)}>
                                <div className="reservation-card-head">
                                    <div>
                                        <span className="reservation-id">Rezervacija #{reservation.id}</span>
                                        <h2>{reservation.name} {reservation.surname}</h2>
                                        <p className="reservation-worker">Kreirao/la: {reservation.user ? `${reservation.user.name} ${reservation.user.surname || ""}`.trim() : "—"}</p>
                                        <p>{reservation.phone} {reservation.identification_document && `· ${reservation.identification_document}`}</p>
                                    </div>
                                    <span className={`reservation-state state-${stateName?.toLowerCase() || "unknown"}`}>
                                        {RESERVATION_LABELS[stateName] || stateName || "Nepoznato"}
                                    </span>
                                </div>

                                <div className="reservation-dates">
                                    <div><span>Preuzimanje</span>{formatDate(reservation.reservation_date)}</div>
                                    <div><span>Vraćanje</span>{formatDate(reservation.return_date)}</div>
                                    {reservation.notes && <div><span>Napomena rezervacije</span>{reservation.notes}</div>}
                                </div>

                                <div className="reservation-items">
                                    <h3>Oprema ({reservation.reserved_equipments.length})</h3>
                                    {reservation.reserved_equipments.map((item) => (
                                        <div className="reservation-item" key={item.id}>
                                            <span>{item.name}</span>
                                            <span>{item.equipment_type?.name || "Oprema"}</span>
                                            <span>{STATE_LABELS[item.equipment_state?.name] || item.equipment_state?.name || "—"}</span>
                                            <strong>{Number(item.price).toFixed(2)} KM/dan</strong>
                                        </div>
                                    ))}
                                </div>

                                {user?.role === "admin" && !completed && (
                                    <div className="d-flex gap-2"><button className="btn btn-outline-primary" onClick={(event) => { event.stopPropagation(); changeReservationState(reservation, "activate"); }} disabled={stateName !== "Zatrazena"}>Aktiviraj</button><button className="btn btn-outline-danger" onClick={(event) => { event.stopPropagation(); changeReservationState(reservation, "cancel"); }}>Otkaži</button><button className="btn btn-primary" onClick={(event) => { event.stopPropagation(); startCompletion(reservation); }}>Evidentiraj povratak</button></div>
                                )}
                                {stateName === "Zavrsena" && <div className="mt-3"><span className="me-3"><strong>Plaćanje:</strong> {reservation.payment_status === "paid" ? "Plaćeno" : "Nije plaćeno"}{reservation.payment_method && ` (${reservation.payment_method})`}</span><button className="btn btn-outline-secondary btn-sm" onClick={(event) => { event.stopPropagation(); downloadReceipt(reservation); }}>Preuzmi račun</button></div>}
                            </article>
                        );
                    })}
                </div>
            )}

            {activeReservation && (
                <div className="return-overlay" role="dialog" aria-modal="true" aria-label="Evidencija povratka opreme">
                    <div className="return-dialog">
                        <div className="return-dialog-head">
                            <div>
                                <h2>Povratak opreme — #{activeReservation.id}</h2>
                                <p>Pregledajte i ažurirajte svaku vraćenu stavku prije završetka rezervacije.</p>
                            </div>
                            <button className="btn-close" aria-label="Zatvori" onClick={() => setActiveReservation(null)} />
                        </div>

                        {returnedItems.map((item) => (
                            <div className="return-item-form" key={item.id}>
                                <h3>{item.name}</h3>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label">Stanje</label>
                                        <select className="form-select" value={item.equipment_state_id} onChange={(event) => updateReturnedItem(item.id, "equipment_state_id", event.target.value)}>
                                            {states.map((state) => <option key={state.id} value={state.id}>{STATE_LABELS[state.name] || state.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Cijena po danu (KM)</label>
                                        <input className="form-control" type="number" min="0" step="0.01" value={item.price} onChange={(event) => updateReturnedItem(item.id, "price", event.target.value)} />
                                    </div>
                                    <div className="col-md-5">
                                        <label className="form-label">Napomena o opremi</label>
                                        <input className="form-control" value={item.notes} onChange={(event) => updateReturnedItem(item.id, "notes", event.target.value)} placeholder="Npr. vraćeno bez oštećenja" />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="row g-3 border-top pt-3"><div className="col-md-6"><label className="form-label">Status plaćanja</label><select className="form-select" value={payment.payment_status} onChange={(e) => setPayment({...payment, payment_status: e.target.value})}><option value="paid">Plaćeno</option><option value="unpaid">Nije plaćeno</option></select></div><div className="col-md-6"><label className="form-label">Način plaćanja</label><select className="form-select" value={payment.payment_method} disabled={payment.payment_status === "unpaid"} onChange={(e) => setPayment({...payment, payment_method: e.target.value})}><option value="cash">Gotovina</option><option value="card">Kartica</option><option value="bank_transfer">Bankovni transfer</option></select></div></div>

                        <div className="return-dialog-actions">
                            <button className="btn btn-outline-secondary" onClick={() => setActiveReservation(null)} disabled={saving}>Otkaži</button>
                            <button className="btn btn-success" onClick={completeReservation} disabled={saving}>{saving ? "Čuvanje..." : "Završi rezervaciju"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
