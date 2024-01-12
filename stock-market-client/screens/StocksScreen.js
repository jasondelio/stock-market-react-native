import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Alert,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { usePrice } from "../Api";
import StockDetailsScreen from "./StockDetailsScreen";

export default function StocksScreen({ route }) {
  const { watchList, removeFromWatchList } = useStocksContext();
  const {
    priceData,
    priceLoading,
    priceApiError,
    priceRefreshing,
    setPriceApiError,
  } = usePrice(watchList);

  useEffect(async () => {}, [watchList]);

  const sheetRef = useRef(null);

  const [symbolChoice, setSymbolChoice] = useState("");

  const snapPoints = useMemo(() => ["78%"], []);

  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  //Function for handling onPress delete button
  function onDeletePress(symbol) {
    Alert.alert(
      "Delete Confirmation",
      `Do you want to delete ${symbol} from the watchlist?`,
      [
        { text: "Yes", onPress: async () => await removeFromWatchList(symbol) },
        {
          text: "No",
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  //Function for getting the background colour for the price percentage change
  function getPriceBackgroundColor(symbol) {
    if (Object.keys(priceData).length === watchList.length) {
      if (priceData[symbol].percentChange < 0) {
        return "red";
      } else if (priceData[symbol].percentChange > 0) {
        return "green";
      } else {
        return "grey";
      }
    } else {
      return "grey";
    }
  }

  //Function for handling onPress the chosen stock in watch list
  function onSymbolPressed(symbol) {
    handleSnapPress(0);
    setSymbolChoice(symbol);
  }

  //Function for handling the animation for swipeable
  function RightActions(progress, dragX, symbol) {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1.5, 0],
    });
    return (
      <TouchableOpacity
        style={styles.rightActionsContainer}
        onPress={() => onDeletePress(symbol)}
      >
        <Animated.Text
          style={{
            color: "white",
            paddingHorizontal: 10,
            fontWeight: "600",
            transform: [{ scale }],
          }}
        >
          Delete
        </Animated.Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {watchList.length === 0 ? (
        <Text style={styles.informationText}>
          Your watchlist is empty.{"\n"}Go to search screen to add watchlist.
        </Text>
      ) : priceLoading ? (
        <ActivityIndicator
          style={styles.loadingBar}
          size="large"
          color="white"
        />
      ) : priceApiError !== null ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Something went wrong! Please reload the screen.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => priceRefreshing()}
          >
            <Text style={styles.errorText}>RELOAD</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => setPriceApiError(null)}
          >
            <Text style={styles.errorText}>OFFLINE MODE</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView>
            {watchList.map((symbol) => (
              <View key={symbol}>
                <Swipeable
                  renderRightActions={(progress, dragX) =>
                    RightActions(progress, dragX, symbol)
                  }
                >
                  <TouchableOpacity
                    style={styles.contentContainer}
                    onPress={() => onSymbolPressed(symbol)}
                  >
                    <Text style={styles.symbolText}>{symbol}</Text>
                    <Text style={styles.priceText}>
                      {Object.keys(priceData).length !== watchList.length
                        ? "N/A"
                        : priceData[symbol].current}
                    </Text>
                    <Text
                      style={[
                        styles.percentageText,
                        { backgroundColor: getPriceBackgroundColor(symbol) },
                      ]}
                    >
                      {Object.keys(priceData).length !== watchList.length
                        ? "N/A"
                        : priceData[symbol].percentChange + "%"}
                    </Text>
                  </TouchableOpacity>
                </Swipeable>
                <View style={styles.separator} />
              </View>
            ))}
          </ScrollView>
          <BottomSheet
            index={-1}
            ref={sheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
          >
            <BottomSheetView>
              {symbolChoice !== "" ? (
                <StockDetailsScreen symbol={symbolChoice} />
              ) : (
                <></>
              )}
            </BottomSheetView>
          </BottomSheet>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  contentContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  informationText: {
    color: "white",
    textAlign: "center",
    fontSize: scaleSize(16),
    marginTop: "50%",
  },
  separator: {
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  symbolText: {
    color: "white",
    padding: 8,
    fontSize: scaleSize(18),
    fontWeight: "bold",
    flex: 2,
  },
  priceText: {
    color: "white",
    padding: 8,
    fontSize: scaleSize(18),
    fontWeight: "bold",
    marginRight: 10,
    textAlign: "right",
    flex: 1,
  },
  percentageText: {
    height: scaleSize(30),
    textAlignVertical: "center",
    justifyContent: "flex-end",
    textAlign: "right",
    borderRadius: 10,
    paddingLeft: 5,
    paddingRight: 10,
    marginRight: 10,
    color: "white",
    fontSize: scaleSize(18),
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  rightActionsContainer: {
    backgroundColor: "red",
    justifyContent: "center",
  },
  loadingBar: {
    marginTop: "50%",
  },
  errorContainer: {
    alignItems: "center",
    marginTop: "50%",
  },
  errorText: {
    color: "white",
    fontSize: scaleSize(14),
  },
  errorButton: {
    marginTop: 35,
    backgroundColor: "grey",
    width: "50%",
    borderRadius: 30,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
