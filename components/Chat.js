import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  getDocs,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Chat = ({ route, navigation, db, isConnected }) => {
  const { name, bgColor, userId } = route.params;
  const [messages, setMessages] = useState([]);

  const CACHE_KEY = 'cachedMessages'; // Key for caching messages in AsyncStorage

  const onSend = (newMessages) => {
    addDoc(collection(db, 'messages'), newMessages[0]);
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

    let unsubMessages;

    // Function to fetch messages from Firestore
    const fetchMessagesFromFirestore = async () => {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const newMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: new Date(doc.data().createdAt.toMillis()),
      }));

      setMessages(newMessages);

      // Cache the fetched messages in AsyncStorage
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(newMessages));
    };

    // Load cached messages from local storage
    const loadCachedMessages = async () => {
      try {
        const cachedMessages = await AsyncStorage.getItem(CACHE_KEY);
        if (cachedMessages !== null) {
          setMessages(JSON.parse(cachedMessages));
        }
      } catch (error) {
        console.error('Error loading cached messages:', error);
      }
    };

    if (isConnected) {
      fetchMessagesFromFirestore();
    } else {
      loadCachedMessages();
    }

    // Subscribe to real-time updates when there's a connection
    if (isConnected) {
      const unsubMessages = onSnapshot(
        collection(db, 'messages'),
        (querySnapshot) => {
          const newMessages = [];
          querySnapshot.forEach((doc) => {
            newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          })
        });

          setMessages(newMessages);

          // Cache the updated messages in AsyncStorage
          AsyncStorage.setItem(CACHE_KEY, JSON.stringify(newMessages));
        }
      );

      return () => {
        unsubMessages(); // Unsubscribe the listener on cleanup
      };
    } else {
      loadCachedMessages(); // Call the function for offline mode
    }
  }, [db, isConnected, navigation]);

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
            _id: userId,
            name: name,
          }}
          renderInputToolbar={props =>
            isConnected ? <InputToolbar {...props} /> : null // Render InputToolbar only if isConnected is true
          }
        />
        {!isConnected && (
          <Text style={{ color: 'red' }}>Offline: Cannot compose new messages.</Text>
          // Display offline message below the GiftedChat
        )}  
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
