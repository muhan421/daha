import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { AuthenticatedUserContext } from "../../App.js";
import { addDoc, Timestamp, collection } from "@firebase/firestore";
import { db } from "../../config/firebase.js";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const AddDahaScreen = ({ navigation }) => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [postText, setPostText] = useState(null);
  const [isNeedByDatePickerVisible, setNeedByDatePickerVisible] =
    useState(false);
  const [isReturnByDatePickerVisible, setReturnByDatePickerVisible] =
    useState(false);

  const [needByDate, setNeedByDate] = useState(new Date());
  const [returnByDate, setReturnByDate] = useState(new Date());

  const showNeedByDatePicker = () => {
    setNeedByDatePickerVisible(true);
  };

  const hideNeedByDatePicker = () => {
    setNeedByDatePickerVisible(false);
  };

  const showReturnByDatePicker = () => {
    setReturnByDatePickerVisible(true);
  };

  const hideReturnByDatePicker = () => {
    setReturnByDatePickerVisible(false);
  };

  const handleConfirmNeedBy = (date) => {
    console.warn("A need date has been picked: ", date);
    setNeedByDate(date);
    hideNeedByDatePicker();
  };

  const handleConfirmReturnBy = (date) => {
    console.warn("A return date has been picked: ", date);
    setReturnByDate(date);
    hideReturnByDatePicker();
  };

  async function postDaha() {
    console.log(needByDate);
    console.log(returnByDate);

    const docRef = await addDoc(collection(db, "dahas"), {
      uidUser: user.uid,
      postText: postText,
      postTime: Timestamp.now(),
      needByDate: needByDate.getTime(),
      returnByDate: returnByDate.getTime(),
    });

    console.log("Document written with ID: ", docRef.id);
    console.log("Daha Post has been added to the DB!!");
    Alert.alert("DAHA posted successfully!!");
    setPostText(null);

    // resets the post screen
    navigation.reset({
      index: 0,
      routes: [{ name: "PostStack" }],
    });

    // TODO: After they post, navigate them to the home screen
    // navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}> Does anyone have a... </Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
          onChangeText={(text) => setPostText(text)}
        />

        <Button title="I need it by..." onPress={showNeedByDatePicker} />
        <DateTimePickerModal
          isVisible={isNeedByDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirmNeedBy}
          onCancel={hideNeedByDatePicker}
        />
        <Button
          title="I can return it by..."
          onPress={showReturnByDatePicker}
        />
        <DateTimePickerModal
          isVisible={isReturnByDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirmReturnBy}
          onCancel={hideReturnByDatePicker}
        />

        <TouchableOpacity style={styles.button} onPress={postDaha}>
          <Text style={{ fontWeight: "bold", color: "white", fontSize: 18 }}>
            {" "}
            Post it!
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    alignSelf: "left",
    marginTop: 30,
    paddingBottom: 12,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },

  whiteSheet: {
    width: "100%",
    height: "75%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: "top",
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: "#a5353a",
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});

export default AddDahaScreen;
