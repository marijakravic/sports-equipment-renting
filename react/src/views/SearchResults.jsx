import { useEffect, useState } from "react";
import {useSearchParams} from "react-router-dom";
import axiosClient from "../axios-client";
import EquipmentCard from "../components/EquipmentCard";

export default function SearchResults() {

    const [equipment, setEquipment] = useState([]);
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search");
    const sport = searchParams.get("sport");
    const age = searchParams.get("age");
    const state = searchParams.get("state");
    const reservationId = searchParams.get("reservation");


    useEffect(() => {
        axiosClient.get("/equipment", {
            params: {
                search,
                sport,
                age,
                state
            }
        })
            .then(({data}) => {
                setEquipment(data);
            })
            .catch(error => {
                console.error(error);
            });

    }, [search, sport, age, state]);


    return (
        <div className="container mt-4">
            {state === "Damaged" && <h1 className="h3">Oštećena oprema</h1>}
            {reservationId && <div className="alert alert-info">Odaberite dostupnu opremu za rezervaciju #{reservationId}.</div>}
            <div className="row mt-4">

                {equipment.length > 0 ? (

                    equipment.map(item => (
                        <div
                            className="col-md-4 mb-4"
                            key={item.id}
                        >
                            <EquipmentCard item={item} reservationId={reservationId}/>
                        </div>
                    ))
                ) : (
                    <p>
                        Nema pronađene opreme.
                    </p>
                )}
            </div>

        </div>
    );
}
