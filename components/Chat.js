import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Chat = ({ route, navigation }) => {
  const { name, bgColor } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name }); // Set screen title to the user's name
  }, []);

 return (
   // View container with background color based on selected color
   //It uses a ternary operator to set white text color for a black background and black text color for other backgrounds.
   <View style={[styles.container, { backgroundColor: bgColor }]}>
     <Text style={{ color: bgColor === '#090C08' ? 'white' : 'black' }}> 
       Welcome to Chat-app!
     </Text>
   </View>
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Chat;
