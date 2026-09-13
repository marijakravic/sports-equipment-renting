import {useState} from "react";
import {Navigate} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function AddSport() {
    const {user} = useStateContext();
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    if (user && user.role !== "admin") return <Navigate to="/dashboard" replace />;
    const submit = async (event) => { event.preventDefault(); setSaving(true); setError(""); try { const data = new FormData(); data.append("name", name); if (image) data.append("imageurl", image); await axiosClient.post("/sports", data); setName(""); setImage(null); event.target.reset(); setMessage("Sport je uspješno dodan."); } catch (requestError) { setError(requestError.response?.data?.message || "Sport nije moguće dodati."); } finally { setSaving(false); } };
    return <div className="worker-page"><div className="worker-card"><h1>Dodaj sport</h1><p>Dodajte novi sport u katalog.</p>{message && <div className="alert alert-success">{message}</div>}{error && <div className="alert alert-danger">{error}</div>}<form onSubmit={submit} className="row g-3"><div className="col-12"><label className="form-label">Naziv sporta</label><input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required /></div><div className="col-12"><label className="form-label">Slika (opcionalno)</label><input className="form-control" type="file" accept="image/png,image/jpeg" onChange={(e) => setImage(e.target.files[0])} /></div><div className="col-12"><button className="btn btn-primary" disabled={saving}>{saving ? "Dodavanje..." : "Dodaj sport"}</button></div></form></div></div>;
}
