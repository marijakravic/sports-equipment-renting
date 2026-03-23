import { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
export default function AddItems() {

    // ---------------- STATE ----------------
    const [sports, setSports] = useState([]);
    const [sport, setSport] = useState("");

    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [equipmentType, setEquipmentType] = useState("");

    const [genders, setGenders] = useState([]);
    const [gender, setGender] = useState("");

    const [states, setStates] = useState([]);
    const [condition, setCondition] = useState("");

    const [size, setSize] = useState("");
    const [description, setDescription] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");

    const [serialNumber, setSerialNumber] = useState("");
    const [barcode, setBarcode] = useState("");
    const [notes, setNotes] = useState("");

    const [image, setImage] = useState(null);

    useEffect(() => {
        axiosClient.get("/sports").then(({data}) => setSports(data));
        axiosClient.get("/equipmentTypes").then(({data}) => setEquipmentTypes(data));
        axiosClient.get("/genders").then(({data}) => setGenders(data));
        axiosClient.get("/states").then(({data}) => setStates(data));
    }, []);

        const genderOptions = ["Muškarci", "Žene", "Djeca", "Unisex"];
        const shoeSizes = Array.from({ length: 21 }, (_, i) => i + 25);
        const letterSizes = ["S", "M", "L"];
        const skiSizes = Array.from({ length: 10 }, (_, i) => `${90 + i * 10} cm`);

        const equipmentSizeMap = {
            // 25–45
            "Cipele": shoeSizes,
            "Kopačke": shoeSizes,
            "Roleri": shoeSizes,
            "Rolšue": shoeSizes,

            // S M L
            "Kaciga": letterSizes,
            "Naočare": letterSizes,
            "Rukavice": letterSizes,
            "Biciklo": letterSizes,
            "Skejtbord": letterSizes,
            "Trotinet": letterSizes,
            "Kabanica": letterSizes,

            // cm sizes
            "Skije": skiSizes,
            "Snowboard": skiSizes
        };
        const availableSizes = equipmentSizeMap[equipmentType] || [];
        // ---------------- HANDLERS ----------------
        const handleSubmit = async (e) => {
            e.preventDefault();

            const formData = new FormData();

            formData.append("sport_id", sport);
            formData.append("equipment_type_id", equipmentType);
            formData.append("gender_id", gender);
            formData.append("size", size);
            formData.append("description", description);
            formData.append("brand", brand);
            formData.append("price", price);
            formData.append("state_id", condition);

            formData.append("serial_number", serialNumber);
            formData.append("barcode", barcode);
            formData.append("notes", notes);

            if (image) {
                formData.append("image", image);
            }

            try {
                await axiosClient.post("/additems", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                alert("Oprema dodana!");
            } catch (error) {
                console.error(error);
            }
        };

        // ---------------- UI ----------------
        return (
            <div className="container mt-5">
                <h2>Dodaj opremu</h2>

                <form onSubmit={handleSubmit}>
                    {/* 1. SPORT */}
                    <div className="mb-3">
                        <label className="form-label">Sport</label>
                        <select
                            className="form-control"
                            onChange={(e) => {
                                setSport(e.target.value);
                                axiosClient.get("/equipmentTypes/"+e.target.value).then(({data}) => setEquipmentTypes(data));
                            }}
                            >
                            <option value="">Izaberi sport</option>
                            {sports.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* 2. EQUIPMENT TYPE */}
                    <div className="mb-3">
                        <label className="form-label">Vrsta opreme</label>
                        <select
                            className="form-control"
                            value={equipmentType}
                            onChange={(e) => {
                                setEquipmentType(e.target.value);
                                setSize("");
                            }}
                        >
                            <option value="">Izaberi vrstu opreme</option>

                            {equipmentTypes.map((eq) => (
                                <option key={eq.id} value={eq.id}>
                                    {eq.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* 5. SIZE (dynamic input type) */}
                    {availableSizes.length > 0 && (
                        <div className="mb-3">
                            <label className="form-label">Veličina</label>
                            {/* MANY OPTIONS → SELECT LIST */}
                            {availableSizes.length > 5 ? (
                                <select
                                    className="form-control"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                >
                                    <option value="">Izaberi veličinu</option>
                                    {availableSizes.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                /* FEW OPTIONS → RADIO BUTTONS */
                                <div className="d-flex gap-4">
                                    {availableSizes.map((s) => (
                                        <label key={s}>
                                            <input
                                                type="radio"
                                                name="size"
                                                value={s}
                                                checked={size === s}
                                                onChange={(e) => setSize(e.target.value)}
                                            />
                                            {" "}{s}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {/* 3. GENDER */}
                    <div className="mb-3">
                        <label className="form-label">Za</label>
                        <select
                            className="form-control"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">Izaberi pol</option>
                            {genders.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 6. DESCRIPTION */}
                    <div className="mb-3">
                        <label className="form-label">Opis opreme</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* 7. BRAND */}
                    <div className="mb-3">
                        <label className="form-label">Marka</label>
                        <input
                            type="text"
                            placeholder="Unesi marku(brend)..."
                            className="form-control"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        />
                    </div>
                    {/* SERIJSKI BROJ */}
                    <div className="mb-3">
                        <label className="form-label">Serijski broj</label>
                        <input
                            type="text"
                            className="form-control"
                            value={serialNumber}
                            onChange={(e) => setSerialNumber(e.target.value)}
                        />
                    </div>
                    {/* BAR KOD */}
                    <div className="mb-3">
                        <label className="form-label">Barcode</label>
                        <input
                            type="text"
                            className="form-control"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                        />
                    </div>
                    {/* NAPOMENA */}
                    <div className="mb-3">
                        <label className="form-label">Napomena</label>
                        <textarea
                            className="form-control"
                            rows="2"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    {/* CIJENA */}
                    <div className="mb-3">
                        <label className="form-label">Cijena (KM)</label>
                        <input
                            type="number"
                            placeholder="Unesi cijenu..."
                            className="form-control"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    {/* STANJE */}
                    <div className="mb-3">
                        <label className="form-label">Stanje opreme</label>
                        <select
                            className="form-control"
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                        >
                            <option value="">Izaberi stanje</option>

                            {states.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* SLIKA */}
                    <div className="mb-3">
                        <label className="form-label">Slika opreme</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>

                    <button className="btn btn-primary">
                        Unesi opremu
                    </button>

                </form>
            </div>
        );
}
