import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { scaleSize } from "../constants/Layout";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const mailformat =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  //Function for handling onPress login button
  async function loginHandler() {
    if (email.match(mailformat) && password.length >= 8) {
      let res = await fetch(`http://172.22.26.155:5000/users/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (res.status === 200) {
        let data = await res.json();
        await AsyncStorage.setItem("@token", data.token);
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: "Home" }],
          })
        );
      } else if (res.status === 400) {
        Alert.alert("Login Failed", "Invalid email address or password.");
      } else {
        Alert.alert(
          "Login Failed",
          "Something went wrong. Please try again later."
        );
      }
    } else {
      Alert.alert("Login Failed", "Invalid email address or password.");
    }
  }

  //Function for handling onPress text Signup
  function signupHandler() {
    navigation.navigate("SignUp");
  }

  //Function for handling onPress back icon button
  function backButtonHandler() {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Landing" }],
      })
    );
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Ionicons
          style={styles.backIcon}
          name="chevron-back"
          size={40}
          color="black"
          onPress={backButtonHandler}
        />
        <Image
          style={styles.image}
          source={require("../assets/images/icon.png")}
        />
        <Text style={styles.title}>LOGIN</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor={"grey"}
          style={styles.textInput}
          textAlign={"center"}
          onChangeText={(email) => setEmail(email.toLowerCase())}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={"grey"}
          style={[styles.textInput, { marginTop: 25 }]}
          textAlign={"center"}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={async () => {
            await loginHandler();
          }}
        >
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>
        <Text style={styles.signUpText}>
          Don't have an account?{" "}
          <Text style={styles.createAccountText} onPress={signupHandler}>
            Sign Up
          </Text>
        </Text>
      </View>
    </TouchableWithoutFeedback>
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
    color: "black",
    fontSize: scaleSize(30),
    fontWeight: "bold",
    marginBottom: 20,
  },
  textInput: {
    fontSize: scaleSize(15),
    color: "white",
    backgroundColor: "black",
    width: "70%",
    textAlign: "center",
    borderRadius: 8,
    padding: 5,
  },
  loginButton: {
    marginTop: 35,
    backgroundColor: "green",
    width: "70%",
    borderRadius: 30,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: scaleSize(16),
  },
  signUpText: {
    color: "white",
    marginTop: 20,
  },
  createAccountText: {
    color: "yellow",
    fontWeight: "bold",
  },
  backIcon: {
    position: "absolute",
    alignSelf: "flex-start",
    left: 5,
    top: 60,
  },
});
