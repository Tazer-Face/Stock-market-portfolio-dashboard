"use client";

import React, { createContext, use, useContext, useEffect, useRef, useState } from "react";

interface AppContextType {
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider ({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any[]>([]);
  const errorShownRef = useRef(false);
  useEffect(() => {
    const getData = async () => {
      try {
        let dbData: any[]= [];
        try{
            const res = await fetch("http://localhost:3000/api/stocks/findAllStocks", {
              cache: "force-cache",
            });
            if (!res.ok) {
              throw new Error("Failed to fetch stocks");
            }
            dbData = await res.json();
        }catch(err){
            console.error("Initial fetch error:", err);
            if (!errorShownRef.current) {
              alert("⚠ Failed to fetch initial stock data.");
              errorShownRef.current = true;
            }
            dbData = [];
        }
        
        setData(dbData);
        console.log("Fetched stocks data:", dbData);

        const ws = new WebSocket("ws://localhost:4005");
        ws.onopen = () => {
            console.log("WebSocket connection established Yo");
        };
        ws.onmessage = (event) => {

            const msg = JSON.parse(event.data);
            const updates = msg.data || [];
            const errors = msg.errors || [];

            if (errors.length > 0 && !errorShownRef.current) {
              alert("⚠ Some live market data failed. Showing partial results.");
              errorShownRef.current = true;
            }

            errors.forEach((err : any) => {
              console.warn(`⚠ Backend error (${err.source}): ${err.message}`);
            });

            console.log("Received updates:", updates);
            setData((prev : any) =>
                prev.map((stock : any) => {
                const found = updates.find((u : any) => u.ticker === stock.ticker);
                return found
                    ? { ...stock, price: found.price , previousClose: found.previousClose , pe: found.pe , eps: found.eps }
                    : stock;
                })
            );
        };

      } catch (err) {
        console.error("Error fetching stocks data:", err);
      }
    };

    getData();
    
    }, []);
  return (
    <AppContext.Provider value={{ data, setData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
