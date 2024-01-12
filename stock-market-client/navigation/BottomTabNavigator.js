import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";
import StocksScreen from "../screens/StocksScreen";
import SearchScreen from "../screens/SearchScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { scaleSize } from "../constants/Layout";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Search";

export default function BottomTabNavigator({ navigation, route }) {
  //For switching from one screen to other screen
  useEffect(() => {
    navigation.setOptions({ headerTitle: getHeaderTitle(route) });
  }, [navigation, route]);

  //Function for handling onPress logout button
  async function logoutHandler() {
    await AsyncStorage.removeItem("@token");
    await AsyncStorage.removeItem("@watch_list");
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Landing" }],
      })
    );
  }

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Stocks"
        component={StocksScreen}
        options={{
          title: "Stocks",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-trending-up" />
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={async () => {
                await logoutHandler();
              }}
            >
              <Text style={styles.logoutButtonText}>LOGOUT</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-search" />
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={async () => {
                await logoutHandler();
              }}
            >
              <Text style={styles.logoutButtonText}>LOGOUT</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  return getFocusedRouteNameFromRoute(route) ?? INITIAL_ROUTE_NAME;
}

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: "grey",
    width: "30%",
    borderRadius: 30,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  logoutButtonText: {
    color: "white",
    fontSize: scaleSize(14),
    fontWeight: "bold",
  },
});
