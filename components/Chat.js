import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';

const Chat = ({ route, navigation, db }) => {
  const { name, bgColor, userId } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = async (newMessages, retries = 3) => {
    try {
      await addDoc(collection(db, "messages"), newMessages[0]);
    } catch (error) {
      if (retries > 0) {
        // Retry the operation after a delay
        setTimeout(() => onSend(newMessages, retries - 1), 1000); // Retry after 1 second
      } else {
        console.error('Failed to send message after retries', error);
      }
    }
  };

  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000",
          borderColor: bgColor === '#090C08' ? 'white' : 'transparent',
          borderWidth: bgColor === '#090C08' ? 2 : 0,
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />;
  };

  useEffect(() => {
    navigation.setOptions({ title: name });

    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          user: {
            _id: data.user._id,
            name: data.user.name,
          },
        };
      });
      setMessages(loadedMessages);
    });

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, [db, name, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={{ color: bgColor === '#090C08' ? 'white' : 'black' }}> 
        Welcome to Chat-app!
      </Text>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={onSend}
        user={{
          _id: userId, // Use the user ID from route.params
          name: name  // Use the name from route.params
        }}
      />
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default Chat;
