import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebaseConfig.js";
import { addDoc, collection } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from "firebase/auth";
// import Config from 'react-native-config'
import Welcome from './components/Welcome.jsx'
import { createStackNavigator } from "@react-navigation/stack";
import Tabs from './components/Tabs.jsx'
import { NavigationContainer } from "@react-navigation/native";
import login from './components/Login.jsx'
import addUsername from "./components/AddUsername.jsx";
// import { StyleSheet } from "react-native";
import { createContext, useContext, useState } from "react";
import { UserContext } from "./UserContext.js";
import { KeyboardProvider } from 'react-native-keyboard-controller';
// import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createStackNavigator()

// export const UserContext = createContext({
//   isNewUser: false, setIsNewUser: () => {}, updateChat: false, setUpdateChat: () => {}
// })


export default function App() {

  const setIsNewUser = (isNewUser) => {
    setState({ ...state, isNewUser })
    return state.isNewUser
  }
  const setUpdateChat = (updateChat) => {
    setState({ ...state, updateChat })
    return state.updateChat
  }

  const initState = {
    isNewUser: false,
    setIsNewUser,
    updateChat: false,
    setUpdateChat
  }

  const [state, setState] = useState(initState)

  // console.log(Config.apiKey)

  const googleSignIn = async () => {
    // e.preventDefault()
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const { isNewUser } = getAdditionalUserInfo(result)

    console.log(isNewUser)

    if (isNewUser) {
      console.log('new user')
      const newDocRef = await addDoc(collection(db, 'users'), {
        email: auth.currentUser.email,
        name: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL
      })
    }
    // Add a new document in collection "cities"
    // await setDoc(doc(db, "users"), {
    //   name: "Los Angeles",
    //   state: "CA",
    //   country: "USA"
    // });
  };

  // const auth = getAuth(app);



  return (
    // <SafeAreaProvider>
    <KeyboardProvider>
    <UserContext.Provider value={state}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="Welcome" component={Welcome}></Stack.Screen>
          <Stack.Screen name='login' component={login}></Stack.Screen>
          <Stack.Screen name='addUsername' component={addUsername}></Stack.Screen>
          <Stack.Screen name='(tabs)' component={Tabs}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
    {/* // </SafeAreaProvider> */}
    </KeyboardProvider>
  );
}


