"use client";

import { useApp } from "../context/AppContext";
import PriceData from "./PriceData";

export default function LiveData() {
    const { data} = useApp();
    return(
        <>
            {data.map((stock : any) => (
                <PriceData key={stock._id} stock={stock} />
            ))}
        </>
    );
}