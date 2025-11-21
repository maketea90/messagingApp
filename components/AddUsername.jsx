import { collection, updateDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { TextInput, View, Text, StyleSheet, Button, ActivityIndicator } from "react-native";
import { auth, db } from "../firebaseConfig";
import { Dimensions } from "react-native";

export default function AddUsername({navigation, route}){

    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)

    const updateUsername = async () => {

        if(username.trim() === ''){
            alert('username must not be empty')
            return
        }
        setLoading(true)
        const result = await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            username
        })
        navigation.navigate('(tabs)')
        setLoading(false)
    }   

    if(loading){
        return(
            <View>
                <ActivityIndicator size='large' style={{flex:1, justifyContent: 'center', alignItems: 'center'}}></ActivityIndicator>
            </View>
        )
    } else {
        return(

             <View style={styles.container}>
                <Text style={styles.header}>Choose a Username.</Text>

                <Text style={styles.subtext}>
                    Please enter a username. This will be the name displayed when you chat
                    with someone.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Create a username"
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="none"
                    onChangeText={(text) => setUsername(text.trim())}
                />

                <View style={styles.button}>
                    <Button title="Submit" color="#7A2048" onPress={updateUsername} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtext: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
})