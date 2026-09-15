import { useStateContext } from "../contexts/ContextProvider.jsx";
import { Link, NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../index.css";
import Navbar from "../contexts/NavBar.jsx";
import cartIcon from "../icons/purchase.png";
import userIcon from "../icons/usern.png";
import * as bootstrap from "bootstrap";
import axiosClient from "../axios-client";
import { useEffect } from "react";

export default function DefaultLayout() {
    const {token, user, setToken} = useStateContext();
    const navigate = useNavigate();
    const search = "";

    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll(
            '[data-bs-toggle="tooltip"]'
        );

        const tooltips = [...tooltipTriggerList].map(
            el => new bootstrap.Tooltip(el)
        );

        return () => {
            tooltips.forEach(t => t.dispose());
        };
    }, [token]);
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const onLogout = () => {
        axiosClient.post("/logout")
            .finally(() => {
                setToken(null);
                navigate("/login");
            });
    };

    return (
        <div id="defaultLayout">
            <aside>
                <div className="rail-brand">
                    <div className="rail-brand-mark">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>
                    </div>
                    <div>
                        <div className="rail-brand-text">SportRent</div>
                        <div className="rail-brand-sub">Iznajmljivanje opreme</div>
                    </div>
                </div>

                <NavLink to="/dashboard">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>
                    Dashboard
                </NavLink>

                {token && (
                    <NavLink to="/additems">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                        Dodavanje opreme
                    </NavLink>
                )}

                {user?.role === "admin" && (
                    <NavLink to="/workers">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6M15 15.5c.6-.3 1.3-.5 2-.5 2.2 0 4 1.8 4 4"/></svg>
                        Radnici
                    </NavLink>
                )}

                <NavLink to="/sports">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>
                    Sportovi
                </NavLink>
                {user?.role === "admin" && <NavLink to="/catalogue-management">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M4 12h16M4 17h16"/><circle cx="7" cy="7" r="1"/><circle cx="16" cy="12" r="1"/><circle cx="10" cy="17" r="1"/></svg>
                    Upravljanje katalogom
                </NavLink>}
                <NavLink to="/adults">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7.5" r="3.5"/><path d="M4.5 20c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5"/></svg>
                    Odrasli
                </NavLink>
                <NavLink to="/kids">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8.5" r="2.8"/><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg>
                    Djeca
                </NavLink>
                <NavLink to="/reservations">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect x="3" y="5" width="18" height="16" rx="2"/>
                        <path d="M16 3v4M8 3v4M3 10h18"/>
                        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
                    </svg>                    Rezervacije
                </NavLink>

            </aside>

            <div className="content">
                <header>
                    <div id="headerDiv">
                        <div>
                                {user?.role === "admin" ? "Dobrodošli admin" : user ? `Dobrodošli ${user.name}` : "Dobrodošli!"}
                        </div>
                        <div id="iconsDiv">
                            <Link to={token ? "/profile" : "/signup"}>
                                <img
                                    src={userIcon}
                                    alt="User"
                                    style={{
                                        width: "30px",
                                        cursor: "pointer"
                                    }}
                                    data-bs-toggle="tooltip"
                                    data-bs-title={
                                        token
                                            ? "Moj profil"
                                            : "Kreiraj nalog / Prijavi se"
                                    }
                                />
                            </Link>

                            <img
                                src={cartIcon}
                                alt="Shopping Cart"
                                style={{
                                    width: "30px",
                                    cursor: "pointer"
                                }}
                                data-bs-toggle="tooltip"
                                data-bs-title="Korpa"
                                onClick={() => navigate("/basket")}
                            />

                            {token && (
                                <button
                                    className="btn btn-outline-danger btn-sm ms-2"
                                    onClick={onLogout}
                                >
                                    Odjava
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                <Navbar/>
                <main>
                    <Outlet context={{ search }} />
                </main>
            </div>
        </div>
    );
}
