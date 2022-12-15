import React, { useEffect, useState, useRef } from 'react';
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache, useMutation, useQuery } from "@apollo/client";
import { setContext } from '@apollo/link-context';
import jwtDecode from "jwt-decode";
import { LOGIN_USER, ADD_USER } from './utils/mutations';
import { GET_USER_BY_ID, LEADERBOARD } from './utils/queries';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Dimensions, Button, Linking, ImageBackground, FlatList } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSolid, faUser, faPlus, faUpLong, faMagnifyingGlass, faCheck, faLocationPin, faEnvelope, faLock, faGear } from '@fortawesome/free-solid-svg-icons';
import { Navbar } from './Navbar';
import { Profile } from './Profile';
import { Loading } from './components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Grid } from './Grid';
import { dalle_1 } from './assets/dalle_1.png';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function HomeScreen({ navigation }) {
  const [userID, setUserID] = useState('');
  const [authState, setAuthState] = useState(false);

  const [selectedColor, setSelectedColor] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  // const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
  const colors = [
    { value: 'red', gradient: ['#4f000b', '#ff595e'], image: require('./assets/dalle_1.png'), id: 0 },
    { value: 'orange', gradient: ['#b21e35', '#faa307'], image: require('./assets/dalle_4.png'), id: 1 },
    { value: 'green', gradient: ['#132a13', '#83e377'], image: require('./assets/dalle_2.png'), id: 2 },
    { value: 'blue', gradient: ['#00171f', '#0466c8'], image: require('./assets/dalle_3.png'), id: 3 },
    { value: 'purple', gradient: ['#240046', '#c77dff'], image: require('./assets/dalle_5.png'), id: 4 },
    { value: '#0b132b', gradient: ['#0b132b', '#3a506b'], image: require('./assets/dalle_7.png'), id: 5 },
  ];

  const CheckAuthState = async () => {
    let value = await AsyncStorage.getItem('@authState')
    if (value === 'true') {
      setAuthState(true)
    } else if (value === 'false') {
      setAuthState(false)
    }
  }


  const CurrentUser = async () => {
    let value = await AsyncStorage.getItem('@userID', value);
    setUserID(value)
  }


  const selectColor = async (color) => {
    // console.log(color)
    setSelectedColor(color);
    try {
      const jsonValue = JSON.stringify(color)
      await AsyncStorage.setItem('selectedColor', jsonValue);
    } catch (e) {
      console.error(e)
    }
  };

  const getSelectedColor = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('selectedColor')
      if (jsonValue != null) {
        let color = JSON.parse(jsonValue)
        // console.log(color)
        setSelectedColor(color);
      }
    } catch (e) {
      // error reading value
    }
  }


  useEffect(() => {
    CheckAuthState();
    CurrentUser();
    getSelectedColor();
  }, [])


  const DisplayGradient = (props) => {
    return (
      <>
        <Image source={props.image} style={{ ...styles.background, opacity: 0.4 }} />
        <LinearGradient
          colors={props.gradient}
          style={{ ...styles.background, opacity: 0.5 }}
        />
      </>
    )
  }



  // useEffect(() => {
  //   // DisplayGradient(selectColor)
  // }, [selectedColor])

  // const LEVEL_KEY = 'selected_level';

  const selectLevel = async (level) => {
    // console.log(level)
    try {
      await AsyncStorage.setItem('LEVEL_KEY', level);
    } catch (error) {
      console.error(error);
    }
  };

  // const selectedLevel = getSelectedLevel();
  // console.log(selectedLevel); // Outputs 'Easy'
  let buttonArray = [];
  let demoText = ["", "E", "", "", "", "", "Q", "", "", "", "P", "U", "T", "T", "Y", "", "I", "", "", "", "", "P", "", "", "", "", "", "", ""]
  const DemoGrid = () => {
    for (let i = 0; i < 25; i++) {
      buttonArray[i] =
        <View key = {i}>
        {i == 11 ?
          <LinearGradient
            // Button Linear Gradient
            colors={['#ffba08', '#faa307']}
            style={{
              height: windowWidth / 6.5,
              width: windowWidth / 6.5,
              margin: 2
              // backgroundColor: '#f9c74f'
            }}
          >
            <TouchableOpacity
              onPress={() => console.log(i)}
            >
              <Text style={styles.letters}>{demoText[i]}</Text>
            </TouchableOpacity>
          </LinearGradient>
          :
          <LinearGradient
            // Button Linear Gradient
            colors={['#f8f9fa', '#ced4da']}
            style={{
              height: windowWidth / 6.5,
              width: windowWidth / 6.5,
              margin: 2
              // backgroundColor: '#f9c74f'
            }}
          >
            <TouchableOpacity
              onPress={() => console.log(i)}
            >
              <Text style={styles.letters}>{demoText[i]}</Text>
            </TouchableOpacity>
          </LinearGradient>
          }
        </View>
    }

    return buttonArray;
  }




  return (
    <>
    {/* <View style={{backgroundColor: 'red', height: 100, width: windowWidth, position: 'absolute', zIndex: 10}}></View> */}
      <View style={styles.container}>
       
        {selectedColor && selectedColor.gradient && selectedColor.image ?
          <>
          <DisplayGradient gradient={selectedColor.gradient} image={selectedColor.image} />
          
          </>
          :
          <>
            <Image source={require('./assets/dalle_7.png')} style={{ ...styles.background, opacity: 0.4 }} />
            <LinearGradient
              colors={['#0b132b', '#3a506b']}
              style={{ ...styles.background, opacity: 0.5 }}
            />
          </>
        }
        
        <Navbar nav={navigation} auth={authState} position={'relative'} from={'settings'} />
        <SafeAreaView style={styles.scrollContainer}>
        <ScrollView style={styles.scrollView}>
        
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              marginTop: windowHeight/24,
              padding: 20,
              marginLeft: 10,
              marginRight: 10,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 50,
              
            }}
          >
            <Text style={{ color: 'white', fontSize: windowWidth*0.06, fontWeight: 'bold', alignSelf: 'center', marginTop: 10 }}>Choose a background color:</Text>

            <View style={styles.circlecontainer}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[styles.circle, { backgroundColor: color.value }]}
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
            <Text style={{ color: 'white', fontSize: windowWidth*0.06, fontWeight: 'bold', alignSelf: 'center', marginTop: 10 }}>
              How to play:
            </Text>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 20
              }}
            >
              <DemoGrid />
            </View>
            {/* #1 */}
            <View style={{flexDirection: 'row', marginTop:5, marginBottom: 5}}>
              <View 
                style={{
                  // flexDirection: 'column', 
                  // margin: 5, 
                  // backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                  // width: 50, 
                  // height: 50, 
                  // borderRadius: 50
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 20,
                  width: windowWidth*0.12,
                  height: windowWidth*0.09,
                  marginRight: 10,
                  marginTop: 10,
                  // borderLeftWidth: 1, 
                  // borderBottomWidth: 1, 
                  borderLeftColor: 'rgba(255, 255, 255, 0.5)',
                  borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 30,
                }}
              >
                <Text style={{ color: 'white', fontSize: windowWidth*0.06, fontWeight: 'bold', alignSelf: 'center' }}>
                  1
                </Text>
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text style={{ color: '#ffba08', fontSize: windowWidth*0.06, fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth/1.4  }}>
                  Two words will appear.
                </Text>
              </View>
            </View>
            {/* #2 */}
            <View style={{flexDirection: 'row', marginTop:5, marginBottom: 5}}>
            <View 
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 20,
                  width: windowWidth*0.12,
                  height: windowWidth*0.09,
                  marginRight: 10,
                  marginTop: 10,
                  // borderLeftWidth: 1, 
                  // borderBottomWidth: 1, 
                  borderLeftColor: 'rgba(255, 255, 255, 0.5)',
                  borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 30,
                }}
              >
                <Text style={{ color: 'white', fontSize: windowWidth*0.06, fontWeight: 'bold', alignSelf: 'center' }}>
                  2
                </Text>
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text style={{ color: '#ffba08', fontSize: windowWidth*0.06, fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth/1.4 }}>
                  One letter will be revealed.
                </Text>
                <Text style={{ color: 'white', fontSize: windowWidth*0.04, fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth/1.5  }}>
                  That letter will always be the overlapping letter. 
                </Text>
              </View>
            </View>
            {/* #3 */}
            <View style={{flexDirection: 'row', marginTop:5, marginBottom: 5}}>
              <View 
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 20,
                  width: windowWidth*0.12,
                  height: windowWidth*0.09,
                  marginRight: 10,
                  marginTop: 10,
                  // borderLeftWidth: 1, 
                  // borderBottomWidth: 1, 
                  borderLeftColor: 'rgba(255, 255, 255, 0.5)',
                  borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 30,
                }}
              >
                <Text style={{ color: 'white', fontSize: windowWidth*0.06, fontWeight: 'bold', alignSelf: 'center' }}>
                  3
                </Text>
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text style={{ color: '#ffba08', fontSize: windowWidth*0.06, fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth/1.4 }}>
                Guess that letter.
                </Text>
                <Text style={{ color: 'white', fontSize: windowWidth*0.04, fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth/1.5 }}>
                If you are lucky, the overlapping letter may appear in other places!
                </Text>
              </View>
            </View>
            {/* #4 */}
            <View style={{flexDirection: 'row', marginTop:5, marginBottom: 5}}>
              <View 
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 20,
                  width: windowWidth*0.12,
                  height: windowWidth*0.09,
                  marginRight: 10,
                  marginTop: 10,
                  // borderLeftWidth: 1, 
                  // borderBottomWidth: 1, 
                  borderLeftColor: 'rgba(255, 255, 255, 0.5)',
                  borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 30,
                }}
              >
                <Text style={{ color: 'white', fontSize: windowWidth*0.06, fontWeight: 'bold', alignSelf: 'center' }}>
                  4
                </Text>
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text style={{ color: '#ffba08', fontSize: windowWidth*0.06, fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth/1.4 }}>
                  You have 12 guesses.
                </Text>
              </View>
            </View>
            {/* #5 */}
            <View style={{flexDirection: 'row', marginTop:5, marginBottom: 5}}>
              <View 
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 20,
                  width: windowWidth*0.12,
                  height: windowWidth*0.09,
                  marginRight: 10,
                  marginTop: 10,
                  // borderLeftWidth: 1, 
                  // borderBottomWidth: 1, 
                  borderLeftColor: 'rgba(255, 255, 255, 0.5)',
                  borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 30,
                }}
              >
                <Text style={{ color: 'white', fontSize: windowWidth*0.06, fontWeight: 'bold', alignSelf: 'center' }}>
                  5
                </Text>
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text style={{ color: '#ffba08', fontSize: windowWidth*0.06, fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth/1.4 }}>
                  Score points are based on time and guesses.
                </Text>
                <Text style={{ color: 'white', fontSize: windowWidth*0.04, fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth/1.5 }}>
                  +20 points if you guess both words within 12 guesses and under 30 seconds.
                </Text>
                <Text style={{ color: 'white', fontSize: windowWidth*0.04, fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth/1.5 }}>
                  +10 points if you guess both words within 12 guesses and under 60 seconds.
                </Text>
                <Text style={{ color: 'white', fontSize: windowWidth*0.04, fontWeight: 'bold', alignSelf: 'center', marginTop: 10, width: windowWidth/1.5 }}>
                  +5 points if you guess both words within 12 guesses and under 90 seconds.
                </Text>
              </View>
            </View>
          </View> 
          <View style={{marginBottom: 400}}></View>
        </ScrollView>
        </SafeAreaView>
        {/* <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            marginTop: 10,
            padding: 20,
            marginLeft: 10,
            marginRight: 10,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 50,
          }}
        >
          <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', alignSelf: 'center', marginTop: 20 }}>Choose a difficulty level :</Text>
          <View>

            <TouchableOpacity onPress={() => selectLevel('easy')}>
              <LinearGradient
                colors={['#99e2b4', '#78c6a3']}
                style={styles.difficultyButton}
              >
                <Text style={styles.difficultyText}>Easy</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectLevel('medium')}>
              <LinearGradient
                colors={['#ffe169', '#edc531']}
                style={styles.difficultyButton}
              >
                <Text style={styles.difficultyText}>Medium</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectLevel('hard')}>
              <LinearGradient
                colors={['#e01e37', '#c71f37']}
                style={styles.difficultyButton}
              >
                <Text style={styles.difficultyText}>Hard</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View> */}
      </View>
      
      <StatusBar
        barStyle="light-content"
        hidden={false}
        // backgroundColor="black"
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
    </>
  );
}

const GameScreen = ({ navigation }) => {
  const [userID, setUserID] = useState('');
  const [authState, setAuthState] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  const CheckAuthState = async () => {
    let value = await AsyncStorage.getItem('@authState')
    if (value === 'true') {
      setAuthState(true)
    } else if (value === 'false') {
      setAuthState(false)
    }
  }


  const CurrentUser = async () => {
    let value = await AsyncStorage.getItem('@userID', value);
    setUserID(value)
  }

  const getSelectedColor = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('selectedColor')
      if (jsonValue != null) {
        let color = JSON.parse(jsonValue)
        setSelectedColor(color)
      }
    } catch (e) {
      // error reading value
    }
  }

  const DisplayGradient = (props) => {
    return (
      <>
        <Image source={props.image} style={{ ...styles.background, opacity: 0.4 }} />
        <LinearGradient
          colors={props.gradient}
          style={{ ...styles.background, opacity: 0.5 }}
        />
      </>
    )
  }


  useEffect(() => {
    CheckAuthState();
    CurrentUser();
    getSelectedColor();
  }, [])

  const getSelectedLevel = async () => {
    try {
      const value = await AsyncStorage.getItem('LEVEL_KEY');
      if (value !== null) {
        // console.log(value)
      }
    } catch (error) {
      console.error(error);
    }
  };
  getSelectedLevel();

  return (
    <>
      <View style={styles.container}>
        {selectedColor && selectedColor.gradient && selectedColor.image ?
          <DisplayGradient gradient={selectedColor.gradient} image={selectedColor.image} />
          :
          <>
            <Image source={require('./assets/dalle_7.png')} style={{ ...styles.background, opacity: 0.4 }} />
            <LinearGradient
              colors={['#0b132b', '#3a506b']}
              style={{ ...styles.background, opacity: 0.5 }}
            />
          </>
        }
        <Navbar nav={navigation} auth={authState} position={'relative'} from={'game'} />
        <View
          style={{
            // marginTop: 40,
            alignItems: 'flex-start',
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          <Grid nav={navigation} currentuser={userID} auth={authState} />
        </View>

      </View>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        // backgroundColor="black"
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
    </>
  );
}

function LeaderScreen({ navigation }) {
  const [userID, setUserID] = useState('');
  const [authState, setAuthState] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  const CheckAuthState = async () => {
    let value = await AsyncStorage.getItem('@authState')
    if (value === 'true') {
      setAuthState(true)
    } else if (value === 'false') {
      setAuthState(false)
    }
  }

  const CurrentUser = async () => {
    let value = await AsyncStorage.getItem('@userID', value);
    setUserID(value)
  }


  const getSelectedColor = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('selectedColor')
      if (jsonValue != null) {
        let color = JSON.parse(jsonValue)
        setSelectedColor(color)
      }
    } catch (e) {
      // error reading value
    }
  }

  const DisplayGradient = (props) => {
    return (
      <>
        <Image source={props.image} style={{ ...styles.background, opacity: 0.4 }} />
        <LinearGradient
          colors={props.gradient}
          style={{ ...styles.background, opacity: 0.5 }}
        />
      </>
    )
  }

  const { data: leaderboard, refetch } = useQuery(LEADERBOARD);
  // console.log(leaderboard)

  const DATA = leaderboard?.leaderBoard;
  // console.log(DATA)


  const Item = ({ username, score, pos }) => (
    <View
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 10,
        borderRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 40,
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 5,
        width: windowWidth - 20,
        alignSelf: 'center',
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.5)',
        borderLeftColor: 'rgba(255, 255, 255, 0.5)'
      }}
    >
      <View
        style={{
          flexDirection: 'column',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 20,
          width: windowWidth*0.12,
          height: windowWidth*0.09,
          marginRight: 10,
          marginTop: 10,
          // borderLeftWidth: 1, 
          // borderBottomWidth: 1, 
          borderLeftColor: 'rgba(255, 255, 255, 0.5)',
          borderBottomColor: 'rgba(255, 255, 255, 0.5)',
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 30,
        }}
      >
        <Text
          style={{ color: 'white', alignSelf: 'center', marginleft: windowWidth*0.01, marginTop: windowWidth*0.01, fontSize: windowWidth*0.04, fontWeight: 'bold' }}
        >{pos}</Text>
      </View>
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'column', width: windowWidth / 1.4 }}>
          <View style={{ flexDirection: 'row', alignSelf: 'flex-start', margin: windowWidth*0.01 }}>
            <Text
              style={{
                fontSize: windowWidth*0.06,
                fontWeight: 'bold',
                color: '#efea5a'
              }}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {username}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            width: windowWidth / 1.6
          }}

        >
          <View style={{ flexDirection: 'row', margin: windowWidth*0.01 }}>
            {/* <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', alignSelf: 'flex-end' }}>{score}</Text> */}
            <Text
              style={{
                fontSize: windowWidth*0.05,
                fontWeight: 'bold',
                color: 'white',
                alignSelf: 'flex-end',
                marginLeft: 10,
              }}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {score}
            </Text>
            <Text style={{ fontSize: windowWidth*0.04, fontWeight: 'bold', color: '#83e377', alignSelf: 'flex-end', marginLeft: 4 }}>points</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item username={item.username} score={item.score} pos={item.position} />
  );

  useEffect(() => {
    CheckAuthState();
    CurrentUser();
    getSelectedColor();
    refetch();
  }, [])

  return (
    <>
      <View style={styles.container}>
        {selectedColor && selectedColor.gradient && selectedColor.image ?
          <DisplayGradient gradient={selectedColor.gradient} image={selectedColor.image} />
          :
          <>
            <Image source={require('./assets/dalle_7.png')} style={{ ...styles.background, opacity: 0.4 }} />
            <LinearGradient
              colors={['#0b132b', '#3a506b']}
              style={{ ...styles.background, opacity: 0.5 }}
            />
          </>
        }
        <Navbar nav={navigation} auth={authState} position={'relative'} from={'leader'} />
        {/* <View style={{ marginTop: 40 }}>
          <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', alignSelf: 'center', marginTop: 80 }}>Leader Board</Text>
        </View> */}
        <SafeAreaView style={styles.flatlistContainer}>
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </SafeAreaView>
      </View>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        // backgroundColor="black"
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
    </>
  );
}

function ProfileScreen({ navigation }) {
  const [userID, setUserID] = useState('');
  const [authState, setAuthState] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  const CheckAuthState = async () => {
    let value = await AsyncStorage.getItem('@authState')
    if (value === 'true') {
      setAuthState(true)
    } else if (value === 'false') {
      setAuthState(false)
      { navigation.navigate('Auth') }
    }
  }


  const CurrentUser = async () => {
    let value = await AsyncStorage.getItem('@userID', value);
    setUserID(value)
  }


  const getSelectedColor = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('selectedColor')
      if (jsonValue != null) {
        let color = JSON.parse(jsonValue)
        setSelectedColor(color)
      }
    } catch (e) {
      // error reading value
    }
  }

  const DisplayGradient = (props) => {
    return (
      <>
        <Image source={props.image} style={{ ...styles.background, opacity: 0.4 }} />
        <LinearGradient
          colors={props.gradient}
          style={{ ...styles.background, opacity: 0.5 }}
        />
      </>
    )
  }


  useEffect(() => {
    CheckAuthState();
    CurrentUser();
    getSelectedColor();
  }, [])

  // console.log("AUTH: " + authState)

  return (
    <>
      <View style={styles.container}>
        {selectedColor && selectedColor.gradient && selectedColor.image ?
          <DisplayGradient gradient={selectedColor.gradient} image={selectedColor.image} />
          :
          <>
            <Image source={require('./assets/dalle_7.png')} style={{ ...styles.background, opacity: 0.4 }} />
            <LinearGradient
              colors={['#0b132b', '#3a506b']}
              style={{ ...styles.background, opacity: 0.5 }}
            />
          </>
        }
        <Navbar nav={navigation} auth={authState} position={'relative'} from={'profile'} />
        <Profile currentuser={userID} nav={navigation} auth={authState} />
      </View>

      <StatusBar
        barStyle="light-content"
        hidden={false}
        // backgroundColor="black"
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
    </>
  )
}

const Auth = ({ navigation }) => {
  // Generic
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [authState, setAuthState] = useState(false);
  const [displayLoading, setDisplayLoading] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [displayLoginFailureAlert, setDisplayLoginFailureAlert] = useState(false)

  // Sign Up: Email
  const [promptEmailInput, setPromptEmailInput] = useState("");

  // Sign Up: Username
  const [promptUsernameInput, setPromptUsernameInput] = useState("");

  // Sign Up: Password
  const [promptPasswordInput, setPromptPasswordInput] = useState("");

  // Username and Password
  const [promptInput_0, setPromptInput_0] = useState("");
  const [promptInput_1, setPromptInput_1] = useState("");
  const [userID, setUserID] = useState("")

  // Apollo 
  const [login, { error }] = useMutation(LOGIN_USER);
  const [addUser] = useMutation(ADD_USER);


  const storeBearerToken = async (value) => {
    try {
      await AsyncStorage.setItem('@storage_Key', value)
    } catch (e) {
      console.error(e)
    }
  }
  const storeUserID = async (value) => {
    try {
      await AsyncStorage.setItem('@userID', value)
    } catch (e) {
      console.error(e)
    }
  }


  const storeAuthState = async (value) => {
    try {
      await AsyncStorage.setItem('@authState', value)
    } catch (e) {
      console.error(e)
    }
  }
  const CheckAuthState = async () => {
    let value = await AsyncStorage.getItem('@authState')

    if (value === 'true') {
      setAuthState(true)
      navigation.navigate('Profile')
    } else if (value === 'false') {
      setAuthState(false)
    }
  }


  const CurrentUser = async () => {
    let value = await AsyncStorage.getItem('@userID', value);
    if (value == '') {
      setUserID('')
    } else {
      setUserID(value)
    }
  }

  useEffect(() => {
    CheckAuthState();
    CurrentUser();
    // getSelectedColor();
  }, [])


  // console.log("AUTH: " + authState)
  // console.log("USER ID: " + userID)

  // if (!authState || userID == '') {
  //   CheckAuthState();
  //   CurrentUser();
  //   console.log("true")
  // }




  const handleLogin = async () => {

    try {
      const { data } = await login({
        variables: {
          username: promptInput_0,
          password: promptInput_1
        },
      });

      if (data.login.token) {
        const decoded = jwtDecode(data.login.token)
        storeBearerToken(`Bearer ${data.login.token}`)
        setUserID(decoded?.data._id);
        storeUserID(`${decoded?.data._id}`)
        setDisplayLoading(false);
        setAuthState(true);
        storeAuthState('true')
      }
    } catch (e) {
      setDisplayLoading(false);
      setAuthState(false);
      console.error(e);
      setDisplayLoginFailureAlert(true)
    }
  }


  const handleFormSubmit = async () => {
    try {
      const { data } = await addUser({
        variables: {
          username: promptUsernameInput,
          email: promptEmailInput,
          password: promptPasswordInput,
          role: 'User',
          profilepicture: '',
        }
      });
      // console.log(data.addUser.token)
      if (data.addUser.token) {
        const decoded = jwtDecode(data.addUser.token)
        storeBearerToken(`Bearer ${data.addUser.token}`)
        setUserID(decoded?.data._id);
        storeUserID(`${decoded?.data._id}`)
        setDisplayLoading(false);
        setAuthState(true);
        storeAuthState('true')
        setPromptEmailInput("")
        setPromptUsernameInput("")
        setPromptPasswordInput("")

      }
    } catch (e) {
      setDisplayLoading(false);
      setAuthState(false);
      console.error(e);
      Alert.alert(
        "Sign Up Failed",
        `${e}`,
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    }
  };

  // console.log("AUTH: " + authState)

  return (
    <>

      <SafeAreaView style={{ height: windowHeight, marginBottom: 100, marginTop: 32 }}>

        <ScrollView style={{}} keyboardShouldPersistTaps={'always'} keyboardDismissMode="on-drag">
          <Navbar nav={navigation} auth={authState} position={'relative'} from={'auth'} />
          {!authState &&
            <>
              {newUser ?
                <>
                  <Text style={{ color: 'white', alignSelf: 'center', fontSize: 20, marginTop: 20, fontWeight: 'bold' }}>Sign Up</Text>
                  <>
                    {/* [[[CHECK BOXES]]] */}
                    <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 20 }}>
                      {promptEmailInput ?
                        <View
                          style={{
                            flexDirection: 'column',
                            marginLeft: 10,
                            marginRight: 10
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faSolid, faCheck}
                            style={{ color: '#70e000', margin: 7, alignSelf: 'center' }}
                          />
                          <Text style={{ color: 'white', alignSelf: 'center' }}>Email</Text>
                        </View>
                        :
                        <View
                          style={{
                            flexDirection: 'column',
                            marginLeft: 10,
                            marginRight: 10
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faSolid, faEnvelope}
                            style={{ color: 'white', margin: 7, alignSelf: 'center' }}
                          />
                          <Text style={{ color: 'white', alignSelf: 'center' }}>Email</Text>
                        </View>
                      }
                      {promptUsernameInput ?
                        <View
                          style={{
                            flexDirection: 'column',
                            marginLeft: 10,
                            marginRight: 10
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faSolid, faCheck}
                            style={{ color: '#70e000', margin: 7, alignSelf: 'center' }}
                          />
                          <Text style={{ color: 'white', alignSelf: 'center' }}>Username</Text>
                        </View>
                        :
                        <View
                          style={{
                            flexDirection: 'column',
                            marginLeft: 10,
                            marginRight: 10
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faSolid, faUser}
                            style={{ color: 'white', margin: 7, alignSelf: 'center' }}
                          />
                          <Text style={{ color: 'white', alignSelf: 'center' }}>Username</Text>
                        </View>
                      }
                      {promptPasswordInput ?
                        <View
                          style={{
                            flexDirection: 'column',
                            marginLeft: 10,
                            marginRight: 10
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faSolid, faCheck}
                            style={{ color: '#70e000', margin: 7, alignSelf: 'center' }}
                          />
                          <Text style={{ color: 'white', alignSelf: 'center' }}>Password</Text>
                        </View>
                        :
                        <View
                          style={{
                            flexDirection: 'column',
                            marginLeft: 10,
                            marginRight: 10
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faSolid, faLock}
                            style={{ color: 'white', margin: 7, alignSelf: 'center' }}
                          />
                          <Text style={{ color: 'white', alignSelf: 'center' }}>Password</Text>
                        </View>
                      }
                    </View>
                  </>

                  <TextInput
                    type="text"
                    name="email"
                    placeholder="Email"
                    placeholderTextColor="white"
                    value={promptEmailInput}
                    onChangeText={setPromptEmailInput}
                    style={{
                      outline: 'none',
                      backgroundColor: 'transparent',
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      padding: 20,
                      border: 'solid',
                      borderWidth: 2,
                      borderColor: 'white',
                      borderRadius: 40,
                      alignSelf: 'center',
                      margin: 10,
                      width: windowWidth - 80
                    }}
                  />
                  <TextInput
                    type="text"
                    name="username"
                    placeholder="Username"
                    placeholderTextColor="white"
                    value={promptUsernameInput}
                    onChangeText={setPromptUsernameInput}
                    style={{
                      outline: 'none',
                      backgroundColor: 'transparent',
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      padding: 20,
                      border: 'solid',
                      borderWidth: 2,
                      borderColor: 'white',
                      borderRadius: 40,
                      alignSelf: 'center',
                      margin: 10,
                      width: windowWidth - 80
                    }}
                  />
                  <TextInput
                    type="password"
                    name="password"
                    placeholder="Password"
                    placeholderTextColor="white"
                    value={promptPasswordInput}
                    onChangeText={setPromptPasswordInput}
                    secureTextEntry={true}
                    style={{
                      outline: 'none',
                      backgroundColor: 'transparent',
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      padding: 20,
                      border: 'solid',
                      borderWidth: 2,
                      borderColor: 'white',
                      borderRadius: 40,
                      alignSelf: 'center',
                      margin: 10,
                      width: windowWidth - 80
                    }}
                  />

                  {
                    promptEmailInput != "" &&
                      promptUsernameInput != "" &&
                      promptPasswordInput != "" ?
                      <TouchableOpacity
                        onPress={() => {
                          handleFormSubmit()
                          setDisplayLoading(true);
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: '#70e000',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            padding: 20,
                            borderRadius: 40,
                            alignSelf: 'center',
                            margin: 10,
                            width: windowWidth - 80
                          }}

                        >
                          <Text style={{ color: '#001219', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>SIGN UP</Text>
                        </View>
                      </TouchableOpacity>
                      :
                      <TouchableOpacity
                        onPress={() => { }}
                        disabled={true}
                      >
                        <View
                          style={{
                            backgroundColor: '#70e000',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            padding: 20,
                            borderRadius: 40,
                            alignSelf: 'center',
                            margin: 10,
                            width: windowWidth - 80
                          }}
                        >
                          <Text style={{ color: '#001219', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>SIGN UP</Text>
                        </View>
                      </TouchableOpacity>
                  }
                  <Text style={{ color: 'white', alignSelf: 'center', fontSize: 20, margin: 20, fontWeight: 'bold' }}>Have an account?</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setPromptEmailInput("")
                      setPromptUsernameInput("")
                      setPromptPasswordInput("")
                      setNewUser(false)
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: 'blue',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        padding: 20,
                        borderRadius: 40,
                        alignSelf: 'center',
                        margin: 10,
                        width: windowWidth - 200
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>Login</Text>
                    </View>
                  </TouchableOpacity>
                </>
                :
                <>
                  {displayLoading ?
                    <Loading />
                    :
                    <>
                      <Text style={{ color: 'white', alignSelf: 'center', fontSize: 20, margin: 20, fontWeight: 'bold' }}>Login</Text>
                      <TextInput
                        type="text"
                        name="username"
                        placeholder="Username"
                        placeholderTextColor="white"
                        value={promptInput_0}
                        onChangeText={setPromptInput_0}
                        style={{
                          outline: 'none',
                          backgroundColor: 'transparent',
                          color: 'white',
                          display: 'flex',
                          justifyContent: 'flex-start',
                          padding: 20,
                          border: 'solid',
                          borderWidth: 2,
                          borderColor: 'white',
                          borderRadius: 40,
                          alignSelf: 'center',
                          margin: 10,
                          width: windowWidth - 80
                        }}
                      />
                      <TextInput
                        type="password"
                        name="password"
                        placeholder="Password"
                        placeholderTextColor="white"
                        value={promptInput_1}
                        onChangeText={setPromptInput_1}
                        secureTextEntry={true}
                        style={{
                          outline: 'none',
                          backgroundColor: 'transparent',
                          color: 'white',
                          display: 'flex',
                          justifyContent: 'flex-start',
                          padding: 20,
                          border: 'solid',
                          borderWidth: 2,
                          borderColor: 'white',
                          borderRadius: 40,
                          alignSelf: 'center',
                          margin: 10,
                          width: windowWidth - 80
                        }}
                      />
                      {displayLoginFailureAlert &&
                        <View style={{ alignSelf: 'center' }}>
                          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'red' }}>
                            Incorrect Credentials
                          </Text>
                        </View>
                      }
                      {promptInput_0 != "" &&
                        promptInput_1 != "" ?
                        <TouchableOpacity onPress={() => { handleLogin(); setDisplayLoading(true); }}>
                          <View
                            style={{
                              backgroundColor: '#70e000',
                              display: 'flex',
                              justifyContent: 'flex-start',
                              padding: 20,
                              borderRadius: 40,
                              alignSelf: 'center',
                              margin: 10,
                              width: windowWidth - 80
                            }}
                          >
                            <Text style={{ color: '#001219', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>LOGIN</Text>
                          </View>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                          onPress={() => { }}
                          disabled={true}
                        >
                          <View

                            style={{
                              backgroundColor: '#70e000',
                              display: 'flex',
                              justifyContent: 'flex-start',
                              padding: 20,
                              borderRadius: 40,
                              alignSelf: 'center',
                              margin: 10,
                              width: windowWidth - 80
                            }}
                          >
                            <Text style={{ color: '#001219', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>LOGIN</Text>
                          </View>
                        </TouchableOpacity>
                      }
                      <Text style={{ color: 'white', alignSelf: 'center', fontSize: 20, margin: 20, fontWeight: 'bold' }}>Don't have an account?</Text>
                      <TouchableOpacity onPress={() => { setNewUser(true) }}>
                        <View
                          style={{
                            backgroundColor: 'blue',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            padding: 20,
                            borderRadius: 40,
                            alignSelf: 'center',
                            margin: 10,
                            width: windowWidth - 200
                          }}
                        >
                          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>Sign Up</Text>
                        </View>
                      </TouchableOpacity>

                    </>
                  }
                </>
              }

            </>
          }
          <View style={{ marginBottom: 400 }}></View>
        </ScrollView>
      </SafeAreaView>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        // backgroundColor="black"
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
    </>
  )
}

const Stack = createNativeStackNavigator();

export default function App() {
  const GRAPHQL_API_URL = 'http://192.168.1.198:3001/graphql';
  const asyncAuthLink = setContext(async () => {
    return {
      headers: {
        Authorization: await AsyncStorage.getItem('@storage_Key'),
      },
    };
  });


  const httpLink = new HttpLink({
    uri: GRAPHQL_API_URL,
  });

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: asyncAuthLink.concat(httpLink),
  });

  const MyTheme = {
    dark: false,
    colors: {
      primary: 'rgb(255, 45, 85)',
      background: '#001219',
      notification: 'rgb(255, 69, 58)',
    },
  };

  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });



  return (
    <>
      <ApolloProvider client={apolloClient}>
        <NavigationContainer theme={MyTheme} onStateChange={(state) => console.log('New state is', state.routes)}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              orientation: 'portrait_up',
              cardStyleInterpolator: forFade,
              animationEnabled: false,
            }}
          >
            <Stack.Screen
              name="Auth"
              component={Auth}
              options={{
                animationEnabled: false,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                animationEnabled: false,
                headerShown: false
              }}
            />
            <Stack.Screen
              name="Game"
              component={GameScreen}
              options={{
                animationEnabled: false,
                headerShown: false
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                animationEnabled: false,
                headerShown: false
              }}
            />
            {/* <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                animationEnabled: false,
                headerShown: false
              }}
            /> */}
            <Stack.Screen
              name="Leader"
              component={LeaderScreen}
              options={{
                animationEnabled: false,
                headerShown: false
              }}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // container: {
  //   flex: 1,
  //   // justifyContent: "center",
  //   // marginTop: 10,
  //   // paddingHorizontal: 50,
  //   // backgroundColor: '#001219',
  // },
  container: {
    flex: 1,
    backgroundColor: '#240046',
    marginTop: 30
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  scrollContainer: {
    // paddingTop: StatusBar.currentHeight,
  },
  flatlistContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight + 30 || 0,
  },
  item: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'solid',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    borderBottomLeftRadius: 25,
    padding: 10,
    width: windowWidth - 20,
    flexDirection: 'column',
    margin: 10,
  },
  number: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'blue',
    marginLeft: 15,
    marginTop: 2
  },
  title: {
    fontSize: 32,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: windowHeight,
  },
  label: {
    marginBottom: 2,
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  section: {
    marginVertical: 12,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 50
  },
  newcontainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    marginHorizontal: 0,
  },
  circlecontainer: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  circle: {
    width: windowWidth*0.06,
    height: windowWidth*0.06,
    borderRadius: 20,
    margin: 10,
  },
  difficultyButton: {
    display: 'flex',
    justifyContent: 'center',
    padding: 20,
    // borderRadius: 40,
    alignSelf: 'center',
    margin: 10,
    width: windowWidth / 3 - 1,
    height: windowHeight / 12,
    flexDirection: 'row'
  },
  difficultyText: {
    color: '#001219',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 4,
    borderColor: 'white',
    color: 'white',
    width: windowWidth - 80,
    alignSelf: 'center',
    height: windowHeight / 3,
    borderRadius: 10,
    padding: 30
  },
  sendButton: {
    display: 'flex',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 40,
    alignSelf: 'center',
    margin: 10,
    width: windowWidth - 80,
    flexDirection: 'row'
  },
  sendButtonText: {
    color: '#001219',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  letters: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 10,
    fontSize: windowWidth*0.11,
    fontWeight: 'bold',
    color: '#001219'
  },
});



