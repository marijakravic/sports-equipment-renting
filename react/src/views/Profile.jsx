import {useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

const formFromUser = (user) => ({name: user.name || "", surname: user.surname || "", email: user.email || "", phone_number: user.phone_number || "", current_password: "", password: "", password_confirmation: ""});

export default function Profile() {
    const {user, setUser} = useStateContext();
    const [editing, setEditing] = useState(false);
    const [profile, setProfile] = useState(() => formFromUser(user || {}));
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    if (!user) return <p className="text-muted">Učitavanje profila...</p>;

    const changeField = (event) => setProfile({...profile, [event.target.name]: event.target.value});
    const startEditing = () => { setProfile(formFromUser(user)); setEditing(true); setMessage(""); setError(""); };
    const cancelEditing = () => { setProfile(formFromUser(user)); setEditing(false); setError(""); };

    const submit = async (event) => {
        event.preventDefault();
        setSaving(true); setError(""); setMessage("");
        try {
            const {data} = await axiosClient.put("/user", profile);
            setUser(data); setProfile(formFromUser(data)); setEditing(false);
            setMessage("Podaci profila su uspješno sačuvani.");
        } catch (requestError) {
            const errors = requestError.response?.data?.errors;
            setError(errors ? Object.values(errors).flat().join(" ") : requestError.response?.data?.message || "Podatke nije moguće sačuvati.");
        } finally { setSaving(false); }
    };

    return <div className="profile-page"><div className="profile-card">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
            <div><span className="profile-role">{user.role === "admin" ? "Administrator" : "Radnik"}</span><h1>Moj profil</h1></div>
            {!editing && <button className="btn btn-outline-primary" onClick={startEditing}>Uredi profil</button>}
        </div>
        {message && <div className="alert alert-success">{message}</div>}{error && <div className="alert alert-danger">{error}</div>}
        {editing ? <form className="row g-3" onSubmit={submit}>
            <div className="col-md-6"><label className="form-label">Ime</label><input className="form-control" name="name" value={profile.name} onChange={changeField} required /></div>
            <div className="col-md-6"><label className="form-label">Prezime</label><input className="form-control" name="surname" value={profile.surname} onChange={changeField} required /></div>
            <div className="col-md-6"><label className="form-label">Email</label><input className="form-control" type="email" name="email" value={profile.email} onChange={changeField} required /></div>
            <div className="col-md-6"><label className="form-label">Telefon</label><input className="form-control" name="phone_number" value={profile.phone_number} onChange={changeField} /></div>
            <div className="col-12"><hr/><h2 className="h6">Promjena lozinke (opcionalno)</h2></div>
            <div className="col-md-4"><label className="form-label">Trenutna lozinka</label><input className="form-control" type="password" name="current_password" value={profile.current_password} onChange={changeField} /></div>
            <div className="col-md-4"><label className="form-label">Nova lozinka</label><input className="form-control" type="password" name="password" value={profile.password} onChange={changeField} minLength="8" /></div>
            <div className="col-md-4"><label className="form-label">Potvrdi novu lozinku</label><input className="form-control" type="password" name="password_confirmation" value={profile.password_confirmation} onChange={changeField} minLength="8" /></div>
            <div className="col-12 d-flex gap-2"><button className="btn btn-primary" disabled={saving}>{saving ? "Čuvanje..." : "Sačuvaj izmjene"}</button><button className="btn btn-outline-secondary" type="button" onClick={cancelEditing} disabled={saving}>Otkaži</button></div>
        </form> : <dl>
            <div><dt>Ime</dt><dd>{user.name}</dd></div><div><dt>Prezime</dt><dd>{user.surname || "—"}</dd></div><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Telefon</dt><dd>{user.phone_number || "—"}</dd></div>
        </dl>}
    </div></div>;
}
