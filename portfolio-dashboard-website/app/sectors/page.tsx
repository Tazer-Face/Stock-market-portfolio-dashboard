"use client";

import React,{ useMemo, useState } from "react";
import { useApp } from "../context/AppContext";

const Sectors = React.memo(function Sectors() {
    const {data} = useApp();

    const [sector,setSector] = useState("Financial Sector")

    const transformData = (x : any)=>{
        let formatted =
        x.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }); 

        return formatted;
    }

    const sendSector = (secData : any)=>{
            setSector(secData);
    }

    const {sectorArr,rawTotalInv,rawPresentVal,gainLoss,totalInv,presentVal,rawPresentValClass,gainLossClass} = useMemo(()=>{
        const sectorArr : any = data.filter(sec => {
            return sec.sector === sector;
        })

        let rawTotalInv = 0;
        let rawPresentVal = 0;
        let gainLoss = 0;

        for(let i=0;i<sectorArr.length;i++){
            rawTotalInv += sectorArr[i].quantity * sectorArr[i].purchasePrice;
            rawPresentVal += (sectorArr[i].quantity * (sectorArr[i].price > 0 ? sectorArr[i].price : sectorArr[i].previousClose));
        }

        if(rawTotalInv > 0){
            gainLoss += (((rawPresentVal - rawTotalInv)/rawTotalInv)*100);
        }

        const totalInv = transformData(rawTotalInv);
        const presentVal = transformData(rawPresentVal);

        let rawPresentValClass = rawPresentVal - rawTotalInv > 0 ? "text-green-600" : "text-red-600";
        let gainLossClass = gainLoss > 0 ? "text-green-600" : "text-red-600";
        
        return {sectorArr,rawTotalInv,rawPresentVal,gainLoss,totalInv,presentVal,rawPresentValClass,gainLossClass};
    },[sector,data]);
    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Sector wise investments</h1>
                    <p className="text-gray-600 mt-2">
                        Overview of your investments by sector.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <button className="bg-white text-2xl rounded-xl font-semibold text-indigo-600 shadow p-5 text-center"
                    onClick={()=>sendSector("Financial Sector")}
                    >
                    Finance
                    </button>
                    <button className="bg-white text-2xl rounded-xl font-semibold text-indigo-600 shadow p-5 text-center"
                    onClick={()=>sendSector("Tech Sector")}
                    >
                    Technology
                    </button>
                    <button className="bg-white text-2xl rounded-xl font-semibold text-indigo-600 shadow p-5 text-center"
                    onClick={()=>sendSector("Consumer")}
                    >
                    Consumer
                    </button>
                    <button className="bg-white text-2xl rounded-xl font-semibold text-indigo-600 shadow p-5 text-center"
                    onClick={()=>sendSector("Power")}
                    >
                    Power
                    </button>
                    <button className="bg-white text-2xl rounded-xl font-semibold text-indigo-600 shadow p-5 text-center"
                    onClick={()=>sendSector("Pipe Sector")}
                    >
                    Pipings
                    </button>
                    <button className="bg-white text-2xl rounded-xl font-semibold text-indigo-600 shadow p-5 text-center"
                    onClick={()=>sendSector("Others")}
                    >
                    Others
                    </button>
                </div>

                <div className="mb-4 mt-14">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4" >{sector}</h3>
                    <h3 className="text-gray-700 mt-8 text-2xl font-semibold">Stocks</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-6 rounded-xl gap-4 mb-8 shadow">
                   {
                    sectorArr.map((item : any)=>
                        <div key={item.name} className="bg-white p-4 m-2 shadow-lg rounded-xl text-center">{item.name}</div>
                        )
                   }
                </div>
                 <div className="mt-8">
                    <h3 className="text-gray-700 mb-6 text-2xl font-semibold">Investment Details</h3>
                    <h5 className="text-xl text-gray-400">Total Investment : ₹  
                        { (rawTotalInv != 0 && !isNaN(rawTotalInv)) ? <span className="text-xl ml-1 text-solid text-blue-600">{totalInv}</span> : "Loading..."}
                    </h5>
                    <h5 className="text-xl mt-4 text-gray-400">Present Value : ₹ 
                        { (rawPresentVal != 0 && !isNaN(rawPresentVal)) ?
                        <span className={`text-xl ml-1 ${rawPresentValClass}`}>
                            {presentVal}
                        </span>
                        : "Loading..."}
                    </h5>
                     <h5 className="text-xl mt-4 text-gray-400">Gain / Loss :
                        { (!isNaN(gainLoss)) ?
                        <span className={`text-xl ml-1 ${gainLossClass}`}>
                            {gainLoss.toFixed(2)}%
                        </span>
                        : "Loading..."}
                    </h5>
                </div>

            </div>
        </main>
    )
});

export default Sectors;