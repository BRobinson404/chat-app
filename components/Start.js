import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#090C08');

  const colorOptions = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

  const handleStartChatting = () => {
    const auth = getAuth();
    signInAnonymously(auth)
      .then((result) => {
        // Navigate to the Chat screen with user ID, name, and color
        navigation.navigate('Chat', {
          userID: result.user.uid,
          name: name || 'User',
          bgColor: selectedColor || 'white',
        });
        Alert.alert('Signed in successfully!');
      })
      .catch((error) => {
        Alert.alert('Unable to sign in, try again later.');
      });
  };

  return (
    <ImageBackground
      source={require('../Background_Image.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.appTitle}>Chat-App</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="rgba(117, 112, 131, 0.5)"
          />
          <Text style={styles.chooseColorText}>Choose Background Color</Text>
          <View style={styles.colorOptionsContainer}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setSelectedColor(color)}
                style={[
                  styles.colorOption,
                  {
                    backgroundColor: color,
                    borderColor: selectedColor === color ? 'yellow' : 'transparent',
                    borderWidth: selectedColor === color ? 2 : 0,
                  },
                ]}
              />
            ))}
          </View>
          <TouchableOpacity
            style={styles.startChattingButton}
            onPress={handleStartChatting}
          >
            <Text style={styles.startChattingButtonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto', // Push the title to the center
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 'auto', // Push the title to the center
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    width: '88%',
    height: '35%',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    marginTop: 'auto', // Push the container to the bottom
    marginBottom: '12%', // Add 12% margin from the bottom
  },
  textInput: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    padding: 15,
    borderWidth: 1,
    borderColor: '#757083',
    borderRadius: 5,
    marginBottom: 15,
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
    borderWidth: 0,
    textAlign: 'center',   // Center the text horizontally
    alignItems: 'center',
  },
  chooseColorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1,
    marginBottom: 15,
    textAlign: 'center',   // Center the text horizontally
    alignItems: 'center',  // Center the text vertically
  },  
  startChattingButton: {
    backgroundColor: '#757083',
    borderRadius: 5,
    paddingVertical: 12,
  },
  startChattingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default Start;
