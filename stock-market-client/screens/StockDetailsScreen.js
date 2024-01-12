import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { scaleSize } from "../constants/Layout";
import { useOverview, useChart } from "../Api";
import OverviewTable from "../components/OverviewTable";
import StockChart from "../components/StockChart";

export default function StockDetailsScreen(props) {
  const [toggleState, setToggleState] = useState(1);
  const {
    overviewData,
    overviewLoading,
    overviewApiError,
    overviewRefreshing,
  } = useOverview(props.symbol);
  const { chartData, chartLoading, chartApiError, chartRefreshing } = useChart(
    props.symbol
  );

  //For reseting the toggle to default
  useEffect(() => {
    setToggleState(1);
  }, [props.symbol]);

  //Function for handling which tab is currently chosen
  function toggleTab(index) {
    setToggleState(index);
  }

  return (
    <View>
      {overviewLoading || chartLoading ? (
        <ActivityIndicator
          style={styles.loadingBar}
          size="large"
          color="black"
        />
      ) : overviewApiError !== null || chartApiError !== null ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Something went wrong! Please reload the screen.
          </Text>
          <TouchableOpacity
            style={styles.reloadButton}
            onPress={() => {
              overviewRefreshing();
              chartRefreshing();
            }}
          >
            <Text style={styles.reloadText}>RELOAD</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.companyNameText}>{overviewData.companyName}</Text>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.overviewButton,
                { backgroundColor: toggleState === 1 ? "black" : "grey" },
              ]}
              onPress={() => toggleTab(1)}
            >
              <Text style={styles.textButton}>Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.chartButton,
                { backgroundColor: toggleState === 2 ? "black" : "grey" },
              ]}
              onPress={() => toggleTab(2)}
            >
              <Text style={styles.textButton}>Chart</Text>
            </TouchableOpacity>
          </View>
          <View
            style={
              toggleState === 1
                ? styles.overviewContainer
                : styles.hideContainer
            }
          >
            <Text style={styles.titleText}>Overview</Text>
            <OverviewTable overviewData={overviewData} />
          </View>
          <View style={toggleState === 2 ? {} : styles.hideContainer}>
            <Text style={styles.titleText}>Chart (Last 100 days)</Text>
            <StockChart chartData={chartData} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  companyNameText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: scaleSize(16),
  },
  tabsContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  loadingBar: {
    marginTop: "50%",
  },
  overviewButton: {
    flex: 1,
    margin: 20,
    marginLeft: 40,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 30,
  },
  chartButton: {
    flex: 1,
    margin: 20,
    marginRight: 40,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 30,
  },
  textButton: {
    textAlign: "center",
    color: "white",
    fontSize: scaleSize(14),
  },
  titleText: {
    alignSelf: "center",
    fontSize: scaleSize(18),
    fontWeight: "bold",
    marginBottom: 10,
  },
  overviewContainer: {
    marginLeft: 25,
    marginRight: 25,
  },
  hideContainer: {
    display: "none",
  },
  errorContainer: {
    alignItems: "center",
    marginTop: "50%",
  },
  errorText: {
    color: "black",
    fontSize: scaleSize(14),
  },
  reloadText: {
    color: "white",
  },
  reloadButton: {
    marginTop: 35,
    backgroundColor: "black",
    width: "50%",
    borderRadius: 30,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
