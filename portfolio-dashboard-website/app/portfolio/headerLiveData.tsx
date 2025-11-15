"use client";

import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";

function HeaderLiveDataComponent() {
  const { data } = useApp();

  const { currentValue, investment, gains, currentValueFormatted } = useMemo(() => {
    let currentValue = 0;
    let investment = 0;

    for (const stock of data) {
      const cmp = stock.price > 0 ? stock.price : stock.previousClose;
      currentValue += cmp * stock.quantity;
      investment += stock.purchasePrice * stock.quantity;
    }

    const gains =
      investment > 0
        ? (((currentValue - investment) / investment) * 100)
        : 0;

    const currentValueFormatted = currentValue.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return { currentValue, investment, gains, currentValueFormatted };
  }, [data]);

  return (
    <>
      <div className="bg-white rounded-xl shadow p-5">
        <p className="text-sm text-gray-500">Current Value</p>
        <p className="text-2xl text-gray-500">
          ₹{" "}
          <span
            className={`text-2xl font-semibold ${
              currentValueFormatted.startsWith("-") ? "text-red-600" : "text-green-600"
            }`}
          >
            {currentValue > 0  ? currentValueFormatted : "Loading..."}
          </span>
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <p className="text-sm text-gray-500">Total Gain</p>
        <p
          className={`text-2xl font-semibold ${
            gains.toFixed(2).startsWith("-") ? "text-red-600" : "text-green-600"
          }`}
        >
          {investment > 0 && !isNaN(gains) ? `${gains.toFixed(2)}%` : "Loading..."}
        </p>
      </div>
    </>
  );
};

const HeaderLiveData = React.memo(HeaderLiveDataComponent);
export default HeaderLiveData;
