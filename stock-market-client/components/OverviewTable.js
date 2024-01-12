import * as React from "react";
import { Text, StyleSheet, View } from "react-native";
import { scaleSize } from "../constants/Layout";

export default function OverviewTable(props) {
  return (
    <View>
      <View style={styles.overviewDetailContainer}>
        <Text style={styles.titleText}>Prev. Close</Text>
        <Text style={styles.valueText}>{props.overviewData.previousClose}</Text>
      </View>
      <View style={styles.overviewDetailContainer}>
        <Text style={styles.titleText}>Open</Text>
        <Text style={styles.valueText}>{props.overviewData.open}</Text>
      </View>
      <View style={styles.overviewDetailContainer}>
        <Text style={styles.titleText}>Volume</Text>
        <Text style={styles.valueText}>{props.overviewData.volume}</Text>
      </View>
      <View style={styles.overviewDetailContainer}>
        <Text style={styles.titleText}>Avg. Volume</Text>
        <Text style={styles.valueText}>{props.overviewData.avgVolume}</Text>
      </View>
      <View style={styles.overviewDetailContainer}>
        <Text style={styles.titleText}>Day's Range</Text>
        <Text style={styles.valueText}>{props.overviewData.dayRange}</Text>
      </View>
      <View style={styles.overviewDetailContainer}>
        <Text style={styles.titleText}>52-wk Range</Text>
        <Text style={styles.valueText}>{props.overviewData.yearRange}</Text>
      </View>
      <View style={styles.overviewDetailContainer}>
        <Text style={styles.titleText}>Market Cap</Text>
        <Text style={styles.valueText}>{props.overviewData.marketCap}</Text>
      </View>
      <View style={styles.overviewDetailContainer}>
        <Text style={styles.titleText}>P/E Ratio</Text>
        <Text style={styles.valueText}>{props.overviewData.pe}</Text>
      </View>
      <View style={styles.overviewDetailContainer}>
        <Text style={styles.titleText}>EPS</Text>
        <Text style={styles.valueText}>{props.overviewData.eps}</Text>
      </View>
      <View style={styles.overviewDetailContainer}>
        <Text style={styles.titleText}>Shares Outstanding</Text>
        <Text style={styles.valueText}>
          {props.overviewData.sharesOutstanding}
        </Text>
      </View>
      <View style={styles.overviewDetailContainer}>
        <Text style={styles.titleText}>Next Earnings Date</Text>
        <Text style={styles.valueText}>
          {props.overviewData.earningsAnnouncement}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overviewDetailContainer: {
    flexDirection: "row",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: scaleSize(14),
  },
  valueText: {
    fontSize: scaleSize(14),
    fontWeight: "bold",
    textAlign: "right",
  },
});
