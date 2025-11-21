import { Button, KeyboardAvoidingView } from "react-native";
import { auth, db } from "../firebaseConfig";
import { StyleSheet, View, TextInput, ScrollView, Text, Pressable, Keyboard, Animated, StatusBar} from "react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { addDoc, collection, getDoc, serverTimestamp, where, doc } from "firebase/firestore";
import { UserContext } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function SendMessage({ scroll }) {

  const state = useContext(UserContext)

  const tabBarHeight = useBottomTabBarHeight()

  const [keyboardOffset, setKeyboardOffset] = useState(8)
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("")

  async function getUsername() {
    const user = await getDoc(doc(db, 'users', auth.currentUser.uid))
    const data = user.data()
    setUsername(data.username)
  }

   useEffect(() => {

    getUsername()

  }, []);

  const sendMessage = async () => {


    if (message.trim() === "") {
      alert("Enter valid message")
      return;
    }

    const convo = await AsyncStorage.getItem('conversationId')

    const result = await addDoc(collection(db, "messages"), {
      conversationId: convo,
      sender: auth.currentUser.uid,
      text: message,
      name: username,
      // avatar: photoURL,
      createdAt: serverTimestamp(),
      // ageMilliseconds: Date.now()
    })

    setMessage("");
    
    state.setUpdateChat(!state.updateChat)

    scroll.current?.scrollToOffset({offset: 0, animated: true})
  }
  
  return (

      <View style={[styles.footer]}>

        <View style={[styles.inputBar, {paddingBottom: 8}]}>
          <TextInput
            style={[styles.input, ]}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#aaa"
            // onFocus={() => scroll.current.scrollToOffset({ offset: 0, animated: false })}
          />
          <Pressable style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={22} color="white" />
          </Pressable>
        </View>
      </View>
    // {/* // </Animated.View> */}
  );
}

const styles = StyleSheet.create({
  
  // container: {
  //   flex: 1,
  //   justifyContent: 'flex-end',
  //   backgroundColor: '#fff',
  //   // position: 'absolute',
  //   // bottom: 0, left: 0, right: 0,
  //   marginBottom: 7
  // },
  footer: {borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',},
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 12,
    gap: 8,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: '#fafafa',
    paddingBottom: 8
  },
  input: {
    flex: 1,
    // height: 42,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     justifyContent: 'flex-end',
//     position: 'absolute',
//     bottom: 0, left: 0, right: 0,
//     marginTop: 7,
    

//   },
//   input: {
//     padding: 5,
//     flex: 1,
//     borderColor: 'black',
//     borderStyle: 'solid',
//     borderWidth: 2
//   }
// })
