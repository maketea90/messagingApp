
import { StyleSheet, Text, View, TouchableOpacity, Button, TextInput, ActivityIndicator} from "react-native";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig.js";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, validatePassword, getAdditionalUserInfo, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useContext, createContext, useState } from "react";
import { Link } from "@react-navigation/native";
import { Dimensions } from "react-native";

export default function App({navigation}) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const createUser = async () => {
        let status
        try {
            status = await validatePassword(auth, password);

        } catch (err) {
            console.log(err)
        }
        
        if (!status.isValid){
            
            const needsLowerCase = status.containsLowercaseLetter !== true;
            const needsUpperCase = status.containsUppercaseLetter !== true
            const needsAlphanumeric = status.containsNonAlphanumericCharacter !== true
            const needsMinLength = status.meetsMinPasswordLength !== true
            const needsMaxLength = status.meetsMaxPasswordLength !== true
            
            const validationErrors = [needsLowerCase, needsUpperCase, needsAlphanumeric, needsMinLength, needsMaxLength]

            const validationMessages = ['password must contain a lowercase letter',  'password must contain an uppercase letter', "password must contain one of the following characters: ^ $ * . [ ] { } ( ) ? \" ! @ # % & / \\ , > < ' : ; | _ ~", 'password cannot be less than 6 characters', 'password must have a maximum length of 30']

            const alertMessages = []

            validationErrors.forEach((check, index) => {
                
                if(check){
                    alertMessages.push(validationMessages[index])
                }
            })

            if(alertMessages.length > 0){
                
                alert(alertMessages[0])
            }
        
          } else {
        
        if(email.trim() === ''){
            alert('email must not be empty')
            return
        }
        setLoading(true)
        try {
            const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
            )

            alert("Account created successfully!")
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
            alert("That email is already registered. Try logging in instead.");
            } else {
            alert(error.message);
            }
            console.error("Signup error:", error.code, error.message);
            // return
        }
        
        navigation.navigate('login')
        setLoading(false)

        }}
        

        if(loading) {
            return(
                <View style={{ flex: 1, justifyContent: 'center' , alignItems: 'center'}}>
                    <ActivityIndicator size='large'></ActivityIndicator>
                </View>
            )
        } else {
            return (
                
                <View style={styles.container}>
                    <Text style={styles.header}>Create an Account</Text>
                    <Text style={styles.subtext}>
                        Enter your email and create a password to sign up.
                    </Text>

                    <View style={styles.inputView}>
                        <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#9ca3af"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(text) => setEmail(text.trim())}
                        />

                        <TextInput
                        style={styles.input}
                        placeholder="Create a password"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry
                        value={password}
                        onChangeText={(text) => setPassword(text.trim())}
                        />
                    </View>

                    <View style={styles.buttonsView}>
                        <View style={styles.button}>
                        <Button title="Sign Up" color="#7A2048" onPress={createUser} />
                        </View>
                    </View>

                    <View style={[styles.login, {paddingTop: 50}]}>
                        <Text style={styles.loginText}>
                        Already have an account?{" "}
                        <Link screen='login' style={styles.linkText}>
                            Log in here.
                        </Link>
                        </Text>
                    </View>
                </View>
            );        
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
  inputView: {
    width: "100%",
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
  buttonsView: {
    width: "100%",
    marginTop: 8,
  },
  button: {
    borderRadius: 12,
    overflow: "hidden",
    text: 'white'
  },
  login: {
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: "#6b7280",
  },
  linkText: {
    color: "#2563eb",
    fontWeight: "600",
  },
});

const stylesOLD = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        // marginTop: 48,
        alignItems: 'center'
    },
    login: {margin: 10},
    text: {
        fontWeight:"bold",
        textAlign:"center",
        fontSize:24,
        margin: 10
    },
    button_text: {
        textAlign:"center",
        fontSize:24,
        color:"#1976d2"
    },
    button_container: {
        borderRadius: 15,
        
        margin: 16,
        width: '30vw',
        padding:24,
        // justifyContent:"center",
        backgroundColor:"#e6e6e6"
    },
    inputView: {
        

    },
    buttonsView: {
        // flex: 1,
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'flex-start',
        // paddingBottom: 5,
        // marginBottom: 5
        width: '30vw',
        margin: 5
        
    },
    button: {
        marginRight: 5,
        marginLeft: 5,
        
    },
    input: {margin: 5, padding: 5, width: halfWindowsWidth, border: 'solid', borderColor: 'purple', borderWidth: 1}
});