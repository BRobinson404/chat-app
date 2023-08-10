import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';

const Start = ({ navigation }) => {
  const [name, setName] = useState(' ');
  const [selectedColor, setSelectedColor] = useState('#090C08');

  const colorOptions = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

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
            placeholder='Your name'
            placeholderTextColor='rgba(117, 112, 131, 0.5)'
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
            onPress={() => navigation.navigate('Chat', { name: name, bgColor: selectedColor })}
          >
            <Text style={styles.startChattingButtonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align the title to the top
    alignItems: 'center',
    width: '88%',
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 60, // Move the title up
    marginBottom: 260,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    width: '88%',
    height: window.height * 0.44,
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
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
    alignItems: 'center',
    marginBottom: 15,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
    borderWidth: 0,
  },
  chooseColorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1,
    marginBottom: 15,
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

