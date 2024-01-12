import React, { useState, useContext, useEffect, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StocksContext = createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  //Function for handling updating the watch list to the backend server
  async function updateWatchlistDatabase(newState) {
    const token = await AsyncStorage.getItem("@token");
    let res = await fetch(`http://172.22.26.155:5000/users/watch-list`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        watchList: JSON.stringify(newState),
      }),
    });
    let data = await res.json();
    return data;
  }

  //Function for handling add a stock to watch list
  async function addToWatchlist(newSymbol) {
    if (!state.includes(newSymbol)) {
      const newState = [...state, newSymbol];
      setState(newState);
      await AsyncStorage.setItem("@watch_list", JSON.stringify(newState));
      let data = await updateWatchlistDatabase(newState);
    }
  }

  //Function for handling remove a stock from watch list
  async function removeFromWatchList(symbol) {
    if (state.includes(symbol)) {
      const newState = state.filter((stock) => stock !== symbol);
      setState(newState);
      await AsyncStorage.setItem("@watch_list", JSON.stringify(newState));
      let data = await updateWatchlistDatabase(newState);
    }
  }

  //Function for handling retrieve the watch list from async storage or backend server
  async function retrieveWatchList() {
    try {
      const value = await AsyncStorage.getItem("@watch_list");
      if (value !== null) {
        setState(JSON.parse(value));
      } else {
        const token = await AsyncStorage.getItem("@token");
        let res = await fetch(`http://172.22.26.155:5000/users/watch-list`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
          },
        });
        let data = await res.json();
        setState(JSON.parse(data.watchList));
        await AsyncStorage.setItem("@watch_list", data.watchList);
      }
    } catch (error) {
      console.log("Unexpected error while retrieving watchList: " + error);
    }
  }

  //For calling the retrieve watch list function
  useEffect(async () => {
    await retrieveWatchList();
  }, []);

  return {
    watchList: state,
    addToWatchlist,
    removeFromWatchList,
  };
};
