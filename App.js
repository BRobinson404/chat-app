// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import functions for initializing firestore
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { Alert, LogBox } from "react-native";

// Create the navigator
const Stack = createNativeStackNavigator();

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {

  const connectionStatus = useNetInfo();

  const firebaseConfig = {
    apiKey: "AIzaSyDJ0YJPbg857Bqj1s2FOW3Q5scR3QLysdc",
    authDomain: "chat-app-cf8cb.firebaseapp.com",
    projectId: "chat-app-cf8cb",
    storageBucket: "chat-app-cf8cb.appspot.com",
    messagingSenderId: "562534916846",
    appId: "1:562534916846:web:92af0bfc33bf43edb0c9ff",
    measurementId: "G-7957X5LVY7"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);


  return (
    // Navigation container to manage navigation
    <NavigationContainer>
      {/* Navigation stack */}
      <Stack.Navigator initialRouteName="Start">
        {/* Start screen */}
        <Stack.Screen name="Start" component={Start} options={{ headerShown: false }} />

        {/* Chat screen */}
        <Stack.Screen name="Chat">
          {props => <Chat
           db={db}
           isConnected={connectionStatus.isConnected} //Pass isConnected as a prop to the Chat component
           storage={storage}
           {...props} />}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
