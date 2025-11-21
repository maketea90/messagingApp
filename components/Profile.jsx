import { signOut } from "firebase/auth"
import { View, Text, StyleSheet, TextInput, Pressable, Modal} from "react-native"
import { auth, db } from "../firebaseConfig"
import { useState } from "react";
import {
  collection, query, where, getDocs, writeBatch, deleteDoc, doc
} from "firebase/firestore";
import { StackScreenLifecycleState } from "react-native-screens";

export default function Profile({navigation}){

    const [visible, setVisible] = useState(false)
    const [willDelete, setWillDelete] = useState('')

    const closeModal = () => {
        setVisible(false)
    }

    const handleLogOut = async () => {
        // alert('logout')
        try{
            const result = await signOut(auth)
            navigation.navigate('login')
            alert('You have successfully signed out.')
        }catch(error) {
            console.error('Signout failed.', error)
        }
    }

    const deleteUserData = async (uid) => {
        const ref = collection(db, 'conversations')
        const q = query(ref, where('users', 'array-contains', uid))
        const conversations = await getDocs(q)
        const messagesRef = collection(db, 'messages')
        // const batch = db.batch();
        conversations.forEach(async (doc) => {
            const conversationId = doc.id
            const messagesQuery = query(messagesRef, where('conversationId', '==', conversationId))
            const snapshot = await getDocs(messagesQuery)
            snapshot.forEach(async (message) => {
                await deleteDoc(message.ref)
            })
            await deleteDoc(doc.ref)
            
        })  
        // await batch.commit()
        await deleteDoc(doc(db, "users", uid))

    }

    const handleDeleteAccount = async () => {
        // alert('delete acc')
        if(willDelete.trim() !== 'delete'){
            alert('please type "delete" and click confirm to delete your account')
        } else {
            setVisible(false)
            const user = auth.currentUser
            const uid = auth.currentUser.uid;
            // console.log(uid)
            
            if (user) {
                
                try {
                    console.log('deleting user data')
                    await deleteUserData(uid)
                    console.log('deleting user')
                    await user.delete()
                    navigation.navigate('Welcome')
                    alert('Your account has been deleted')
                }
                catch(error) {
                    if (error.code === 'auth/requires-recent-login') {
                        alert("User must re-authenticate before account can be deleted.");
                    } else {
                        console.log(error)
                        alert("Error deleting user:", error.message);
                    }
                }     
            } else{
                alert('no current user')
            }
        }
        
    }
    

    return(
        <View style={styles.main}>
            <Pressable style={[styles.endbutton, styles.logout]} onPress={handleLogOut}>
                <Text style={styles.buttonText}>Log Out</Text>
            </Pressable>
            <Pressable style={[styles.endbutton, styles.delete]} onPress={() => {setVisible(true)}}>
                <Text style={styles.buttonText}>Delete Account</Text>
            </Pressable>
           <Modal
                    transparent
                    visible={visible}
                    animationType="fade"
                    onRequestClose={closeModal}
                >
            <View style={styles.overlay}>        
            <View style={styles.popup}>
                <Text style={styles.questionText}>To delete your account entirely type delete and click confirm.</Text>
                <TextInput style={styles.input} placeholder="type here..." value={willDelete} onChangeText={(text) => {setWillDelete(text)}} ></TextInput>
                <View style={styles.buttonRow}>
                <Pressable style={styles.confirmButton} onPress={handleDeleteAccount}><Text style={styles.confirmText}>Confirm</Text></Pressable>
                <Pressable style={styles.cancelButton} onPress={() => setVisible(false)}><Text style={styles.cancelText}>Cancel</Text></Pressable>
                </View>
            </View>
            </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",},
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
    buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
    questionText: {
    fontSize: 17,
    color: "#111827",
    textAlign: "center",
    marginBottom: 20,
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
    main: {
    flex: 1,
    justifyContent: "center",  // centers vertically
    alignItems: "center",       // centers horizontally
    backgroundColor: "#f9fafb",
    paddingHorizontal: 24,
  },
  endbutton: {
    width: "80%",
    paddingVertical: 12,       // not too tall
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,        // even spacing
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logout: {
    backgroundColor: "#2563eb",   // blue
  },
  delete: {
    backgroundColor: "#ef4444",   // red
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",

  }
})