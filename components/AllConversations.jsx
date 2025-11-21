import { useContext, useEffect, useState } from 'react'
import { getDocs, collection, addDoc, where } from 'firebase/firestore'
import { auth, db } from '../firebaseConfig'
import { View, TouchableOpacity, StyleSheet, Image, FlatList, Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { UserContext } from '../UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'



export default function AllConversations({ navigation, route }) {

  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  // const state = useContext(UserContext)

  const navigateToIndividualChat = (id) => {
    navigation.navigate('individualConversation', { id })
  }

  async function getUsers() {
    
    let isNewUser = await AsyncStorage.getItem('isNewUser')

    isNewUser = isNewUser === 'true'

    const q = await getDocs(collection(db, 'users'))

      const documents = q.docs.map((doc) => {

        const data = doc.data()

        const id = doc.id
        
        const document = {id, ...data}

        if(id === auth.currentUser.uid){
          return false
        } else {
          return document
        }
      })

      const conversations = [...documents].filter((doc) => doc)

      setUsers(conversations)
      
      if(isNewUser){
        console.log('creating conversation records')
        await AsyncStorage.setItem('isNewUser', 'false')
        documents.forEach(async (doc) => {
          if(doc.id !== auth.currentUser.uid){
            await addDoc(collection(db, 'conversations'), {
              users: [auth.currentUser.uid, doc.id]
            })
          }
        })
        
      }
      // state.setIsNewUser(false)

  }
  
  const renderItem = ({ item }) => (
    
    <TouchableOpacity
    key={item.id}
      style={styles.item}
      onPress={() => navigateToIndividualChat(item.id)}
    >
      <Image
        source={
          item.photoURL
            ? { uri: item.photoURL }
            : require("../assets/splash-icon.png")
        }
        style={styles.avatar}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.subtitle}>Tap to start a chat</Text>
      </View>
    </TouchableOpacity>

  )

  useFocusEffect(
    useCallback(() => {
      getUsers()
      // setTimeout(() => {
      //   state.setIsNewUser(false)
      // }, 2500)
    }, [])
  )

  return (
    <KeyboardAvoidingView style={styles.main}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.listContainer}
      />
    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
  main: { flex: 1, flexDirection: 'column', justifyContent: 'flex-start', backgroundColor: '#fff'},
  listContainer: {
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#e5e7eb",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
});