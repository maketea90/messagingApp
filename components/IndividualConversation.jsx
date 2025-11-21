import { addDoc, collection, query, where, orderBy, limit, onSnapshot, getDocs, getDoc, doc, Query, endBefore} from 'firebase/firestore'
import { View, Text, StyleSheet, FlatList, ScrollView, TextInput, Button, KeyboardAvoidingView, Platform, Pressable, Keyboard, ActivityIndicator } from 'react-native'
import { db, auth } from '../firebaseConfig'
import { useContext, useEffect, useRef, useState } from 'react'
// import { FlatList } from 'react-native-web'
import SendMessage from './SendMessage'
import { UserContext } from '../UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useGradualAnimation } from './AvoidKeyboard'
// import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

export default function IndividualConversation({ navigation, route }) {

  const tabBarHeight = useBottomTabBarHeight()

const useGradualAnimation = () => {
  const height = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: event => {
        'worklet';
        height.value = Math.max(event.height - tabBarHeight, 0);
      },
    },
    []
  );
    return { height };
  };

  const { height } = useGradualAnimation();

  const fakeView = useAnimatedStyle(() => {
    // console.log('height: ', height.value)
    return {
      height: Math.abs(height.value),
    };
  }, []);

  const state = useContext(UserContext)
  
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadmore, setLoadmore] = useState(0)
  const [endReached, setEndReached] = useState(false)
  const [isFewMessages, setIsFewMessages] = useState(false)
  const [finished, setFinished] = useState(false)

  const scroll = useRef(null);

  const getConversation = async () => {

    const conversationsRef = collection(db, "conversations")
    const q2 = query(conversationsRef, 
      where("users", "array-contains", auth.currentUser.uid)
    );

    const querySnapshot2 = await getDocs(q2);

    querySnapshot2.forEach(async (doc) => {

      const data = doc.data()
      const id = doc.id

      if (data.users.includes(route.params.id)){
        await AsyncStorage.setItem('conversationId', id)
      }
    });

    const conversationuid = await AsyncStorage.getItem('conversationId')

    const messagesRef = collection(db, "messages")

    try {
      const q = query(messagesRef, where("conversationId", "==", conversationuid), orderBy('createdAt', 'desc'), limit(20 + loadmore))
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map((doc) => {

        const data = doc.data()

        const id = doc.id

        const document = {id, ...data}

        return document
      });

      setMessages([...documents])

    } catch (e) {
      alert(`error: ${e}`)
      console.log(e)
    }

  }

  useEffect(() => {

    getConversation() 
    console.log('fetching messages')

  }, [state.updateChat])

  useEffect(() => {
      
    if(messages.length < 20){
      setIsFewMessages(true)
      console.log('few messages')
    } else {
      setIsFewMessages(false)
      console.log('many messages')
    }

  }, [messages])

  useEffect(() => {
    setTimeout(() => {
      scroll.current?.scrollToOffset({offset: 0, animated: false})
    }, 2500)
  }, [])

  const renderItem = ({ item }) => {
    
    const isSender = item.sender === auth.currentUser.uid
    
    if(isSender){
      return (
      <View style={styles.bubbleRight} key={item.id}>
        <View style={styles.messageBoxRight}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userMessage}>{item.text}</Text>

        </View>
      </View>
    ) 
    } else {
      return (
      <View style={styles.bubbleLeft} key={item.id}>
        <View style={styles.messageBoxLeft}>
          <Text style={styles.userNameLeft}>{item.name}</Text>
          <Text style={styles.userMessageLeft}>{item.text}</Text>

        </View>
      </View>
    )}
  }
    

  const loadMore = async () => {
    if(endReached){
      if(finished){
        return
      }
      alert('no more messages')
      console.log('finished')
      setFinished(true)
      return
    }
    console.log('fetching more')
    setLoading(true)
    const oldLength = messages.length
    setLoadmore(loadmore + 20)
    // console.log(loadmore)
    getConversation()
    setTimeout(() => {
      setLoading(false)
      const newLength = messages.length
      if(newLength === oldLength){
        setEndReached(true)
      }
    }, 2500)
  }

  return (
      // <KeyboardAvoidingView
      //   style={styles.main}
      //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      //   keyboardVerticalOffset={}>
        <View style={styles.main}>
        <FlatList
          data={messages}
          ref={scroll}
          inverted
          maintainVisibleContentPosition={{
            minIndexForVisible: 1,
            autoscrollToTopThreshold: 50,
          }}
          ListFooterComponent={loading ? <ActivityIndicator size={25} /> : null}
          onEndReached={() => {
            if(isFewMessages) {
              return null
            } else {return loadMore()}}}
          onEndReachedThreshold={0.1}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={isFewMessages ? {justifyContent: 'flex-end', flexGrow: 1} : null}
        />
      <SendMessage scroll={scroll} />
      <Animated.View style={fakeView} /> 
    {/* </KeyboardAvoidingView> */}
    </View>
  )}

const styles = StyleSheet.create({
  main: { flex: 1, flexDirection: 'column', backgroundColor: '#fff'},
  // inputView: {position: 'absolute', bottom: 0, left: 0, right: 0},
  bubbleRight: {
    alignSelf: 'flex-end',
    marginVertical: 5,
    marginHorizontal: 10,
    maxWidth: '80%',
    backgroundColor: '#408EC6',
    borderRadius: 20
  },
  bubbleLeft: {
    alignSelf: 'flex-start', 
    marginVertical: 5,
    marginHorizontal: 10,
    maxWidth: '80%',
    backgroundColor: '#7A2048',
    borderRadius: 20
  },
  messageBoxRight: {
    alignItems: 'flex-end',
    borderRadius: 20, margin: 7, padding: 8
  },
  messageBoxLeft: {
    alignItems: 'flex-start',
    borderRadius: 20, margin: 7, padding: 8
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#d6d6d6ff',
    marginBottom: 2,
    textAlign: 'right', 
  },
  userMessage: {
    fontSize: 14,
    color: '#fbf8f8ff',
    textAlign: 'right', 
    wordBreak: 'break-all'
  },
  userNameLeft: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#cbcbcbff',
    marginBottom: 2,
    textAlign: 'left',
  },
  userMessageLeft: {
    fontSize: 14,
    color: '#f9f9f9ff',
    textAlign: 'left',
    wordBreak: 'break-all'
  },
  
})
