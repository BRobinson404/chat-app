import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getFirestore }  from "firebase/firestore";

import Start from './components/Start';
import Chat from './components/Chat';

// Create a navigation stack
const Stack = createNativeStackNavigator();

const App = () => {
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


  return (
    // Navigation container to manage navigation
    <NavigationContainer>
      {/* Navigation stack */}
      <Stack.Navigator initialRouteName="Start">
        {/* Start screen */}
        <Stack.Screen name="Start" component={Start} options={{ headerShown: false }} />

        {/* Chat screen */}
        <Stack.Screen name="Chat">
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
