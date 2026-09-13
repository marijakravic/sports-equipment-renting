import {useState} from "react";
import {Navigate} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

const initialWorker = {name: "", surname: "", email: "", phone_number: "", password: "", password_confirmation: ""};

export default function Workers() {
    const {user} = useStateContext();
    const [worker, setWorker] = useState(initialWorker);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    if (user && user.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    const changeField = (event) => setWorker({...worker, [event.target.name]: event.target.value});

    const submit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setMessage("");

        try {
            await axiosClient.post("/workers", worker);
            setWorker(initialWorker);
            setMessage("Profil radnika je uspješno kreiran.");
        } catch (requestError) {
            const errors = requestError.response?.data?.errors;
            setError(errors ? Object.values(errors).flat().join(" ") : requestError.response?.data?.message || "Profil radnika nije moguće kreirati.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="worker-page">
            <div className="worker-card">
                <h1>Dodaj radnika</h1>
                <p>Kreirajte pristupni profil za redovnog radnika.</p>
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={submit} className="row g-3">
                    <div className="col-md-6"><label className="form-label">Ime</label><input className="form-control" name="name" value={worker.name} onChange={changeField} required /></div>
                    <div className="col-md-6"><label className="form-label">Prezime</label><input className="form-control" name="surname" value={worker.surname} onChange={changeField} required /></div>
                    <div className="col-md-6"><label className="form-label">Email</label><input className="form-control" name="email" type="email" value={worker.email} onChange={changeField} required /></div>
                    <div className="col-md-6"><label className="form-label">Telefon</label><input className="form-control" name="phone_number" value={worker.phone_number} onChange={changeField} /></div>
                    <div className="col-md-6"><label className="form-label">Lozinka</label><input className="form-control" name="password" type="password" value={worker.password} onChange={changeField} minLength="8" required /></div>
                    <div className="col-md-6"><label className="form-label">Potvrdi lozinku</label><input className="form-control" name="password_confirmation" type="password" value={worker.password_confirmation} onChange={changeField} minLength="8" required /></div>
                    <div className="col-12"><button className="btn btn-primary" disabled={saving}>{saving ? "Kreiranje..." : "Kreiraj profil radnika"}</button></div>
                </form>
            </div>
        </div>
    );
}
