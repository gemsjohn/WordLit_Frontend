import React, { useEffect, useState, useRef, useContext } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Dimensions, Button, Linking, ImageBackground, FlatList, PixelRatio, Modal } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSolid, faUser, faPlus, faUpLong, faMagnifyingGlass, faCheck, faLocationPin, faEnvelope, faLock, faGear, faX } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Navbar } from '../../components/Navbar';
import { Styling } from '../../Styling';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../utils/queries';
import { MainStateContext } from '../../App';
import { CommonActions } from '@react-navigation/native';

import * as SecureStore from 'expo-secure-store';

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

const resetActionAuth = CommonActions.reset({
  index: 1,
  routes: [{ name: 'Auth', params: {} }]
});


export const HomeScreen = ({ navigation }) => {
  const { mainState, setMainState } = useContext(MainStateContext);
  const userID = useRef(false);
  const authState = useRef(false);
  const [displaySignUpModal, setDisplaySignUpModal] = useState(false);
  const [displayUsername, setDisplayUsername] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(false);

  const colors = [
    { value: 'red', gradient: ['#4f000b', '#ff595e'], image: require('../../assets/dalle_1.png'), id: 0 },
    { value: 'orange', gradient: ['#b21e35', '#faa307'], image: require('../../assets/dalle_4.png'), id: 1 },
    { value: 'green', gradient: ['#132a13', '#83e377'], image: require('../../assets/dalle_2.png'), id: 2 },
    { value: 'blue', gradient: ['#00171f', '#0466c8'], image: require('../../assets/dalle_3.png'), id: 3 },
    { value: 'purple', gradient: ['#240046', '#c77dff'], image: require('../../assets/dalle_5.png'), id: 4 },
    { value: '#0b132b', gradient: ['#0b132b', '#3a506b'], image: require('../../assets/dalle_7.png'), id: 5 },
  ];

  const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { id: mainState.current.userID }
  });


  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result && authState.current) {
      setDisplayUsername(true)
    } else if (!result && !authState.current) {
      setDisplaySignUpModal(true)
      setDisplayUsername(false)
    }
  }

  // const CheckAuthState = async () => {
  //   let value = await AsyncStorage.getItem('@authState')
  //   if (value === 'true') {
  //     setAuthState(true);
  //   } else if (value === 'false') {
  //     setAuthState(false);
  //   }
  // }

  // const CurrentUser = async () => {
  //   let value = await AsyncStorage.getItem('@userID', value);
  //   setUserID(value);
  // }

  const selectColor = async (color) => {
    // console.log(color)
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
              <View
                accessible={true}
                accessibilityLabel="Example grid."
              >
                <Text
                  style={Styling.letters}
                  allowFontScaling={false}
                  accessible={true}
                  accessibilityLabel="Revealed letter."
                >
                  {demoText[i]}
                </Text>
              </View>
            </LinearGradient>
            :
            <LinearGradient
              // Button Linear Gradient
              colors={['#f8f9fa', '#ced4da']}
              style={Styling.gridBlock}
            >
              <View
                accessible={true}
                accessibilityLabel="Example grid."
              >
                <Text
                  style={Styling.letters}
                  allowFontScaling={false}
                  accessible={true}
                  accessibilityLabel="Example block."
                >
                  {demoText[i]}
                </Text>
              </View>
            </LinearGradient>
          }
        </View>
    }

    return buttonArray;
  }



  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      authState.current = mainState.current.authState
      userID.current = mainState.current.userID;


      getValueFor('cosmicKey')
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }, 500)
  }, [])

  useEffect(() => {
    getSelectedColor();
  }, [selectedColor])




  return (
    <>
      <View style={{ ...Styling.container, backgroundColor: 'black', }}>
        <StatusBar
          barStyle="default"
          hidden={false}
          backgroundColor="transparent"
          translucent={true}
          networkActivityIndicatorVisible={true}
        />
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
                  padding: HeightRatio(20),
                  borderRadius: HeightRatio(20),
                  borderWidth: 2,
                  borderColor: '#ff0076',
                  margin: HeightRatio(10),
                  marginTop: windowHeight / 24
                }}
              >
                {displayUsername ?
                  <>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        source={require('../../assets/block_logo.png')}
                        style={{ height: HeightRatio(50), width: HeightRatio(50), alignSelf: 'center' }}
                      />
                      <Text style={{
                        color: 'white',
                        fontSize: HeightRatio(30),
                        fontWeight: 'bold',
                        textAlign: 'center'
                      }}
                        allowFontScaling={false}
                        ellipsizeMode='tail'
                        numberOfLines={1}>
                        {userByID?.user.username.toUpperCase()}
                      </Text>
                    </View>
                  </>
                  :
                  <>
                    <View style={{}}>
                      <Image
                        source={require('../../assets/feature_graphic.png')}
                        style={{ height: HeightRatio(75), width: HeightRatio(150) }}
                      />
                    </View>
                  </>

                }
              </View>

              <View
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  margin: HeightRatio(10),
                  marginTop: 20,
                  padding: 20,
                  // marginLeft: 5,
                  // marginRight: 5,
                  borderRadius: 10,
                  borderBottomLeftRadius: 50,
                  borderWidth: 2,
                  borderColor: '#ff0076',

                }}
              >

                <Text
                  style={{ color: 'white', fontSize: HeightRatio(40), fontWeight: 'bold', alignSelf: 'center', marginTop: 10 }}
                  allowFontScaling={false}
                >
                  How to Play
                </Text>
                <View
                  style={{
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: HeightRatio(8),
                    width: windowWidth * 0.9

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
                      +100 points if you guess both words within 12 guesses and under 20 seconds.
                    </Text>
                    <Text style={{ color: 'white', fontSize: HeightRatio(20), fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth / 1.5 }}>
                      +80 points if you guess both words within 12 guesses and under 40 seconds.
                    </Text>
                    <Text style={{ color: 'white', fontSize: HeightRatio(20), fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth / 1.5 }}>
                      +40 points if you guess both words within 12 guesses and under 60 seconds.
                    </Text>
                    <Text style={{ color: 'white', fontSize: HeightRatio(20), fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth / 1.5 }}>
                      +20 points if you guess both words within 12 guesses and under 80 seconds.
                    </Text>
                    <Text style={{ color: 'white', fontSize: HeightRatio(20), fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth / 1.5 }}>
                      +10 points if you guess both words within 12 guesses and under 100 seconds.
                    </Text>
                    <Text style={{ color: 'white', fontSize: HeightRatio(20), fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth / 1.5 }}>
                      +5 points if you guess both words within 12 guesses.
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ marginBottom: 400 }}></View>
            </ScrollView>
          </SafeAreaView>
        </View>

      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={displaySignUpModal}
        onRequestClose={() => {
          setDisplaySignUpModal(!displaySignUpModal);
        }}
      >
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <View style={{ backgroundColor: '#161b21', borderTopRightRadius: HeightRatio(10) }}>
            {/* <LinearGradient
              colors={['#261823', '#792555']}
              style={{ flex: 1, borderWidth: 4 }}
            > */}
            <View
              style={{
                backgroundColor: 'rgba(255, 0, 0, 1)',
                alignSelf: 'center',
                borderRadius: 8,
                position: 'absolute',
                zIndex: 10,
                top: 0,
                right: 0
              }}
            >
              <TouchableOpacity
                onPress={() => { setDisplaySignUpModal(!displaySignUpModal); }}
                style={{
                  borderRadius: 10,
                  height: 50,
                  width: 50
                }}
              >
                <FontAwesomeIcon
                  icon={faSolid, faX}
                  style={{
                    color: 'white',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginTop: 17
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'column' }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: HeightRatio(30),
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginTop: HeightRatio(20)
                }}
                allowFontScaling={false}>
                SIGN UP!
              </Text>
              <View style={{ height: 10 }}></View>
              <Text
                style={{
                  color: 'white',
                  fontSize: HeightRatio(20),
                  fontWeight: 'bold',
                  width: windowWidth * 0.9,
                  alignSelf: 'center'
                }}
                allowFontScaling={false}>
                Enhance your gaming experience and put your skills on display by
                signing up or logging in and climbing to the top of the leaderboard!
              </Text>
              <View style={{ height: 10 }}></View>

              <TouchableOpacity
                onPress={() => navigation.dispatch(resetActionAuth)}
                style={{ ...Styling.modalWordButton, marginTop: 10 }}
              >
                <View style={{
                  // backgroundColor: '#09e049',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  padding: HeightRatio(20),
                  borderRadius: HeightRatio(40),
                  alignSelf: 'center',
                  marginTop: HeightRatio(20),
                  // margin: HeightRatio(10),
                  width: WidthRatio(300)
                }}>
                  <LinearGradient
                    colors={['#0b132b', '#181d21']}
                    style={{
                      ...Styling.background,
                      height: HeightRatio(60),
                      borderRadius: HeightRatio(80),
                      borderWidth: 2,
                      borderColor: '#ff0076',
                      opacity: 0.9
                    }}
                  />
                  <Text
                    style={{
                      color: 'white',
                      fontSize: HeightRatio(20),
                      fontWeight: 'bold',
                      alignSelf: 'center'
                    }}
                    allowFontScaling={false}
                  >
                    SIGN UP OR LOGIN
                  </Text>
                </View>
              </TouchableOpacity>


            </View>
            {/* </LinearGradient> */}
          </View>
        </View>
      </Modal>

    </>
  );
}

