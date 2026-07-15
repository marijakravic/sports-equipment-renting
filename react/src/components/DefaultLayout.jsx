import { useStateContext } from "../contexts/ContextProvider.jsx";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../index.css";
import Navbar from "../contexts/NavBar.jsx";
import cartIcon from "../icons/basket.png";
import userIcon from "../icons/user2.png";
import * as bootstrap from "bootstrap";
import axiosClient from "../axios-client";
import { useState, useEffect } from "react";

export default function DefaultLayout() {
    const {token, setToken} = useStateContext();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

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

    const onLogout = () => {
        axiosClient.post("/logout")
            .finally(() => {
                setToken(null);
                navigate("/dashboard");
            });
    };

    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/dashboard">Dashboard</Link>

                {token && (
                    <Link to="/additems">
                        Dodavanje opreme
                    </Link>
                )}

                <Link to="/sports">Sportovi</Link>
                <Link to="/adults">Odrasli</Link>
                <Link to="/kids">Djeca</Link>

            </aside>

            <div className="content">
                <header>
                    <div id="headerDiv">
                        <div>
                            {token
                                ? "Dobrodošli!"
                                : "Dobrodošli! Ukoliko nemate nalog, nije moguće izvršiti narudžbu!"}
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

                <Navbar
   //                 search={search}
     //               setSearch={setSearch}
                />

                <main>
                    <Outlet context={{ search }} />
                </main>
            </div>
        </div>
    );
}
