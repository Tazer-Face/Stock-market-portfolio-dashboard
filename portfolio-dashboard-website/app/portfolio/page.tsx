import React, { useMemo } from "react";

import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead
  } from "@/components/ui/table";
import LiveData from "./liveData";
import HeaderLiveDataWrapper from "./headerLiveDataWrapper";


export default async function PortfolioPage() {

  let data : any[]= [];
  try {
    const res = await fetch("http://localhost:3000/api/stocks/findAllStocks", {
      cache: "force-cache",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch stocks");
    }

    data = await res.json();
    console.log("Fetched stocks data:", data);

  } catch (err) {
    console.error("Error fetching stocks data:", err);
    alert("⚠ Failed to fetch stock data. Please try again later.");
    data = [];
  }

  const investedVal = data.reduce((sum, s) => sum + s.purchasePrice * s.quantity, 0)

  const formatted = investedVal.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Overview of your investment performance and allocations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Invested Value</p>
            <p className="text-2xl  text-gray-500">₹ <span className="text-2xl font-semibold text-indigo-600">{formatted}</span></p>
          </div>
          <HeaderLiveDataWrapper />
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">Holdings</p>
            <p className="text-2xl font-semibold text-gray-900">{data.length}</p>
          </div>
        </div>

        <section className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Portfolio Holdings</h2>
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Purchase Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Invested</TableHead>
              <TableHead>Portfolio %</TableHead>
              <TableHead>Stock exchange code</TableHead>
              <TableHead>CMP</TableHead>
              <TableHead>Present Value</TableHead>
              <TableHead>Gain/Loss</TableHead>
              <TableHead>P/E Ratio</TableHead>
              <TableHead>Latest Earnings</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <LiveData />
          </TableBody>
        </Table>
        </section>
      </div>
    </main>
  );
}