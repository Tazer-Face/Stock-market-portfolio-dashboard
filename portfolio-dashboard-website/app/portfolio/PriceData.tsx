"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { useApp } from "../context/AppContext";

const priceData = React.memo(function priceData({stock}:any) {

    const investment = useMemo( () =>{
        return stock.purchasePrice * stock.quantity;
    },[stock.purchasePrice, stock.quantity]);

    const currentMarketPrice = useMemo (() =>{
        return stock.price * stock.quantity;
    },[stock.price, stock.quantity]);

    const currMarkPriceClass = useMemo (() =>{
        return stock.price > 0
                    ? stock.price > stock.previousClose ? "text-profit" :
                    stock.price < stock.previousClose ? "text-loss" : ""
                    : ""
    },[stock.price, stock.previousClose]);

    const presentValue = useMemo(() =>{
        return stock.price * stock.quantity;
    },[stock.price, stock.quantity]);

    const presentValueClass = useMemo (() =>{
        return stock.price > 0
                ?(stock.price * stock.quantity) > (stock.purchasePrice * stock.quantity) ? "text-profit" :
                (stock.price * stock.quantity) < (stock.purchasePrice * stock.quantity) ? "text-loss" : ""
                : ""
    },[stock.price, stock.quantity]);

    const gainLoss = useMemo(() =>{
        return (presentValue - investment);
    },[presentValue, investment]);

    const gainLossClass = useMemo (() =>{
        return stock.price > 0
                    ?(presentValue - investment) > 0 ? "text-profit" :
                    (presentValue - investment) < 0 ? "text-loss" : ""
                    : ""
    },[presentValue, investment]);

    const pe = useMemo(() =>{
        return  stock.price >0 ?
                isNaN(stock.pe) ? "-" : stock.pe
                : "Loading...";
    },[stock.pe]);

    const eps = useMemo(() =>{
        return  stock.price >0 ?
                isNaN(stock.eps) ? "-" : stock.eps
                : "Loading...";
    },[stock.eps]);

    return(
        <>
              <TableRow key={stock._id}>
                <TableCell>{stock.name}</TableCell>
                <TableCell>{stock.purchasePrice}</TableCell>
                <TableCell>{stock.quantity}</TableCell>
                <TableCell>{investment}</TableCell>
                <TableCell>{stock.portfolioPer}</TableCell>
                <TableCell>{stock.sec}</TableCell>
                <TableCell className = {currMarkPriceClass}>
                    {stock.price <=0 ? "Loading..." : currentMarketPrice.toFixed(2)}
                </TableCell>
                <TableCell className = {presentValueClass}>
                    {stock.price <=0 ? "Loading..." : presentValue.toFixed(2)}
                </TableCell>
                <TableCell className= {gainLossClass}>
                    { stock.price <=0 ? "Loading..." : gainLoss.toFixed(2)}
                </TableCell>
                <TableCell>
                    {pe}
                </TableCell>
                <TableCell>
                    {eps}
                </TableCell>
            </TableRow>
          </>
    );
});

export default priceData;