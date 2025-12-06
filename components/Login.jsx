import { getAdditionalUserInfo, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { TextInput, View, StyleSheet, Button, Text, ActivityIndicator, TouchableOpacity, Modal } from "react-native";
import { auth, db } from "../firebaseConfig";
import { setDoc, collection, doc, getDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Dimensions } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useTheme } from "@react-navigation/native";

export default function Login({ navigation }) {

    const state = useContext(UserContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false);
    const [emailReset, setEmailReset] = useState('')

    const handleConfirm = async () => {
        setVisible(false)
        try{
            const reset = await sendPasswordResetEmail(auth, emailReset.trim())
            console.log(`If the email exists in our system, a password reset email has been sent.`)
            alert(`If the email exists in our system, a password reset email has been sent.`)
        } catch(error){
            const errorCode = error.code
            const errorMessage = error.message
            console.error(`Error sending password reset email: ${errorCode} - ${errorMessage}`)
        }
    };

    const handleCancel = () => {
        setVisible(false)
    };

    const login = async () => {

        setLoading(true)

        try{
            console.log('attempting sign in')
            const result = await signInWithEmailAndPassword(auth, email, password)
            console.log('signed in')
        } catch (error){
            if(error.code === 'auth/invalid-credential'){
                alert('The email/password combination you entered is incorrect.')
            } else {
                alert(error)
                console.log(error)
            }
            setLoading(false)
            return
        }
        console.log('checking user doc')
        let currentUserDoc
        try {
            currentUserDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))

        } catch (err) {
            console.log(err)
        }
        console.log('complete')
        const isNewUser = !currentUserDoc.exists()

        await AsyncStorage.setItem("isNewUser", `${isNewUser}`)

        if (isNewUser) {
            console.log('new user')
            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                email: auth.currentUser.email,
            })
            navigation.navigate('addUsername')
        } else {
            navigation.navigate('(tabs)')
        }
        setLoading(false)

    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' , alignItems: 'center'}}>
                <ActivityIndicator size='large'></ActivityIndicator>
            </View>
        )
    } else {
        return (
            
            <View style={styles.container}>
                <Text style={styles.header}>Welcome Back</Text>
                <Text style={styles.subtext}>
                    Enter the email and password you signed up with to log in.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(text) => setEmail(text.trim())}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry
                    onChangeText={(text) => setPassword(text.trim())}
                />

                <View style={styles.button}>
                    <Button title="Log In" color="#7A2048" onPress={login} />
                </View>
                <View style={styles.login}>   
                    <TouchableOpacity style={[styles.linkText, {paddingTop: 50}]} onPress={() => {setVisible(true)}}>
                        <Text style={{
                                color: "#2563eb",
                                fontWeight: "600",
                            }}>
                            Forgotten your password?
                        </Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    transparent
                    visible={visible}
                    animationType="fade"
                    onRequestClose={handleCancel}
                >
                    <View style={styles.overlay}>
                    <View style={styles.popup}>
                        <Text style={styles.questionText}>
                        Send a password reset email?
                        </Text>
                        <TextInput 
                        style={styles.input} 
                        placeholder="Enter your email..."
                        onChangeText={setEmailReset}
                        value={emailReset}
                        autoCapitalize="none"
                        keyboardType="email-address"/>
                            
                        {/* </TextInput> */}
                        <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancel}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.confirmText}>Confirm</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    </View>
                </Modal>

            </View>
        )
    }


}

const halfWindowsWidth = Dimensions.get('window').width / 1.5

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtext: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
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
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    width: "100%",
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden", // ensures the button respects rounded corners
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  questionText: {
    fontSize: 17,
    color: "#111827",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 8,
    alignItems: "center",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 15,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
})