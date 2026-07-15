import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [draftSearch, setDraftSearch] = useState("");

    // Whenever the URL changes, update the input
    useEffect(() => {
        setDraftSearch(searchParams.get("search") ?? "");
    }, [searchParams]);

    function handleSubmit(e) {
        e.preventDefault();

        const params = new URLSearchParams();

        if (draftSearch.trim() !== "") {
            params.set("search", draftSearch.trim());
        }

        searchParams.set("search", params.get("search"));
        navigate(`/equipment?${searchParams.toString()}`);
    }

    return (
        <form onSubmit={handleSubmit}>
            <nav  className="navbar     color: #b3b3b3">
                <div className="container">
                    <div className="mx-auto w-50">
                        <input
                            type="search"
                            value={draftSearch}
                            onChange={(e) => setDraftSearch(e.target.value)}
                            placeholder="Pretraži opremu..."
                            className = "form-control rounded-pill"
                        />
                    </div>
                </div>
            </nav>
        </form>
    );
}
