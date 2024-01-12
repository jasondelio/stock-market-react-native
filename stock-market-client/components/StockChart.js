import * as React from "react";
import { Text, StyleSheet, View, Dimensions } from "react-native";
import { scaleSize } from "../constants/Layout";
import { LineChart } from "react-native-wagmi-charts";

export default function StockChart(props) {
  const window = Dimensions.get("window");
  return (
    <LineChart.Provider data={props.chartData}>
      <LineChart height={(window.height * 30) / 100}>
        <LineChart.Path />
        <LineChart.CursorCrosshair />
      </LineChart>
      <LineChart.PriceText style={styles.priceText} />
      <LineChart.DatetimeText style={styles.dateTimeText} />
    </LineChart.Provider>
  );
}

const styles = StyleSheet.create({
  priceText: {
    fontWeight: "bold",
    fontSize: scaleSize(20),
    marginLeft: 5,
  },
  dateTimeText: {
    marginLeft: 5,
  },
});
