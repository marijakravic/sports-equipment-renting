import {Link, Navigate, Outlet} from "react-router-dom";
import SearchResults from "./SearchResults.jsx";

export default function Dashboard() {
    return (
        <>
            <Outlet />
        </>
    )
}
