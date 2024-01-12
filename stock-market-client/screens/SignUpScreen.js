import React, { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(true);
  const mailformat =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  //Function for handling onPress back icon button
  function backButtonHandler() {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Login" }],
      })
    );
  }

  //Function for handling onPress Signup button
  async function signupHandler() {
    if (
      email.match(mailformat) &&
      password.length >= 8 &&
      password === confirmPassword
    ) {
      setIsValidEmail(true);
      setIsValidPassword(true);
      setIsValidConfirmPassword(true);
      let res = await fetch(`http://172.22.26.155:5000/users/register`, {
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
      if (res.status === 201) {
        Alert.alert(
          "Register Success",
          "Congratulations, your account has been successfully created."
        );
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: "Login" }],
          })
        );
      } else if (res.status === 400) {
        let data = await res.json();
        Alert.alert("Register Failed", data.message);
      } else {
        Alert.alert(
          "Register Failed",
          "Something went wrong. Please try again later."
        );
      }
    } else {
      if (!email.match(mailformat)) {
        setIsValidEmail(false);
      } else {
        setIsValidEmail(true);
      }
      if (password.length < 8) {
        setIsValidPassword(false);
      } else {
        setIsValidPassword(true);
      }
      if (password !== confirmPassword) {
        setIsValidConfirmPassword(false);
      } else {
        setIsValidConfirmPassword(true);
      }
    }
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
        <Text style={styles.title}>SIGN UP</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor={"grey"}
          style={
            !isValidEmail
              ? [styles.textInput, { borderWidth: 1, borderColor: "red" }]
              : styles.textInput
          }
          textAlign={"center"}
          onChangeText={(email) => setEmail(email.toLowerCase())}
        />
        <Text style={!isValidEmail ? styles.errorText : styles.hiddenErrorText}>
          Invalid email format
        </Text>
        <TextInput
          placeholder="Password (minimum 8 characters)"
          placeholderTextColor={"grey"}
          style={
            !isValidPassword
              ? [
                  styles.textInput,
                  { marginTop: 25 },
                  { borderWidth: 1, borderColor: "red" },
                ]
              : [styles.textInput, { marginTop: 25 }]
          }
          textAlign={"center"}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <Text
          style={!isValidPassword ? styles.errorText : styles.hiddenErrorText}
        >
          Password must have at least 8 characters
        </Text>
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor={"grey"}
          style={
            !isValidConfirmPassword
              ? [
                  styles.textInput,
                  { marginTop: 25 },
                  { borderWidth: 1, borderColor: "red" },
                ]
              : [styles.textInput, { marginTop: 25 }]
          }
          textAlign={"center"}
          secureTextEntry={true}
          onChangeText={(confirmPassword) =>
            setConfirmPassword(confirmPassword)
          }
        />
        <Text
          style={
            !isValidConfirmPassword ? styles.errorText : styles.hiddenErrorText
          }
        >
          Confirm password does not match
        </Text>
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={async () => {
            await signupHandler();
          }}
        >
          <Text style={styles.createAccountButtonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>
        <Text style={styles.alreadyHadAccountText}>
          Already have an account?{" "}
          <Text onPress={backButtonHandler} style={styles.loginText}>
            Login
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
  backIcon: {
    position: "absolute",
    alignSelf: "flex-start",
    left: 5,
    top: 60,
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
  createAccountButton: {
    marginTop: 35,
    backgroundColor: "red",
    width: "70%",
    borderRadius: 30,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  createAccountButtonText: {
    color: "white",
    fontSize: scaleSize(16),
  },
  alreadyHadAccountText: {
    color: "white",
    marginTop: 20,
  },
  loginText: {
    color: "yellow",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
    marginBottom: -10,
  },
  hiddenErrorText: {
    display: "none",
  },
});
