import React, { useEffect, useState, useRef } from 'react';
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache, useMutation, useQuery } from "@apollo/client";
import { setContext } from '@apollo/link-context';
import jwtDecode from "jwt-decode";
import { LOGIN_USER, ADD_USER, REQUEST_RESET, RESET_PASSWORD } from './utils/mutations';
import { GET_USER_BY_ID, LEADERBOARD } from './utils/queries';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Dimensions, Button, Linking, ImageBackground, FlatList, PixelRatio, Modal } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSolid, faUser, faPlus, faUpLong, faMagnifyingGlass, faCheck, faLocationPin, faEnvelope, faLock, faGear, faX } from '@fortawesome/free-solid-svg-icons';
import { Navbar } from './components/Navbar';
import { Profile } from './pages/profile/Profile';
import { Loading } from './components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Grid } from './pages/game/Game';
import { Home } from './pages/home/Home';
import { Leader } from './pages/leader/Leader';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// [GLOBAL] - [[[Variables: Dimensions]]] - - - - 
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
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
  //   if (Platform.OS === 'ios') {
  //     return Math.round(PixelRatio.roundToNearestPixel(newSize))
  //   } else {
  //     return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  //   }
}

const HeightRatio = (size) => {
  const newSize = size * scaleHeight;
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// [GLOBAL] - [[[Variables: Styling]]] - - - - 
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

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


const HomeScreen = ({ navigation }) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  // [LOCAL] - [[[Variables: Authorization, Preferences]]] - - - - 
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  const [userID, setUserID] = useState('');
  const [authState, setAuthState] = useState(false);

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

  useEffect(() => {
    CheckAuthState();
    CurrentUser();
  }, [])

  return (
    <>
      <View style={styles.container}>
        <Navbar nav={navigation} auth={authState} position={'relative'} from={'home'} />
        <View>
          <Home nav={navigation} currentuser={userID} auth={authState} />
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

const GameScreen = ({ navigation }) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  // [LOCAL] - [[[Variables: Authorization, Preferences]]] - - - - 
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  const [userID, setUserID] = useState('');
  const [authState, setAuthState] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

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

  
  const getSelectedColor = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('selectedColor')
      if (jsonValue != null) {
        let color = JSON.parse(jsonValue)
        setSelectedColor(color);
      }
    } catch (e) {
      console.error(e)
    }
  }


  useEffect(() => {
    CheckAuthState();
    CurrentUser();
    getSelectedColor();
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
        <Navbar nav={navigation} auth={authState} position={'relative'} from={'game'} />
        <View
          style={{
            alignSelf: 'center',
            marginTop: WidthRatio(30)

          }}
        >
          <Grid nav={navigation} currentuser={userID} auth={authState} />
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

const LeaderScreen = ({ navigation }) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  // [LOCAL] - [[[Variables: Authorization, Preferences]]] - - - - 
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  const [userID, setUserID] = useState('');
  const [authState, setAuthState] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

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

  
  const getSelectedColor = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('selectedColor')
      if (jsonValue != null) {
        let color = JSON.parse(jsonValue)
        setSelectedColor(color);
      }
    } catch (e) {
      console.error(e)
    }
  }


  useEffect(() => {
    CheckAuthState();
    CurrentUser();
    getSelectedColor();
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
        <View
          style={{
            alignSelf: 'center',
            marginTop: WidthRatio(30)

          }}
        >
          <Leader nav={navigation} currentuser={userID} auth={authState} />
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

function ProfileScreen({ navigation }) {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  // [LOCAL] - [[[Variables: Authorization, Preferences]]] - - - - 
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  const [userID, setUserID] = useState('');
  const [authState, setAuthState] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

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

  
  const getSelectedColor = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('selectedColor')
      if (jsonValue != null) {
        let color = JSON.parse(jsonValue)
        setSelectedColor(color);
      }
    } catch (e) {
      console.error(e)
    }
  }


  useEffect(() => {
    CheckAuthState();
    CurrentUser();
    getSelectedColor();
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
        <Navbar nav={navigation} auth={authState} position={'relative'} from={'profile'} />
        <Profile currentuser={userID} nav={navigation} auth={authState} />
      </View>

      <StatusBar
        barStyle="default"
        hidden={false}
        backgroundColor="transparent"
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
    </>
  )
}

const Auth = ({ navigation }) => {
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

  // Forgot Password
  const [displayForgotPasswordContent, setDisplayForgotPasswordContent] = useState(false);
  const [promptResetEmail, setPromptResetEmail] = useState('');
  const [resetRequestStatus, setResetRequestStatus] = useState('');
  const [displayForgotPasswordForm, setDisplayForgotPasswordForm] = useState(false);
  const [promptResetUsername, setPromptResetUsername] = useState('');
  const [promptResetPassword_0, setPromptResetPassword_0] = useState('');
  const [promptResetPassword_1, setPromptResetPassword_1] = useState('');
  const [promptResetToken, setPromptResetToken] = useState('');
  const [displayResetSuccessModal, setDisplayResetSuccessModal] = useState(false);


  // Apollo 
  const [login, { error }] = useMutation(LOGIN_USER);
  const [addUser] = useMutation(ADD_USER);
  const [requestReset] = useMutation(REQUEST_RESET);
  const [resetPassword] = useMutation(RESET_PASSWORD);


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
  }, [])

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

  const handleRequestReset = async () => {
    console.log(promptResetEmail)
    try {
      await requestReset({
        variables: {
          email: promptResetEmail
        },
      });
      setResetRequestStatus("Check your email for a Reset Token!")
    } catch (e) {
      console.error(e);
      setResetRequestStatus("No user found with that email.")
    }

  };

  const handleResetPassword = async () => {
    if (promptResetEmail != '' && promptResetPassword_0 != '' && promptResetPassword_1 != '' && promptResetToken != '' && promptResetPassword_0 == promptResetPassword_1) {
      try {
        await resetPassword({
          variables: {
            email: promptResetEmail,
            password: promptResetPassword_0,
            confirmPassword: promptResetPassword_1,
            resetToken: promptResetToken
          }
        })
        console.log("Ok all set, try to log in.")
        setDisplayResetSuccessModal(true);
        setPromptResetEmail('');
        setResetRequestStatus('');
        setDisplayForgotPasswordForm(false);
        setPromptResetUsername('');
        setPromptResetPassword_0('');
        setPromptResetPassword_1('');
      } catch (e) {
        console.error(e)
        console.log("Token expired or incorrect");
      }
    }
  }

  return (
    <>

      <SafeAreaView style={{ height: windowHeight, marginBottom: 100, marginTop: 32 }}>

        <ScrollView style={{}} keyboardShouldPersistTaps={'always'} keyboardDismissMode="on-drag">
          <Navbar nav={navigation} auth={authState} position={'relative'} from={'auth'} />
          {!authState &&
            <>
              {newUser ?
                <>
                  <Text
                    style={{ color: 'white', alignSelf: 'center', fontSize: 50, marginTop: 20, fontWeight: 'bold' }}
                    allowFontScaling={false}
                  >
                    Sign Up
                  </Text>
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
                          <Text
                            style={{ color: '#001219', fontSize: 30, fontWeight: 'bold', alignSelf: 'center' }}
                            allowFontScaling={false}
                          >
                            SIGN UP
                          </Text>
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
                          <Text
                            style={{ color: '#001219', fontSize: 30, fontWeight: 'bold', alignSelf: 'center' }}
                            allowFontScaling={false}
                          >
                            SIGN UP
                          </Text>
                        </View>
                      </TouchableOpacity>
                  }
                  <Text
                    style={{ color: 'white', alignSelf: 'center', fontSize: 30, margin: 20, fontWeight: 'bold' }}
                    allowFontScaling={false}
                  >
                    Have an account?
                  </Text>
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
                      <Text
                        style={{ color: 'white', fontSize: 25, fontWeight: 'bold', alignSelf: 'center' }}
                        allowFontScaling={false}
                      >
                        Login</Text>
                    </View>
                  </TouchableOpacity>
                </>
                :
                <>
                  {displayLoading ?
                    <Loading />
                    :
                    <>
                      <Text
                        style={{ color: 'white', alignSelf: 'center', fontSize: 50, margin: 20, fontWeight: 'bold' }}
                        allowFontScaling={false}
                      >
                        Login
                      </Text>
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
                          <Text
                            style={{ fontSize: 30, fontWeight: 'bold', color: 'red' }}
                            allowFontScaling={false}
                          >
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
                            <Text
                              style={{ color: '#001219', fontSize: 30, fontWeight: 'bold', alignSelf: 'center' }}
                              allowFontScaling={false}
                            >
                              LOGIN
                            </Text>
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
                            <Text
                              style={{ color: '#001219', fontSize: 30, fontWeight: 'bold', alignSelf: 'center' }}
                              allowFontScaling={false}
                            >
                              LOGIN
                            </Text>
                          </View>
                        </TouchableOpacity>
                      }

                      <View style={styles.modalDivisionLine}></View>

                      <TouchableOpacity onPress={() => setDisplayForgotPasswordContent(true)}>
                        <View>
                          <Text
                            style={{ color: '#80ffdb', alignSelf: 'center', fontSize: 30, margin: 10, fontWeight: 'bold' }}
                            allowFontScaling={false}
                          >
                            Forgot Password?
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {displayForgotPasswordContent &&
                        <View
                          style={{
                            alignSelf: 'center',
                            margin: 10,
                            width: windowWidth - 80
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 10, marginTop: -5 }}>

                            <TextInput
                              type="text"
                              name="resetemail"
                              placeholder="Email"
                              placeholderTextColor='white'
                              value={promptResetEmail}
                              onChangeText={setPromptResetEmail}
                              allowFontScaling={false}
                              style={{
                                outline: 'none',
                                // backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'flex-start',
                                padding: 20,
                                border: 'solid',
                                borderColor: 'white',
                                borderTopWidth: 1,
                                borderLeftWidth: 1,
                                borderBottomWidth: 1,
                                borderTopLeftRadius: 30,
                                borderBottomLeftRadius: 30,
                                alignSelf: 'center',
                                marginTop: 10,
                                marginBottom: 4,
                                width: windowWidth - 160
                              }}
                            />
                            {/* [[[SUBMIT BUTTON]]] */}
                            <TouchableOpacity
                              onPress={() => {
                                handleRequestReset()
                              }}
                              style={{
                                padding: 10,
                                border: 'solid',
                                borderColor: 'white',
                                borderTopWidth: 1,
                                borderRightWidth: 1,
                                borderBottomWidth: 1,
                                borderTopRightRadius: 30,
                                borderBottomRightRadius: 30,
                                marginTop: 10,
                                marginBottom: 4,
                              }}
                            >
                              <Text style={{ color: '#ccff33', marginTop: 15, marginRight: 15 }} allowFontScaling={false}>SUBMIT</Text>
                            </TouchableOpacity>
                          </View>
                          {resetRequestStatus != '' &&
                            <View style={{}}>
                              <Text
                                style={{ color: 'white', alignSelf: 'center', fontSize: 30, margin: 10, fontWeight: 'bold' }}
                                allowFontScaling={false}
                              >{resetRequestStatus}</Text>
                            </View>
                          }

                          <TouchableOpacity onPress={() => setDisplayForgotPasswordForm(true)}>
                            <View
                              style={{
                                backgroundColor: '#ffbe0b',
                                display: 'flex',
                                justifyContent: 'flex-start',
                                padding: 5,
                                borderRadius: 40,
                                alignSelf: 'center',
                                margin: 10,
                                width: windowWidth - 130
                              }}
                            >
                              <Text
                                style={{ color: 'black', alignSelf: 'center', fontSize: 30, margin: 10, fontWeight: 'bold' }}
                                allowFontScaling={false}
                              >Have a reset token?</Text>
                            </View>
                          </TouchableOpacity>
                          {displayForgotPasswordForm &&
                            <>
                              <TextInput
                                type="text"
                                name="resetoken"
                                placeholder="Reset Token"
                                placeholderTextColor="white"
                                value={promptResetToken}
                                onChangeText={setPromptResetToken}
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
                                  borderRadius: 30,
                                  alignSelf: 'center',
                                  margin: 10,
                                  width: windowWidth - 80
                                }}
                              />
                              <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 10 }}>
                                <TextInput
                                  type="password"
                                  name="resetpassword_0"
                                  placeholder="New Password"
                                  placeholderTextColor='white'
                                  value={promptResetPassword_0}
                                  onChangeText={setPromptResetPassword_0}
                                  secureTextEntry={true}
                                  allowFontScaling={false}
                                  style={{
                                    outline: 'none',
                                    // backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: 20,
                                    border: 'solid',
                                    borderColor: 'white',
                                    borderWidth: 1,
                                    borderRadius: 30,
                                    alignSelf: 'center',
                                    marginTop: 10,
                                    marginBottom: 4,
                                    width: windowWidth - 80
                                  }}
                                />
                              </View>

                              <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 10 }}>
                                <TextInput
                                  type="password"
                                  name="resetpassword_1"
                                  placeholder='Confirm Password'
                                  placeholderTextColor='white'
                                  value={promptResetPassword_1}
                                  onChangeText={setPromptResetPassword_1}
                                  secureTextEntry={true}
                                  allowFontScaling={false}
                                  style={{
                                    outline: 'none',
                                    // backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    padding: 20,
                                    border: 'solid',
                                    borderColor: 'white',
                                    borderTopWidth: 1,
                                    borderLeftWidth: 1,
                                    borderBottomWidth: 1,
                                    borderTopLeftRadius: 30,
                                    borderBottomLeftRadius: 30,
                                    alignSelf: 'center',
                                    marginTop: 10,
                                    marginBottom: 4,
                                    width: windowWidth - 160
                                  }}
                                />
                                {/* [[[SUBMIT BUTTON]]] */}
                                <TouchableOpacity
                                  onPress={() => {
                                    handleResetPassword();
                                  }}
                                  style={{
                                    padding: 10,
                                    border: 'solid',
                                    borderColor: 'white',
                                    borderTopWidth: 1,
                                    borderRightWidth: 1,
                                    borderBottomWidth: 1,
                                    borderTopRightRadius: 30,
                                    borderBottomRightRadius: 30,
                                    marginTop: 10,
                                    marginBottom: 4,
                                  }}

                                >
                                  <Text style={{ color: '#ccff33', marginTop: 15, marginRight: 15 }} allowFontScaling={false}>SUBMIT</Text>
                                </TouchableOpacity>

                              </View>
                            </>

                          }

                          <View>
                            <Modal
                              animationType="slide"
                              transparent={true}
                              visible={displayResetSuccessModal}
                              onRequestClose={() => {
                                Alert.alert("Modal has been closed.");
                                setDisplayResetSuccessModal(!displayResetSuccessModal);
                              }}
                            >
                              <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                  {/* TOP ROW */}
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
                                      onPress={() => { setDisplayResetSuccessModal(!displayResetSuccessModal); setDisplayForgotPasswordContent(false); }}
                                      style={{
                                        borderRadius: 10,
                                        height: 50,
                                        width: 50
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faSolid, faX}
                                        style={{
                                          color: 'black',
                                          justifyContent: 'center',
                                          alignSelf: 'center',
                                          marginTop: 17
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  {/* MIDDLE ROW */}
                                  <Text style={styles.modalText}>Reset successful, try to Login!</Text>
                                  <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => { setDisplayResetSuccessModal(!displayResetSuccessModal); setDisplayForgotPasswordContent(false); }}
                                  >
                                    <Text style={styles.textStyle}>Cool</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </Modal>
                          </View>
                        </View>
                      }

                      <View style={styles.modalDivisionLine}></View>

                      <Text
                        style={{ color: 'white', alignSelf: 'center', fontSize: 30, margin: 20, fontWeight: 'bold' }}
                        allowFontScaling={false}
                      >
                        Don't have an account?
                      </Text>
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
                          <Text
                            style={{ color: 'white', fontSize: 25, fontWeight: 'bold', alignSelf: 'center' }}
                            allowFontScaling={false}
                          >
                            Sign Up
                          </Text>
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
        barStyle="default"
        hidden={false}
        backgroundColor="transparent"
        translucent={true}
        networkActivityIndicatorVisible={true}
      />
    </>
  )
}

const Stack = createNativeStackNavigator();

export default function App() {
  const GRAPHQL_API_URL = 'https://wordlit-backend.herokuapp.com/graphql';
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
    width: HeightRatio(40),
    height: HeightRatio(40),
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
  gridBlock: {
    height: windowWidth * 0.14,
    width: windowWidth * 0.14,
    margin: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  letters: {
    alignSelf: 'center',
    // fontSize: windowHeight / 30,
    fontSize: HeightRatio(44),
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.85)',
  },
  // letters: {
  //   alignSelf: 'center',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   // margin: 10,
  //   fontSize: windowWidth*0.11,
  //   fontWeight: 'bold',
  //   color: '#001219'
  // },
  modalDivisionLine: {
    borderColor: '#4cc9f0',
    borderBottomWidth: 1,
    width: WidthRatio(320),
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "#edf2f4",
    borderRadius: 10,
    borderWidth: 3,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: WidthRatio(300)
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#d90429'
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#4361ee",
    borderRadius: 10,
    padding: 20
  },
  textStyle: {
    color: "white",
    fontSize: HeightRatio(25),
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: 'black',
    fontSize: HeightRatio(30),
    fontWeight: 'bold'
  }
});



