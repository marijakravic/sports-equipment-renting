import { useEffect, useState } from "react";
import {useLocation, useSearchParams} from "react-router-dom";
import axiosClient from "../axios-client";
import EquipmentCard from "../components/EquipmentCard";

export default function SearchResults() {

    const [equipment, setEquipment] = useState([]);
    const [searchParams] = useSearchParams();
    const location = useLocation();



    const search = searchParams.get("search");
    const sport = searchParams.get("sport");
    const age = searchParams.get("age");


    useEffect(() => {
        axiosClient.get("/equipment", {
            params: {
                search,
                sport,
                age
            }
        })
            .then(({data}) => {
                setEquipment(data);
            })
            .catch(error => {
                console.error(error);
            });

    }, [search, sport, age]);


    return (
        <div className="container mt-4">
            <div className="row mt-4">

                {equipment.length > 0 ? (

                    equipment.map(item => (
                        <div
                            className="col-md-4 mb-4"
                            key={item.id}
                        >
                            <EquipmentCard item={item}/>
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
