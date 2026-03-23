import {useStateContext} from "../contexts/ContextProvider.jsx";
import {Link, Navigate, Outlet} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../index.css";
import Navbar from "../contexts/NavBar.jsx";
import cartIcon from "../icons/basket.png";
import userIcon from "../icons/user2.png";
import { useEffect } from "react";
import * as bootstrap from "bootstrap";

export default function DefaultLayout() {

    useEffect(() => {
        const tooltipTriggerList =
            document.querySelectorAll('[data-bs-toggle="tooltip"]');

        tooltipTriggerList.forEach(el => {
            new bootstrap.Tooltip(el);
        });
    }, []);

    const {token} = useStateContext()

    if (!token) {
        return (
            <div id="defaultLayout">
                <aside>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/sports">Sportovi</Link>
                    <Link to="/men">Muškarci</Link>
                    <Link to="/women">Žene</Link>
                    <Link to="/kids">Djeca</Link>
                </aside>
                <div className="content">
                    <header>
                        <div id="headerDiv">
                            <div>
                                Dobrodošli! Ukoliko nemate nalog, nije moguće izvršiti narudžbu!
                            </div>
                            <div id="iconsDiv">
                                <Link to="/signup">
                                    <img
                                        src={userIcon}
                                        alt="User"
                                        style={{ width: "30px", cursor: "pointer" }}
                                        data-bs-toggle="tooltip"
                                        data-bs-title={token
                                            ? "Moj profil"
                                            : "Kreiraj nalog / Prijavi se"}
                                    />
                                </Link>
                                <img
                                    src={cartIcon}
                                    alt="Shopping Cart"
                                    style={{ width: "30px", cursor: "pointer" }}
                                    data-bs-toggle="tooltip"
                                    data-bs-title="Korpa"
                                />
                            </div>
                        </div>
                    </header>
                    <Navbar />
                    <main>
                        <Outlet/>
                    </main>

                </div>
            </div>
        );
    }
    else {
        return (
            <div id="defaultLayout">
                <aside>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/additems">Dodavanje opreme</Link>
                    <Link to="/sports">Sportovi</Link>
                    <Link to="/men">Muskarci</Link>
                    <Link to="/women">Zene</Link>
                </aside>
                <div className="content">
                    <header>
                        <div id="headerDiv">
                            <div>
                                Dobrodošli!
                            </div>
                            <div id="iconsDiv">
                                <Link to="/signup">
                                    <img
                                        src={userIcon}
                                        alt="User"
                                        style={{ width: "30px", cursor: "pointer" }}
                                        data-bs-toggle="tooltip"
                                        data-bs-title={token
                                            ? "Moj profil"
                                            : "Kreiraj nalog / Prijavi se"}
                                    />
                                </Link>
                                <img
                                    src={cartIcon}
                                    alt="Shopping Cart"
                                    style={{ width: "30px", cursor: "pointer" }}
                                    data-bs-toggle="tooltip"
                                    data-bs-title="Korpa"
                                />
                            </div>
                        </div>
                    </header>
                    <Navbar />
                    <main>
                        <Outlet/>
                    </main>

                </div>
            </div>
        );
    }
}
