const { WebSocketServer } = require("ws");
const yahooFinance = require("yahoo-finance2").default;

module.exports = function (server) {
  const tickers = [
    "HDFCBANK.NS",
    "BAJFINANCE.NS",
    "ICICIBANK.NS",
    "BAJAJHFL.NS",
    "SAVFI.BO",
    "AFFLE.NS",
    "LTIM.NS",
    "KPITTECH.NS",
    "TATATECH.NS",
    "BLSE.NS",
    "TANLA.NS",
    "DMART.NS",
    "TATACONSUM.NS",
    "PIDILITIND.NS",
    "TATAPOWER.NS",
    "KPIGREEN.NS",
    "SUZLON.NS",
    "GENSOL.NS",
    "HARIOMPIPE.NS",
    "ASTRAL.NS",
    "POLYCAB.NS",
    "CLEAN.NS",
    "DEEPAKNTR.NS",
    "FINEORG.NS",
    "GRAVITA.NS",
    "SBILIFE.NS",
  ];

 
  const wss = new WebSocketServer({ server });

  let cachedFinalData = [];
  let cachedErrors = [];
  let lastFetchTime = 0;
  const CACHE_DURATION = 15000;
  wss.on("connection", (ws) => {
    console.log("WS client connected");

    const interval = async () => {
      try {

        const now = Date.now();

        if (now - lastFetchTime < CACHE_DURATION && cachedFinalData) {
          ws.send(JSON.stringify({
            data: cachedFinalData,
            errors: cachedErrors
          }));
          return;
        }

        lastFetchTime = now;
        let errors = []
        let data = {};
        let googleJson = [];

        const yf = new yahooFinance();
        try{
          data = await yf.quote(tickers);
        }
        catch(err){
          console.error("Error fetching Yahoo data:", err);
          errors.push({
            source : "Yahoo Finance",
            message : err.message
          })
          data = {};
        }
        
        try{
          const googleData = await fetch("http://localhost:3001/api/stocks");
          if (!googleData.ok) {
            throw new Error("Google API returned " + googleData.status);
          }
          googleJson = await googleData.json();
          console.log("Google Sheet Data:", googleJson);
        }
        catch(err){
          console.error("Error fetching Google data:", err);
           errors.push({
            source : "Google Sheets",
            message : err.message
          })
          googleJson = [];
        }
        
        const arr = Object.values(data).map((res) => ({
            ticker: res.symbol,
            price: res.regularMarketPrice,
            name: res.shortName,
            previousClose : res.regularMarketPreviousClose,
        }));

        const tickerAlias = {
          "BLS" : "BLSE"
        }
        const normalize = (ticker) =>{
        if (!ticker) return "";
        const t = ticker.split(".")[0].trim().toUpperCase();
        return tickerAlias[t] || t;
        }

        const finalData =arr.map(item => {
          const sheetItem = googleJson.find(
            (sheetRes) => normalize(sheetRes.ticker) === normalize(item.ticker))
            return sheetItem
                    ? { ...item, pe: sheetItem.pe , eps: sheetItem.eps}
                    : item;
        });

        cachedFinalData = finalData;
        cachedErrors = errors;

        console.log(finalData);
        ws.send( JSON.stringify({
          data: finalData,
          error: errors
        }));
      } catch (err) {
        console.error("Error fetching Yahoo and Google data:", err);
      }
    };

    setInterval(interval, 15000);

    ws.on("close", () => clearInterval(interval));
  });
};