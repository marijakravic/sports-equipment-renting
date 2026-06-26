import { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";

export default function AddItems() {

    // ---------------- STATE ----------------
    const [sports, setSports] = useState([]);
    const [sport, setSport] = useState("");

    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [equipmentType, setEquipmentType] = useState("");

    const [states, setStates] = useState([]);
    const [condition, setCondition] = useState("");

    const [ages, setAges] = useState([]);
    const [age, setAge] = useState("");

    const [name, setName] = useState("");
    const [size, setSize] = useState("");
    const [description, setDescription] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [price, setPrice] = useState("");

    const [serialNumber, setSerialNumber] = useState("");
    const [barcode, setBarcode] = useState("");
    const [notes, setNotes] = useState("");
    const [internalRegNumber, setInternalRegNumber] = useState("");

    const [image, setImage] = useState(null);

    // ---------------- FETCH DATA ----------------
    useEffect(() => {
        axiosClient.get("/sports").then(({ data }) => setSports(data));
        axiosClient.get("/equipmentTypes").then(({ data }) => setEquipmentTypes(data));
        axiosClient.get("/states").then(({ data }) => setStates(data));
        axiosClient.get("/ages").then(({ data }) => setAges(data));
    }, []);

    // ---------------- SIZE LOGIC ----------------
    const shoeSizes = Array.from({ length: 21 }, (_, i) => i + 25);
    const letterSizes = ["S", "M", "L"];
    const skiSizes = Array.from({ length: 10 }, (_, i) => `${90 + i * 10} cm`);

    const equipmentSizeMap = {
        "Cipele": shoeSizes,
        "Kopačke": shoeSizes,
        "Roleri": shoeSizes,
        "Rolšue": shoeSizes,

        "Kaciga": letterSizes,
        "Naočare": letterSizes,
        "Rukavice": letterSizes,
        "Biciklo": letterSizes,
        "Skejtbord": letterSizes,
        "Trotinet": letterSizes,
        "Kabanica": letterSizes,

        "Skije": skiSizes,
        "Snowboard": skiSizes
    };

    //  FIX: get name from selected ID
    const selectedType = equipmentTypes.find(t => t.id == equipmentType);
    const availableSizes = equipmentSizeMap[selectedType?.name] || [];

    // ---------------- SUBMIT ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("equipment_type_id", equipmentType);
        formData.append("equipment_state_id", condition);
        formData.append("age_id", age);

        formData.append("name", name);
        formData.append("serial_number", serialNumber);
        formData.append("barcode", barcode);
        formData.append("size", size);
        formData.append("price", price);

        formData.append("description", description);
        formData.append("brand", brand);
        formData.append("model", model);
        formData.append("size_type_id", "1");
        formData.append("notes", notes);
        formData.append("internal_registration_number", internalRegNumber);

        if (image) {
            formData.append("imageurl", image);
        }

        try {
            await axiosClient.post("/additems", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            alert("Oprema dodana!");
        } catch (error) {
            console.log(error.response?.data);
        }
    };

    // ---------------- UI ----------------
    return (
        <div className="container mt-5">
            <h2>Dodaj opremu</h2>

            <form onSubmit={handleSubmit}>

                {/* NAME */}
                <div className="mb-3">
                    <label className="form-label">Naziv opreme</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* SPORT */}
                <div className="mb-3">
                    <label className="form-label">Sport</label>
                    <select
                        className="form-control"
                        value={sport}
                        onChange={(e) => setSport(e.target.value)}
                    >
                        <option value="">Izaberi sport</option>
                        {sports.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* EQUIPMENT TYPE */}
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

                {/* AGE */}
                <div className="mb-3">
                    <label className="form-label">Uzrast</label>
                    <select
                        className="form-control"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    >
                        <option value="">Izaberi uzrast</option>
                        {ages.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* SIZE */}
                {availableSizes.length > 0 && (
                    <div className="mb-3">
                        <label className="form-label">Veličina</label>

                        {availableSizes.length > 5 ? (
                            <select
                                className="form-control"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                            >
                                <option value="">Izaberi veličinu</option>
                                {availableSizes.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        ) : (
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

                {/* SERIAL */}
                <div className="mb-3">
                    <label className="form-label">Serijski broj</label>
                    <input
                        type="text"
                        className="form-control"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                    />
                </div>

                {/* BARCODE */}
                <div className="mb-3">
                    <label className="form-label">Barcode</label>
                    <input
                        type="text"
                        className="form-control"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                    />
                </div>

                {/* PRICE */}
                <div className="mb-3">
                    <label className="form-label">Cijena</label>
                    <input
                        type="number"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Interni broj</label>
                    <input
                        type="text"
                        className="form-control"
                        value={internalRegNumber}
                        onChange={(e) => setInternalRegNumber(e.target.value)}
                    />
                </div>

                {/* STATE */}
                <div className="mb-3">
                    <label className="form-label">Stanje</label>
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

                {/* DESCRIPTION */}
                <div className="mb-3">
                    <label className="form-label">Opis</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* BRAND */}
                <div className="mb-3">
                    <label className="form-label">Brend</label>
                    <input
                        type="text"
                        className="form-control"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                    />
                </div>

                {/* MODEL */}
                <div className="mb-3">
                    <label className="form-label">Model</label>
                    <input
                        type="text"
                        className="form-control"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                    />
                </div>

                {/* NOTES */}
                <div className="mb-3">
                    <label className="form-label">Napomena</label>
                    <textarea
                        className="form-control"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                {/* IMAGE */}
                <div className="mb-3">
                    <label className="form-label">Slika</label>
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
