import { createStackNavigator } from "@react-navigation/stack"
import { useEffect } from "react"
import AllConversations from './AllConversations'
import IndividualConversation from './IndividualConversation'

const Stack = createStackNavigator()

export default function Chats () {
    
    
    
    return(
        <Stack.Navigator screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen name="allConversations"  component={AllConversations}></Stack.Screen>
            <Stack.Screen name='individualConversation' component={IndividualConversation}></Stack.Screen>
        </Stack.Navigator>
    )
}