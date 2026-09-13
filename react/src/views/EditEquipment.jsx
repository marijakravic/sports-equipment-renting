import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axiosClient from "../axios-client.js";

const STATE_LABELS = {Available: "Dostupno", Damaged: "Oštećeno", WrittenOff: "Otpisano"};

export default function EditEquipment() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [types, setTypes] = useState([]);
    const [states, setStates] = useState([]);
    const [ages, setAges] = useState([]);
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        Promise.all([axiosClient.get(`/equipment-items/${id}`), axiosClient.get("/equipmentTypes"), axiosClient.get("/states"), axiosClient.get("/ages")])
            .then(([itemResponse, typesResponse, statesResponse, agesResponse]) => {
                setItem(itemResponse.data); setTypes(typesResponse.data); setStates(statesResponse.data); setAges(agesResponse.data);
            }).catch(() => setError("Podatke o opremi nije moguće učitati."));
    }, [id]);

    const updateField = (field, value) => setItem((current) => ({...current, [field]: value}));
    const save = async (event) => {
        event.preventDefault(); setSaving(true); setError("");
        const formData = new FormData();
        ["equipment_type_id", "equipment_state_id", "age_id", "name", "serial_number", "barcode", "size", "price", "description", "brand", "model", "notes", "internal_registration_number", "size_type_id"].forEach((field) => formData.append(field, item[field] ?? ""));
        formData.append("_method", "PUT"); if (image) formData.append("imageurl", image);
        try { await axiosClient.post(`/equipment-items/${id}`, formData, {headers: {"Content-Type": "multipart/form-data"}}); navigate(`/equipment/${id}`); }
        catch (requestError) { const errors = requestError.response?.data?.errors; setError(errors ? Object.values(errors).flat().join(" ") : requestError.response?.data?.message || "Promjene nije moguće sačuvati."); }
        finally { setSaving(false); }
    };

    if (!item) return <div className="detail-empty"><p>{error || "Učitavanje opreme..."}</p><button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Nazad</button></div>;
    return <div className="form-card"><h1 className="form-card-title">Uredi opremu</h1><p className="form-card-subtitle">Izmijenite podatke za stavku #{item.id}.</p>{error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={save}><div className="form-card-grid">
            <Field label="Naziv opreme" value={item.name} onChange={(value) => updateField("name", value)} full />
            <Select label="Vrsta opreme" value={item.equipment_type_id} onChange={(value) => updateField("equipment_type_id", value)} options={types} />
            <Select label="Stanje" value={item.equipment_state_id} onChange={(value) => updateField("equipment_state_id", value)} options={states} labelFor={(option) => STATE_LABELS[option.name] || option.name} />
            <Select label="Uzrast" value={item.age_id} onChange={(value) => updateField("age_id", value)} options={ages} />
            <Field label="Veličina" value={item.size} onChange={(value) => updateField("size", value)} />
            <Field label="Cijena po danu (KM)" type="number" value={item.price} onChange={(value) => updateField("price", value)} />
            <Field label="Serijski broj" value={item.serial_number} onChange={(value) => updateField("serial_number", value)} />
            <Field label="Barkod" value={item.barcode} onChange={(value) => updateField("barcode", value)} />
            <Field label="Interni broj" value={item.internal_registration_number} onChange={(value) => updateField("internal_registration_number", value)} />
            <Field label="Brend" value={item.brand} onChange={(value) => updateField("brand", value)} />
            <Field label="Model" value={item.model} onChange={(value) => updateField("model", value)} />
            <Field label="Opis" value={item.description} onChange={(value) => updateField("description", value)} full textarea />
            <Field label="Napomena" value={item.notes} onChange={(value) => updateField("notes", value)} full textarea />
            <div className="form-card-field full"><label>Nova slika (opcionalno)</label><input className="form-control" type="file" accept="image/png,image/jpeg" onChange={(event) => setImage(event.target.files[0] || null)} /></div>
            <div className="form-card-actions gap-2"><button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)} disabled={saving}>Otkaži</button><button className="btn btn-primary" disabled={saving}>{saving ? "Čuvanje..." : "Sačuvaj promjene"}</button></div>
        </div></form></div>;
}

function Field({label, value, onChange, full = false, type = "text", textarea = false}) {
    return <div className={`form-card-field ${full ? "full" : ""}`}><label>{label}</label>{textarea ? <textarea className="form-control" value={value || ""} onChange={(event) => onChange(event.target.value)} /> : <input required={label !== "Veličina" && label !== "Brend" && label !== "Model"} className="form-control" type={type} min={type === "number" ? "0" : undefined} step={type === "number" ? "0.01" : undefined} value={value || ""} onChange={(event) => onChange(event.target.value)} />}</div>;
}
function Select({label, value, onChange, options, labelFor = (option) => option.name}) {
    return <div className="form-card-field"><label>{label}</label><select required className="form-select" value={value || ""} onChange={(event) => onChange(event.target.value)}><option value="">Izaberite</option>{options.map((option) => <option key={option.id} value={option.id}>{labelFor(option)}</option>)}</select></div>;
}
