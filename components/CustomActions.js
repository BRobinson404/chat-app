import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CustomActions = ({ wrapperStyle, iconTextStyle, storage, onSend, userID }) => {
  const actionSheet = useActionSheet();

  const onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto()
            return;
          case 2:
            getLocation();
          default:
        }
      },
    );
  };

  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  }

  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  }

  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else Alert.alert("Error occurred while fetching location");
    } else Alert.alert("Permissions haven't been granted.");
  }

  const generateReference = (uri) => {
    // this will get the file name from the uri
    const imageName = uri.split("/")[uri.split("/").length - 1];
    const timeStamp = (new Date()).getTime();
    return `${userID}-${timeStamp}-${imageName}`;
  }

  const uploadAndSendImage = async (imageURI) => {
    console.log("Starting uploadAndSendImage function");
  
    try {
      console.log("Generating unique reference string...");
      const uniqueRefString = generateReference(imageURI);
      console.log("Generated uniqueRefString:", uniqueRefString);
  
      console.log("Creating new upload reference...");
      const newUploadRef = ref(storage, uniqueRefString);
      console.log("New upload reference created:", newUploadRef);
  
      console.log("Fetching image data...");
      const response = await fetch(imageURI);
      console.log("Image data fetched:", response);
  
      console.log("Converting response data to blob...");
      const blob = await response.blob();
      console.log("Blob created:", blob);
  
      console.log("Uploading blob to storage...");
      uploadBytes(newUploadRef, blob).then(async (snapshot) => {
        console.log("Blob uploaded:", snapshot);
  
        console.log("Getting download URL for the uploaded blob...");
        const imageURL = await getDownloadURL(snapshot.ref);
        console.log("Download URL obtained:", imageURL);
  
        console.log("Calling onSend function with image URL...");
        onSend({ image: imageURL });
  
        console.log("uploadAndSendImage function completed successfully");
      });
    } catch (error) {
      console.error("Error during uploadAndSendImage function:", error);
    }
  };
  

  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;