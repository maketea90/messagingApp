import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Chats from './Chats'
import ProfileScreen from './Profile'
import { Ionicons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';

const Tab = createBottomTabNavigator()


export default function TabNavigator () {

    return (
        <Tab.Navigator >
          <Tab.Screen name="Chats" component={Chats} 
          options={{
      tabBarLabel: 'Chats',
      tabBarIcon: ({ color, size }) => (
      <Ionicons  name='chatbubbles-outline' size={size} />      ),
    }}/>
          <Tab.Screen name="Profile" component={ProfileScreen} 
          options={{
      tabBarLabel: 'Profile',
      tabBarIcon: ({ color, size }) => (
      <AntDesign name='profile' size={size} />),
    }}/>
        </Tab.Navigator>
      );
}