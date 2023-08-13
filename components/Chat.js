import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";


const Chat = ({ route, navigation }) => {
  const { name, bgColor } = route.params;
  const [messages, setMessages] = useState([]);
  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  }
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000",
          borderColor: bgColor === '#090C08' ? 'white' : 'transparent', // Add border color for black background choice
          borderWidth: bgColor === '#090C08' ? 2 : 0, // Add border width
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }
  useEffect(() => {
    navigation.setOptions({ title: name }); // Set screen title to the user's name
    setMessages([
      {
        _id: 1,
        text: `Welcome to Chat-app, ${name}!`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

 return (
   // View container with background color based on selected color
   //It uses a ternary operator to set white text color for a black background and black text color for other backgrounds.
   <View style={[styles.container, { backgroundColor: bgColor }]}>
     <Text style={{ color: bgColor === '#090C08' ? 'white' : 'black' }}> 
       Welcome to Chat-app!
     </Text>
     <GiftedChat
      messages={messages}
      renderBubble={renderBubble}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1
      }}
    />
    { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
   </View>
   
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default Chat;
