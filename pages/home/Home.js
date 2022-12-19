import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Dimensions, Button, Linking, ImageBackground, FlatList, PixelRatio, Modal } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSolid, faUser, faPlus, faUpLong, faMagnifyingGlass, faCheck, faLocationPin, faEnvelope, faLock, faGear, faX } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Navbar } from '../../components/Navbar';
import { Styling } from '../../Styling';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scaleWidth = SCREEN_WIDTH / 360;
const scaleHeight = SCREEN_HEIGHT / 800;

const WidthRatio = (size) => {
  const newSize = size * scaleWidth;
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
}

const HeightRatio = (size) => {
  const newSize = size * scaleHeight;
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
}

export const HomeScreen = ({ navigation }) => {
  const [userID, setUserID] = useState('');
  const [authState, setAuthState] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const colors = [
    { value: 'red', gradient: ['#4f000b', '#ff595e'], image: require('../../assets/dalle_1.png'), id: 0 },
    { value: 'orange', gradient: ['#b21e35', '#faa307'], image: require('../../assets/dalle_4.png'), id: 1 },
    { value: 'green', gradient: ['#132a13', '#83e377'], image: require('../../assets/dalle_2.png'), id: 2 },
    { value: 'blue', gradient: ['#00171f', '#0466c8'], image: require('../../assets/dalle_3.png'), id: 3 },
    { value: 'purple', gradient: ['#240046', '#c77dff'], image: require('../../assets/dalle_5.png'), id: 4 },
    { value: '#0b132b', gradient: ['#0b132b', '#3a506b'], image: require('../../assets/dalle_7.png'), id: 5 },
  ];

  const CheckAuthState = async () => {
    let value = await AsyncStorage.getItem('@authState')
    if (value === 'true') {
      setAuthState(true);
    } else if (value === 'false') {
      setAuthState(false);
    }
  }

  const CurrentUser = async () => {
    let value = await AsyncStorage.getItem('@userID', value);
    setUserID(value);
  }

  const selectColor = async (color) => {
    console.log(color)
    // setSelectedColor(color);
    try {
      const jsonValue = JSON.stringify(color)
      await AsyncStorage.setItem('selectedColor', jsonValue);
      setSelectedColor(color)
    } catch (e) {
      console.error(e)
    }
  };

  const getSelectedColor = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('selectedColor')
      if (jsonValue != null) {
        let color = JSON.parse(jsonValue)
        setSelectedColor(color)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const DisplayGradient = (props) => {
    return (
      <>
        <Image source={props.image} style={{ ...Styling.background, opacity: 0.4 }} />
        <LinearGradient
          colors={props.gradient}
          style={{ ...Styling.background, opacity: 0.5 }}
        />
      </>
    )
  }




  // const selectedLevel = getSelectedLevel();
  // console.log(selectedLevel); // Outputs 'Easy'
  let buttonArray = [];
  let demoText = ["", "E", "", "", "", "", "Q", "", "", "", "P", "U", "T", "T", "Y", "", "I", "", "", "", "", "P", "", "", "", "", "", "", ""]
  const DemoGrid = () => {
    for (let i = 0; i < 25; i++) {
      buttonArray[i] =
        <View key={i}>
          {i == 11 ?
            <LinearGradient
              // Button Linear Gradient
              colors={['#ffba08', '#faa307']}
              style={Styling.gridBlock}
            >
              <TouchableOpacity
                onPress={() => console.log(i)}
              >
                <Text
                  style={Styling.letters}
                  allowFontScaling={false}
                >
                  {demoText[i]}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
            :
            <LinearGradient
              // Button Linear Gradient
              colors={['#f8f9fa', '#ced4da']}
              style={Styling.gridBlock}
            >
              <TouchableOpacity
                onPress={() => console.log(i)}
              >
                <Text
                  style={Styling.letters}
                  allowFontScaling={false}
                >
                  {demoText[i]}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          }
        </View>
    }

    return buttonArray;
  }

  useEffect(() => {
    CheckAuthState();
    CurrentUser();
  }, [])

  useEffect(() => {
    getSelectedColor();
  }, [selectedColor])




  return (
    <>
      <View style={Styling.container}>
        <Navbar nav={navigation} auth={authState} position={'relative'} from={'home'} />
        <View>
          {selectedColor && selectedColor.gradient && selectedColor.image ?
            <DisplayGradient gradient={selectedColor.gradient} image={selectedColor.image} />
            :
            <>
              <Image source={require('../../assets/dalle_7.png')} style={{ ...Styling.background, opacity: 0.4 }} />
              <LinearGradient
                colors={['#0b132b', '#3a506b']}
                style={{ ...Styling.background, opacity: 0.5 }}
              />
            </>
          }
          <SafeAreaView style={Styling.scrollContainer}>
            <ScrollView style={Styling.scrollView}>

              <View
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  marginTop: windowHeight / 24,
                  padding: 20,
                  marginLeft: 10,
                  marginRight: 10,
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 50,

                }}
              >
                <Text
                  style={{ color: 'white', fontSize: HeightRatio(24), fontWeight: 'bold', alignSelf: 'center', marginTop: 10 }}
                  allowFontScaling={false}
                >
                  Choose a background color:
                </Text>

                <View style={Styling.circlecontainer}>
                  {colors.map((color) => (
                    <TouchableOpacity
                      key={color.id}
                      style={[Styling.circle, { backgroundColor: color.value }]}
                      onPress={() => selectColor(color)}
                    />
                  ))}
                </View>
              </View>
              <View
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  marginTop: 20,
                  padding: 20,
                  marginLeft: 5,
                  marginRight: 5,
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 50,
                }}
              >
                <Text
                  style={{ color: 'white', fontSize: HeightRatio(24), fontWeight: 'bold', alignSelf: 'center', marginTop: 10 }}
                  allowFontScaling={false}
                >
                  How to play:
                </Text>
                <View
                  style={{
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: HeightRatio(8),
                    width: windowWidth * 0.8

                  }}
                >
                  <DemoGrid />
                </View>
                {/* #1 */}
                <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: 20,
                      width: windowWidth * 0.12,
                      height: windowWidth * 0.09,
                      marginRight: 10,
                      marginTop: 10,
                      borderLeftColor: 'rgba(255, 255, 255, 0.5)',
                      borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 30,
                    }}
                  >
                    <Text
                      style={{ color: 'white', fontSize: HeightRatio(25), fontWeight: 'bold', alignSelf: 'center' }}
                      allowFontScaling={false}
                    >
                      1
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: '#ffba08', fontSize: HeightRatio(25), fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth / 1.4 }}>
                      Two words will appear.
                    </Text>
                  </View>
                </View>
                {/* #2 */}
                <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: 20,
                      width: windowWidth * 0.12,
                      height: windowWidth * 0.09,
                      marginRight: 10,
                      marginTop: 10,
                      borderLeftColor: 'rgba(255, 255, 255, 0.5)',
                      borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 30,
                    }}
                  >
                    <Text
                      style={{ color: 'white', fontSize: HeightRatio(25), fontWeight: 'bold', alignSelf: 'center' }}
                      allowFontScaling={false}
                    >
                      2
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: '#ffba08', fontSize: HeightRatio(25), fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth / 1.4 }}>
                      One letter will be revealed.
                    </Text>
                    <Text style={{ color: 'white', fontSize: HeightRatio(20), fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth / 1.5 }}>
                      That letter will always be the overlapping letter.
                    </Text>
                  </View>
                </View>
                {/* #3 */}
                <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: 20,
                      width: windowWidth * 0.12,
                      height: windowWidth * 0.09,
                      marginRight: 10,
                      marginTop: 10,
                      borderLeftColor: 'rgba(255, 255, 255, 0.5)',
                      borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 30,
                    }}
                  >
                    <Text
                      style={{ color: 'white', fontSize: HeightRatio(25), fontWeight: 'bold', alignSelf: 'center' }}
                      allowFontScaling={false}
                    >
                      3
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: '#ffba08', fontSize: HeightRatio(25), fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth / 1.4 }}>
                      Guess that letter.
                    </Text>
                    <Text style={{ color: 'white', fontSize: HeightRatio(20), fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth / 1.5 }}>
                      If you are lucky, the overlapping letter may appear in other places!
                    </Text>
                  </View>
                </View>
                {/* #4 */}
                <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: 20,
                      width: windowWidth * 0.12,
                      height: windowWidth * 0.09,
                      marginRight: 10,
                      marginTop: 10,
                      borderLeftColor: 'rgba(255, 255, 255, 0.5)',
                      borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 30,
                    }}
                  >
                    <Text
                      style={{ color: 'white', fontSize: HeightRatio(25), fontWeight: 'bold', alignSelf: 'center' }}
                      allowFontScaling={false}
                    >
                      4
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: '#ffba08', fontSize: HeightRatio(25), fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth / 1.4 }}>
                      You have 12 guesses.
                    </Text>
                  </View>
                </View>
                {/* #5 */}
                <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: 20,
                      width: windowWidth * 0.12,
                      height: windowWidth * 0.09,
                      marginRight: 10,
                      marginTop: 10,
                      borderLeftColor: 'rgba(255, 255, 255, 0.5)',
                      borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 30,
                    }}
                  >
                    <Text
                      style={{ color: 'white', fontSize: HeightRatio(25), fontWeight: 'bold', alignSelf: 'center' }}
                      allowFontScaling={false}
                    >
                      5
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: '#ffba08', fontSize: HeightRatio(25), fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth / 1.4 }}>
                      Score points are based on time and guesses.
                    </Text>
                    <Text style={{ color: 'white', fontSize: HeightRatio(20), fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth / 1.5 }}>
                      +20 points if you guess both words within 12 guesses and under 30 seconds.
                    </Text>
                    <Text style={{ color: 'white', fontSize: HeightRatio(20), fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth / 1.5 }}>
                      +10 points if you guess both words within 12 guesses and under 60 seconds.
                    </Text>
                    <Text style={{ color: 'white', fontSize: HeightRatio(20), fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth / 1.5 }}>
                      +5 points if you guess both words within 12 guesses and under 90 seconds.
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ marginBottom: 400 }}></View>
            </ScrollView>
          </SafeAreaView>
        </View>

      </View>
      <StatusBar
        barStyle="default"
        hidden={false}
        backgroundColor="transparent"
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
    </>
  );
}

