import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from './components/Start';
import Chat from './components/Chat';

// Create a navigation stack
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    // Navigation container to manage navigation
    <NavigationContainer>
      {/* Navigation stack */}
      <Stack.Navigator
        initialRouteName="Start"
      >
        {/* Start screen */}
        <Stack.Screen
          name="Start"
          component={Start}
        />

        {/* Chat screen */}
        <Stack.Screen
          name="Chat"
          component={Chat}
          initialParams={{ name: 'Default Name', bgColor: '#090C08' }} // Set default values
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
