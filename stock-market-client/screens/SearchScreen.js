import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";
import { useStocks } from "../Api";
import { SearchBar } from "@rneui/themed";

export default function SearchScreen({ navigation }) {
  const { watchList, addToWatchlist } = useStocksContext();
  const [search, setSearch] = useState("");
  const { stocksRowData, stocksLoading, stocksApiError, stocksRefreshing } =
    useStocks();

  const [filteredStocksRowData, setFilteredStocksRowData] = useState([]);

  //For updating filteredStocksRowData, every time the value of search is changed
  useEffect(() => {
    if (search !== "") {
      const searchRegex = new RegExp(search, "i");
      setFilteredStocksRowData(
        stocksRowData.filter(
          (stock) =>
            searchRegex.test(stock.symbol) || searchRegex.test(stock.name)
        )
      );
    }
  }, [search]);

  //Function for handling onPress add to watchlist button
  async function addToWatchlistHandler(symbol) {
    await addToWatchlist(symbol);
  }

  //Function for handling onChange in search bar
  function updateSearch(search) {
    setSearch(search);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {stocksLoading ? (
        <ActivityIndicator
          style={styles.loadingBar}
          size="large"
          color="white"
        />
      ) : stocksApiError !== null ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Something went wrong! Please reload the screen.
          </Text>
          <TouchableOpacity
            style={styles.reloadButton}
            onPress={() => stocksRefreshing()}
          >
            <Text style={styles.errorText}>RELOAD</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.informationText}>
            Type a company name or stock symbol
          </Text>
          <SearchBar
            placeholder="Search"
            onChangeText={updateSearch}
            value={search}
          />

          <ScrollView>
            {search === ""
              ? stocksRowData.map((x) => (
                  <View style={styles.contentContainer} key={x.symbol}>
                    <Text style={styles.symbolText}>
                      {x.symbol}{" "}
                      <Text style={styles.sectorText}>{x.sector}</Text>
                    </Text>
                    <Text style={styles.nameText}>{x.name}</Text>
                    {!watchList.includes(x.symbol) ? (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={async () =>
                          await addToWatchlistHandler(x.symbol)
                        }
                      >
                        <Text style={styles.textButton}>Add to WatchList</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.textWatchlist}>
                        Already in watchlist
                      </Text>
                    )}
                  </View>
                ))
              : filteredStocksRowData.map((x) => (
                  <View style={styles.contentContainer} key={x.symbol}>
                    <Text style={styles.symbolText}>
                      {x.symbol}{" "}
                      <Text style={styles.sectorText}>{x.sector}</Text>
                    </Text>
                    <Text style={styles.nameText}>{x.name}</Text>
                    {!watchList.includes(x.symbol) ? (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => addToWatchlistHandler(x.symbol)}
                      >
                        <Text style={styles.textButton}>Add to WatchList</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.textWatchlist}>
                        Already in watchlist
                      </Text>
                    )}
                  </View>
                ))}
          </ScrollView>
        </>
      )}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    justifyContent: "center",
  },
  informationText: {
    color: "white",
    alignSelf: "center",
    fontSize: scaleSize(14),
    margin: 5,
  },
  symbolText: {
    color: "white",
    padding: 8,
    fontSize: scaleSize(16),
    fontWeight: "bold",
  },
  loadingBar: {
    marginTop: "50%",
  },
  nameText: {
    color: "white",
    padding: 8,
    fontSize: scaleSize(12),
  },
  sectorText: {
    color: "grey",
    padding: 8,
    fontSize: scaleSize(12),
    fontWeight: "normal",
  },
  textButton: {
    fontSize: scaleSize(9),
    fontWeight: "bold",
    color: "white",
  },
  errorContainer: {
    alignItems: "center",
    marginTop: "50%",
  },
  errorText: {
    color: "white",
    fontSize: scaleSize(14),
  },
  reloadButton: {
    marginTop: 35,
    backgroundColor: "grey",
    width: "50%",
    borderRadius: 30,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    position: "absolute",
    right: 0,
    borderRadius: 20,
    padding: 16,
    backgroundColor: "red",
  },
  textWatchlist: {
    position: "absolute",
    right: 0,
    color: "grey",
    marginRight: 2,
  },
});
