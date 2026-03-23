function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom">
            <div className="container" id="navDiv">
                {/* Search Bar */}
                <form className="d-flex mx-auto w-50" role="search"  id="navForm">
                    <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Pretražite"
                        aria-label="Search"
                    />
                    <button id="btnNav" type="submit">
                        Pretraga
                    </button>
                </form>

            </div>
        </nav>
    );
}

export default Navbar;
