import { useState, useEffect } from "react";
import moment from "moment";

//87415af659b7493afc2e4786d6ff3856
const FMP_API_KEY = "87415af659b7493afc2e4786d6ff3856";
const FINNHUB_API_KEY = "caa8f3aad3ibg8176o30";
const POLYGON_API_KEY = "GAqlho8ubQ0dMfcHU_hBqGYZr0YpQdem";

//Get the list of nasdaq 100 companies by fetching data from FMP API
async function getStocks() {
  let res = await fetch(
    `https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${FMP_API_KEY}`
  );

  let data = await res.json();
  return data.map((stock) => {
    return {
      symbol: stock.symbol,
      name: stock.name,
      sector: stock.sector,
    };
  });
}

//Get the a company's overview by fetching data from FMP API
async function getOverview(symbol) {
  let res = await fetch(
    `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_API_KEY}`
  );
  let data = await res.json();
  return {
    companyName: data[0].name,
    price:
      typeof data[0].price === "number" ? data[0].price.toFixed(2) : "N/A",
    changesPercentage:
      typeof data[0].changesPercentage === "number"
        ? data[0].changesPercentage.toFixed(2)
        : "N/A",
    change:
      typeof data[0].change === "number"
        ? data[0].change.toFixed(2)
        : "N/A",
    dayRange:
      typeof data[0].dayLow === "number" &&
      typeof data[0].dayHigh === "number"
        ? data[0].dayLow.toFixed(2) + " - " + data[0].dayHigh.toFixed(2)
        : "N/A",
    yearRange:
      typeof data[0].yearLow === "number" &&
      typeof data[0].yearHigh === "number"
        ? data[0].yearLow.toFixed(2) + " - " + data[0].yearHigh.toFixed(2)
        : "N/A",
    marketCap:
      typeof data[0].marketCap === "number" ? data[0].marketCap : "N/A",
    volume: typeof data[0].volume === "number" ? data[0].volume : "N/A",
    avgVolume:
      typeof data[0].avgVolume === "number" ? data[0].avgVolume : "N/A",
    open:
      typeof data[0].open === "number" ? data[0].open.toFixed(2) : "N/A",
    previousClose:
      typeof data[0].previousClose === "number"
        ? data[0].previousClose.toFixed(2)
        : "N/A",
    eps: typeof data[0].eps === "number" ? data[0].eps.toFixed(2) : "N/A",
    pe: typeof data[0].pe === "number" ? data[0].pe.toFixed(2) : "N/A",
    earningsAnnouncement:
      data[0].earningsAnnouncement !== null
        ? data[0].earningsAnnouncement.split("T")[0]
        : "N/A",
    sharesOutstanding:
      data[0].sharesOutstanding !== null
        ? data[0].sharesOutstanding
        : "N/A",
  };
}

//Get the stocks' current price by fetching data from FINNHUB API
async function getPrice(watchList) {
  let priceData = {};

  for (let i = 0; i < watchList.length; i++) {
    let res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${watchList[i]}&token=${FINNHUB_API_KEY}`
    );
    let data = await res.json();
    priceData[watchList[i]] = {
      current: data.c.toFixed(2),
      percentChange: data.dp.toFixed(2),
    };
  }

  return priceData;
}

//Get the company's chart data by fetching data from Polygon API
async function getChart(symbol) {
  let startDate = moment().subtract(100, "days").format("YYYY-MM-DD");
  let endDate = moment().format("YYYY-MM-DD");

  let res = await fetch(
    `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=desc&limit=120&apiKey=${POLYGON_API_KEY}`
  );

  let data = await res.json();
  let arrayData = [];
  data.results.map((price) => {
    arrayData.push({
      timestamp: price.t,
      value: price.o,
    });
  });
  return arrayData.reverse();
}

//Get the stocks row data, sector options, the loading state, and the error message
function useStocks() {
  const [stocksRowData, setStocksRowData] = useState([]);
  const [stocksLoading, setStocksLoading] = useState(true);
  const [stocksApiError, setStocksApiError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  function stocksRefreshing() {
    setRefresh((refresh) => !refresh);
    setStocksLoading(true);
    setStocksApiError(null);
  }

  //Fetch the data from API
  useEffect(async () => {
    try {
      setStocksRowData(await getStocks());
      setStocksLoading(false);
    } catch (err) {
      setStocksApiError(err);
      setStocksLoading(false);
    }
  }, [refresh]);

  return {
    stocksRowData,
    stocksLoading,
    stocksApiError,
    stocksRefreshing,
  };
}

//Get the overview data, the loading state, and the error message
function useOverview(symbol) {
  const [overviewData, setOverviewData] = useState([]);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewApiError, setOverviewApiError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  function overviewRefreshing() {
    setRefresh((refresh) => !refresh);
    setOverviewLoading(true);
    setOverviewApiError(null);
  }

  //Fetch the data from API
  useEffect(async () => {
    setOverviewLoading(true);
    try {
      const data = await getOverview(symbol);
      setOverviewData(data);
      setOverviewLoading(false);
    } catch (err) {
      setOverviewApiError(err);
      setOverviewLoading(false);
    }
  }, [symbol, refresh]);

  return {
    overviewData,
    overviewLoading,
    overviewApiError,
    overviewRefreshing
  };
}

//Get the stocks current price, the loading state, and the error message
function usePrice(watchList) {
  const [priceData, setPriceData] = useState([]);
  const [priceLoading, setPriceLoading] = useState(true);
  const [priceApiError, setPriceApiError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  function priceRefreshing() {
    setRefresh((refresh) => !refresh);
    setPriceLoading(true);
    setPriceApiError(null);
  }

  //Fetch the data from API
  useEffect(async () => {
    setPriceLoading(true);
    try {
      if(watchList.length > 0){
        setPriceData(await getPrice(watchList));
      }
      setPriceLoading(false);
    } catch (err) {
      setPriceApiError(err);
      setPriceLoading(false);
    }
  }, [watchList, refresh]);

  return {
    priceData,
    priceLoading,
    priceApiError,
    priceRefreshing,
    setPriceApiError
  };
}

//Get the chart data, the loading state, and the error message
function useChart(symbol) {
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartApiError, setChartApiError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  function chartRefreshing() {
    setRefresh((refresh) => !refresh);
    setChartLoading(true);
    setChartApiError(null);
  }
  

  //Fetch the data from API
  useEffect(async () => {
    setChartLoading(true);
    try {
      setChartData(await getChart(symbol));
      setChartLoading(false);
    } catch (err) {
      setChartApiError(err);
      setChartLoading(false);
    }
  }, [symbol, refresh]);

  return {
    chartData,
    chartLoading,
    chartApiError,
    chartRefreshing
  };
}

export { useStocks, useOverview, usePrice, useChart };
