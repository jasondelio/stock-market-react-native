import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { scaleSize } from "../constants/Layout";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import decode from "jwt-decode";

export default function LandingScreen({ navigation }) {
  //Check the token is still valid or not
  useEffect(async () => {
    const token = await AsyncStorage.getItem("@token");
    if (token !== null) {
      const decodedToken = decode(token);
      let currentDate = new Date();
      if (decodedToken.exp >= currentDate.getTime()) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: "Home" }],
          })
        );
      }
    }
  }, []);

  //Function for handling onPress get started button
  function getStartedButtonHandler() {
    navigation.navigate("Login");
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>STOCKS MARKET</Text>
      <Image
        style={styles.image}
        source={require("../assets/images/icon.png")}
      />
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={getStartedButtonHandler}
      >
        <Text style={styles.buttonText}>GET STARTED</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9e9d9d",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 30,
  },
  title: {
    fontSize: scaleSize(35),
    fontWeight: "bold",
    marginBottom: 80,
  },
  getStartedButton: {
    marginTop: 45,
    backgroundColor: "black",
    width: "70%",
    borderRadius: 30,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: scaleSize(16),
  },
});
