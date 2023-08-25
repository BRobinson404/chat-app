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
import MapView from 'react-native-maps';
import CustomActions from './CustomActions.js';

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { name, bgColor, userId } = route.params;
  const [messages, setMessages] = useState([]);

  const CACHE_KEY = 'cachedMessages'; // Key for caching messages in AsyncStorage

  const onSend = (newMessages) => {
    addDoc(collection(db, 'messages'), newMessages[0]);
  };

  const renderCustomActions = (props) => {
    return <CustomActions  userId={userId} storage={storage} {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage} = props;
    if (currentMessage.location) {
      return (
          <MapView
            style={{width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3}}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
      );
    }
    return null;
  }

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
  

  
    // Function to fetch messages from Firestore
    const fetchMessagesFromFirestore = async () => {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
  
      const newMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: new Date(doc.data().createdAt.toMillis()),
      }));
  
      // Sort the new messages based on createdAt timestamp
      const sortedMessages = newMessages.sort((a, b) => b.createdAt - a.createdAt);
  
      setMessages(sortedMessages);
  
      // Cache the fetched messages in AsyncStorage
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(sortedMessages));
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
            });
          });
  
          // Sort the new messages based on createdAt timestamp
          const sortedMessages = newMessages.sort((a, b) => b.createdAt - a.createdAt);
  
          setMessages(sortedMessages);
  
          // Cache the updated messages in AsyncStorage
          AsyncStorage.setItem(CACHE_KEY, JSON.stringify(sortedMessages));
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
          renderActions={renderCustomActions}
          renderCustomView={renderCustomView}
          messages={messages}
          storage={storage}
          renderBubble={renderBubble}
          onSend={messages => onSend(messages)}
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
  logoutButton: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#C00",
    padding: 10,
    zIndex: 1
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 10
  }
});

export default Chat;
