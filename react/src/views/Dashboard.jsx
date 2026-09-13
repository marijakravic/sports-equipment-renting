import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

const STATE_LABELS = {
    Available: "Dostupno",
    Damaged: "Oštećeno",
    WrittenOff: "Otpisano",
};

const STATE_CHIP = {
    Available: "chip-success",
    Damaged: "chip-danger",
    WrittenOff: "chip-neutral",
};

const getStateName = (item) => item.equipment_state?.name?.trim().toLowerCase();
const isAvailable = (item) => ["available", "dostupno"].includes(getStateName(item));
const isDamaged = (item) => ["damaged", "oštećeno", "osteceno"].includes(getStateName(item));

export default function Dashboard() {
    const {user} = useStateContext();
    const [equipment, setEquipment] = useState([]);
    const [sports, setSports] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        Promise.all([
            axiosClient.get("/equipment-items"),
            axiosClient.get("/sports"),
        ])
            .then(([equipmentRes, sportsRes]) => {
                setEquipment(equipmentRes.data);
                setSports(sportsRes.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const available = equipment.filter(isAvailable).length;
    const damaged = equipment.filter(isDamaged).length;
    const recent = [...equipment].sort((a, b) => b.id - a.id).slice(0, 5);

    const today = new Date().toLocaleDateString("sr-Latn-BA", {
        weekday: "long", day: "numeric", month: "long"
    });

    return (
        <div className="dash">
            <div className="dash-hero">
                <div className="dash-hero-mark">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>
                </div>
                <div>
                    <div className="dash-hero-date">{today}</div>
                    <h1 className="dash-hero-title">Dobrodošli nazad</h1>
                    <p className="dash-hero-sub">Pregled stanja inventara i brze akcije za tim.</p>
                </div>
            </div>

            <div className="dash-kpis">
                <div className="dash-kpi">
                    <div className="dash-kpi-label">Ukupno opreme</div>
                    <div className="dash-kpi-value">{loading ? "—" : equipment.length}</div>
                </div>
                <div className="dash-kpi">
                    <div className="dash-kpi-label">Dostupno</div>
                    <div className="dash-kpi-value dash-kpi-success">{loading ? "—" : available}</div>
                </div>
                <Link to="/equipment?state=Damaged" className="dash-kpi dash-kpi-link">
                    <div className="dash-kpi-label">Oštećena oprema</div>
                    <div className="dash-kpi-value dash-kpi-danger">{loading ? "—" : damaged}</div>
                </Link>
                <div className="dash-kpi">
                    <div className="dash-kpi-label">Sportova u ponudi</div>
                    <div className="dash-kpi-value">{loading ? "—" : sports.length}</div>
                </div>
            </div>


            <div className="dash-grid">
                <div className="dash-panel">
                    <div className="dash-panel-head">
                        <h2>Poslednje dodata oprema</h2>
                        <Link to="/additems" className="dash-panel-link">+ Dodaj opremu</Link>
                    </div>

                    {!loading && recent.length === 0 && (
                        <p className="dash-empty">Još uvijek nema unesene opreme.</p>
                    )}

                    {recent.map(item => (
                        <div className="dash-row" key={item.id}>
                            <div className="dash-row-info">
                                <div className="dash-row-name">{item.name}</div>
                                <div className="dash-row-meta">
                                    {[item.equipment_type?.name, item.brand].filter(Boolean).join(" · ")}
                                </div>
                            </div>
                            {item.equipment_state?.name && (
                                <span className={`chip ${STATE_CHIP[item.equipment_state.name] || "chip-neutral"}`}>
                                    {STATE_LABELS[item.equipment_state.name] || item.equipment_state.name}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="dash-side">
                    <div className="dash-panel">
                        <div className="dash-panel-head">
                            <h2>Brze akcije</h2>
                        </div>

                        <Link to="/additems" className="dash-action">
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                            Dodaj novu opremu
                        </Link>
                        {user?.role === "admin" && <Link to="/sports/new" className="dash-action">
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg>
                            Dodaj novi sport
                        </Link>}
                        <Link to="/sports" className="dash-action">
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>
                            Pregled po sportovima
                        </Link>
                        <Link to="/basket" className="dash-action">
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/><path d="M2.5 3h2l2.7 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 7H6"/></svg>
                            Otvori korpu
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
