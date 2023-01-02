import React, { useState, useContext } from 'react'
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import { View, Text, Alert, StyleSheet, Image, SafeAreaView, TextInput, Button, TouchableOpacity, ScrollView } from 'react-native';
import { UserInfoContext, AuthenticatedUserContext } from '../../App';
import { addDoc, Timestamp, collection } from '@firebase/firestore';
import { db, storage } from '../../config/firebase.js';
import { uploadBytes, ref } from '@firebase/storage';

const data = [
  { label: 'Apparel', value: '0' },
  { label: 'Tech', value: '1' },
  { label: 'Dorm Essentials', value: '2' },
  { label: 'Other', value: '3' },
];

function AddDawaScreen({ navigation }) {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isUsed, setIsUsed] = useState(false);
  const [isRental, setIsRental] = useState(false);
  const [isBuy, setIsBuy] = useState(false);
  const [isPickup, setIsPickup] = useState(false);
  const [isDropOff, setIsDropOff] = useState(false);

  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  // const [itemCondition, setItemCondition] = useState('');
  // const [itemListType, setItemListType] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [uploading, setUploading] = useState(null);
  // const [itemDelivery, setItemDelivery] = useState('');

  const { user, setUser } = useContext(AuthenticatedUserContext);
  // const { userInfo } = useContext(UserInfoContext)

  const IconButton = ({ onPress, icon }) => (
    <TouchableOpacity style={styles.iconButton} onPress={onPress}>
      {icon}
    </TouchableOpacity>
  );

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }

  };

  const uploadImage = async () => {
    setUploading(true)
    const filename = image.substring(image.lastIndexOf('/') + 1)
    const reference = ref(storage, 'dawas' + filename)
    const img = await fetch(image)
    const bytes = await img.blob()

    try {
      uploadBytes(reference, bytes).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        Alert.alert('Image has been uploaded!!')
      });
    } catch {
      console.log(console.error)
    }
    setUploading(false)
    setImage(null)

  }

  // changes the calue of isNew to the opposite
  const newFunc = () => {
    setIsNew(!isNew);
    isUsed ? setIsUsed(false) : setIsUsed(false);
  };

  const usedFunc = () => {
    setIsUsed(!isUsed);
    isNew ? setIsNew(false) : setIsNew(false);
  };


  async function postDawa() {
    uploadImage()
    return
    const listType = {
      isRental: isRental,
      isBuy: isBuy
    }

    const delivery = {
      isPickup: isPickup,
      isDropOff: isDropOff
    }

    const condition = {
      isNew: isNew,
      isUsed: isUsed
    }

    const docRef = await addDoc(collection(db, "dawas"), {
      uidUser: user.uid,
      itemName: itemName,
      itemCondition: condition,
      listType: listType,
      // converts it to a string representing the category
      itemCategory: data[Number(itemCategory)].label,
      postTime: Timestamp.now(),
      price: itemPrice,
      description: itemDescription,
      // gets the filename that it is being referenced 
      image: image.substring(image.lastIndexOf('/') + 1)
    })

    console.log("Document written with ID: ", docRef.id);
    console.log("Dawa Post has been added to the DB!!");
    Alert.alert('DAWA posted successfully!!')

    // resets the post screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'PostStack' }],
    });


    // TODO: After they post, navigate them to the home screen
    // navigation.navigate('Home');

  }


  return (
    <View style={styles.container}>

      <View style={styles.whiteSheet} />
      <ScrollView style={styles.ScrollView}>
        <SafeAreaView style={styles.form}>
          <Text style={styles.item}> ITEM NAME </Text>
          <TextInput
            style={styles.itemInput}
            autoCapitalize="none"
            autoFocus={true}
            onChangeText={newText => setItemName(newText)} />

          <Text style={styles.photo}> ADD A PHOTO </Text>


          <StatusBar hidden={true} />
          {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}
          <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
            <Ionicons name={"add"} size={20} color="#a5353a" style={{ top: -3, right: 1 }} />
          </TouchableOpacity>
          <StatusBar style="auto" />

          <Text style={styles.category}> CATEGORY </Text>

          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select item' : '...'}
            searchPlaceholder="Search..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValue(item.value);
              setItemCategory(item.value);
              setIsFocus(false);
            }}
          />

          <Text style={styles.condition}> CONDITION </Text>

          <TouchableOpacity onPress={newFunc} style={[styles.newButton, { backgroundColor: isNew ? "#a5353a" : "transparent" }]}
          >
            <Text style={{ fontWeight: 'bold', color: isNew ? 'white' : 'black', fontSize: 10 }}>NEW</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={usedFunc} style={[styles.usedButton, { backgroundColor: isUsed ? "#a5353a" : "transparent" }]}
          >
            <Text style={{ fontWeight: 'bold', color: isUsed ? 'white' : 'black', fontSize: 10 }}>USED</Text>
          </TouchableOpacity>

          <Text style={styles.listingType}> LISTING TYPE </Text>

          <TouchableOpacity onPress={() => { setIsRental(!isRental) }} style={[styles.rentButton, { backgroundColor: isRental ? "#a5353a" : "transparent" }]}
          >
            <Text style={{ fontWeight: 'bold', color: isRental ? 'white' : 'black', fontSize: 10 }}>RENT</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setIsBuy(!isBuy) }} style={[styles.buyButton, { backgroundColor: isBuy ? "#a5353a" : "transparent" }]}
          >
            <Text style={{ fontWeight: 'bold', color: isBuy ? 'white' : 'black', fontSize: 10 }}>BUY</Text>
          </TouchableOpacity>

          <Text style={styles.listingType}> PRICE </Text>
          <TextInput
            style={styles.priceInput}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoFocus={true}
            onChangeText={newText => setItemPrice(newText)} />

          <Text style={styles.descriptionHeader}> DESCRIPTION </Text>
          <TextInput
            multiline
            style={styles.descriptionInput}
            autoCapitalize="none"
            keyboardType="default"
            autoFocus={true}
            onChangeText={newText => setItemDescription(newText)}
          />

          <Text style={styles.deliveryTitle}> MEETUP & DELIVERY </Text>

          <TouchableOpacity onPress={() => { setIsPickup(!isPickup) }} style={[styles.pickUpButton, { backgroundColor: isPickup ? "#a5353a" : "transparent" }]}
          >
            <Text style={{ fontWeight: 'bold', color: isPickup ? 'white' : 'black', fontSize: 10 }}> PICK UP </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setIsDropOff(!isDropOff) }} style={[styles.dropOffButton, { backgroundColor: isDropOff ? "#a5353a" : "transparent" }]}
          >
            <Text style={{ fontWeight: 'bold', color: isDropOff ? 'white' : 'black', fontSize: 10 }}> DROP OFF</Text>
          </TouchableOpacity>


        </SafeAreaView>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={postDawa} >
        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 18 }}> List it!</Text>
      </TouchableOpacity>

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexShrink: 1,
    backgroundColor: "#fff",
    flexDirection: 'row',
    justifyContent: 'center'
  },

  item: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "black",
    alignSelf: "left",
    top: 30,
    paddingBottom: 20,
  },
  photo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "black",
    alignSelf: "left",
    marginTop: 15,
    paddingBottom: 12,
  },

  category: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "black",
    alignSelf: "left",
    marginTop: 30,
    marginBottom: 10,
  },

  listingType: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "black",
    alignSelf: "left",
    marginTop: 20,
    marginBottom: 10
  },

  itemInput: {
    backgroundColor: "#F6F7FB",
    height: 48,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    marginTop: 20
  },

  photoInput: {
    backgroundColor: "#F6F7FB",
    height: 50,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 10,
  },

  whiteSheet: {
    width: '100%',
    height: '75%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: 'top',
    marginHorizontal: 30,
  },
  button: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: "#a5353a",
    height: 58,
    width: '90%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },

  iconButton: {
    backgroundColor: "#F6F7FB",
    height: 40,
    width: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    bottomMargin: 10,
    padding: 12,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  condition: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "black",
    alignSelf: "left",
    marginTop: 20,
  },
  newButton: {
    borderColor: 'black',
    borderWidth: 1,
    height: 38,
    width: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },

  usedButton: {
    borderColor: 'black',
    borderWidth: 1,
    height: 38,
    width: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -38,
    right: -90,
  },

  buyButton: {
    borderColor: 'black',
    borderWidth: 1,
    height: 38,
    width: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -35,
    left: 87,
    bottom: 38,
  },

  rentButton: {
    borderColor: 'black',
    borderWidth: 1,
    height: 38,
    width: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },

  freeButton: {
    borderColor: 'black',
    borderWidth: 1,
    height: 38,
    width: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -38,
    right: -175
  },

  borrowButton: {
    borderColor: 'black',
    borderWidth: 1,
    height: 38,
    width: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -38,
    right: -260
  },

  priceInput: {
    backgroundColor: "#F6F7FB",
    height: 48,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },

  descriptionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "black",
    alignSelf: "left",
    marginTop: 20
  },

  descriptionInput: {
    backgroundColor: "#F6F7FB",
    height: 100,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    marginBottom: 20,
    flexWrap: "wrap",
    overflow: "scroll",
    flexShrink: 1
  },

  deliveryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "black",
    alignSelf: "left",
    marginTop: 20,
    marginBottom: 10
  },

  pickUpButton: {
    borderColor: 'black',
    borderWidth: 1,
    height: 38,
    width: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dropOffButton: {
    borderColor: 'black',
    borderWidth: 1,
    height: 38,
    width: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 100,
    left: 87,
    top: -38
  },

})

export default AddDawaScreen
