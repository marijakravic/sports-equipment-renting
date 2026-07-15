import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosClient from "../axios-client";
import EquipmentCard from "../components/EquipmentCard";

export default function EquipmentList() {
    const [items, setItems] = useState([]);
    const [searchParams] = useSearchParams();

    const sportId = searchParams.get("sport");
    const search = searchParams.get("search");

    useEffect(() => {
        axiosClient
            .get(`/equipment`, {
                params: {
                    search: search,
                    sport: sportId
                }
            })
            .then(({ data }) => setItems(data))
            .catch(err => console.error(err));
    }, [search, sportId]);

    return (
        <div className="container mt-4">
            <div className="row">
                {items.length > 0 ? (
                    items.map(item => (
                        <div key={item.id} className="col-md-4 mb-4">
                            <EquipmentCard item={item} />
                        </div>
                    ))
                ) : (
                    <p>No equipment found.</p>
                )}
            </div>
        </div>
    );
}
