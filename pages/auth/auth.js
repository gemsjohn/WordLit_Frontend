import React, { useEffect, useState, useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation } from "@apollo/client";
import jwtDecode from "jwt-decode";
import { LOGIN_USER, ADD_USER, REQUEST_RESET, RESET_PASSWORD } from '../../utils/mutations';
import { Alert, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Dimensions, Button, Linking, ImageBackground, FlatList, PixelRatio, Modal } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSolid, faUser, faPlus, faUpLong, faMagnifyingGlass, faCheck, faLocationPin, faEnvelope, faLock, faGear, faX } from '@fortawesome/free-solid-svg-icons';
import { Navbar } from '../../components/Navbar';
import { Loading } from '../../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { MainStateContext } from '../../App';
import { Styling, windowWidth, windowHeight, HeightRatio, WidthRatio } from '../../Styling';
import * as SecureStore from 'expo-secure-store';

const resetActionProfile = CommonActions.reset({
  index: 1,
  routes: [{ name: 'Profile', params: {} }]
});

async function save(key, value) {
  console.log(key)
  console.log(value)
  await SecureStore.setItemAsync(key, value);
}

async function deleteKey(key) {
  // console.log("** DELETE **")
  // console.log(key)
  await SecureStore.deleteItemAsync(key);
}

export const Auth = ({ navigation }) => {
  const { mainState, setMainState } = useContext(MainStateContext);
  const [displayLoading, setDisplayLoading] = useState(false);
  const [newUser, setNewUser] = useState(true);
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

  // Server
  const [isTokenValid, setIsTokenValid] = useState(null);

  const checkToken = async (value) => {
    try {
      const response = await fetch('https://wordlit-backend.herokuapp.com/protected-route', {
        method: 'GET',
        headers: {
          'Authorization': `${value}`
        }
      });
      if (response.ok) {
        // Token is still valid
        console.log("AUTH - Token is still valid")

        setIsTokenValid(true)
        navigation.dispatch(resetActionProfile)
        return true;
      } else {
        // Token is no longer valid
        console.log("AUTH - Token is no longer valid")
        setIsTokenValid(false)
        return false;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleLogin = async () => {

    try {
      const { data } = await login({
        variables: {
          username: promptInput_0,
          password: promptInput_1
        },
      });

      if (data.login.token) {
        console.log("Auth - Successful Login")
        deleteKey('cosmicKey');

        const decoded = jwtDecode(data.login.token)
        setDisplayLoading(false);

        setMainState({
          bearerToken: `Bearer ${data.login.token}`,
          userID: `${decoded?.data._id}`,
          authState: true
        })

        console.log("Auth - Adding bearerToken, userID, and authState to SecureStore")

        save('bearerToken', `Bearer ${data.login.token}`);
        save('userID', `${decoded?.data._id}`);
        save('authState', 'true');

        checkToken(`Bearer ${data.login.token}`)
      }
    } catch (e) {
      console.log("Auth - Login Error")
      setDisplayLoading(false);
      console.error(e);
      setDisplayLoginFailureAlert(true)

      setMainState({
        bearerToken: null,
        userID: null,
        authState: false
      })

      save('bearerToken', null);
      save('userID', null);
      save('authState', 'false');
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

      if (data.addUser.token) {
        const decoded = jwtDecode(data.addUser.token)

        setDisplayLoading(false);
        setPromptEmailInput("")
        setPromptUsernameInput("")
        setPromptPasswordInput("")

        setMainState({
          bearerToken: `Bearer ${data.addUser.token}`,
          userID: `${decoded?.data._id}`,
          authState: true
        })

        console.log("Auth - Adding bearerToken, userID, and authState to SecureStore")

        save('bearerToken', `Bearer ${data.addUser.token}`);
        save('userID', `${decoded?.data._id}`);
        save('authState', 'true');

        checkToken(`Bearer ${data.addUser.token}`)
      }
    } catch (e) {
      setDisplayLoading(false);
      setPromptEmailInput("")
      setPromptUsernameInput("")
      setPromptPasswordInput("")

      // Alert.alert(
      //   "Sign Up Failed",
      //   `${e}`,
      //   [
      //     { text: "OK", onPress: () => console.log("OK Pressed") }
      //   ]
      // );

      const errorRegex = /duplicate key.*index: (\w+)_\d+/i;
      const emailErrorRegex = /email/i;
      const errorMessage = `${e}`;

      let fieldName = "field";

      if (errorMessage.match(errorRegex)) {
        fieldName = errorMessage.match(errorRegex)[1];
      } else if (errorMessage.match(emailErrorRegex)) {
        fieldName = "email";
      }

      Alert.alert(
        "Sign Up Failed",
        `The ${fieldName} is incorrect or already exists.`,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );


      setMainState({
        bearerToken: null,
        userID: null,
        authState: false
      })

      save('bearerToken', null);
      save('userID', null);
      save('authState', 'false');

    }
  };

  const handleRequestReset = async () => {
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
        setDisplayResetSuccessModal(true);
        setPromptResetEmail('');
        setResetRequestStatus('');
        setDisplayForgotPasswordForm(false);
        setPromptResetPassword_0('');
        setPromptResetPassword_1('');
      } catch (e) {
        console.error(e)
        console.log("Token expired or incorrect");
      }
    }
  }

  const [selectedColor, setSelectedColor] = useState(null);


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

  useEffect(() => {
    getSelectedColor();
  }, [selectedColor])


  return (
    <>
      <View style={{ ...Styling.container, backgroundColor: 'black' }}>
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
        <SafeAreaView style={{ height: '90%', marginBottom: 32, marginTop: 32 }}>
          <ScrollView style={{}} keyboardShouldPersistTaps={'always'} keyboardDismissMode="on-drag">
            {/* <LinearGradient
                  colors={['#261823', '#792555']}
                  style={{ flex: 1 }}
              > */}
            {!isTokenValid &&
              <>
                {newUser ?
                  <>
                    <Text
                      style={{ color: 'white', alignSelf: 'center', fontSize: HeightRatio(50), marginTop: HeightRatio(10), fontWeight: 'bold' }}
                      allowFontScaling={false}
                    >
                      Sign Up
                    </Text>
                    <>
                      {/* [[[CHECK BOXES]]] */}
                      <View style={{ flexDirection: 'row', alignSelf: 'center', margin: HeightRatio(20) }}>
                        {promptEmailInput ?
                          <View
                            style={{
                              flexDirection: 'column',
                              marginLeft: HeightRatio(20),
                              marginRight: HeightRatio(20)
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faSolid, faCheck}
                              style={{ color: '#70e000', margin: HeightRatio(14), alignSelf: 'center' }}
                            />
                            <Text
                              style={{ color: 'white', fontSize: HeightRatio(18), textAlign: 'center' }}
                              allowFontScaling={false}
                            >Email</Text>
                          </View>
                          :
                          <View
                            style={{
                              flexDirection: 'column',
                              marginLeft: HeightRatio(20),
                              marginRight: HeightRatio(20)
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faSolid, faEnvelope}
                              style={{ color: 'white', margin: HeightRatio(14), alignSelf: 'center' }}
                            />
                            <Text
                              style={{ color: 'white', fontSize: HeightRatio(18), textAlign: 'center' }}
                              allowFontScaling={false}
                            >Email</Text>
                          </View>
                        }
                        {promptUsernameInput ?
                          <View
                            style={{
                              flexDirection: 'column',
                              marginLeft: HeightRatio(20),
                              marginRight: HeightRatio(20)
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faSolid, faCheck}
                              style={{ color: '#70e000', margin: HeightRatio(14), alignSelf: 'center' }}
                            />
                            <Text
                              style={{ color: 'white', fontSize: HeightRatio(18), textAlign: 'center' }}
                              allowFontScaling={false}
                            >Username </Text>
                          </View>
                          :
                          <View
                            style={{
                              flexDirection: 'column',
                              marginLeft: HeightRatio(20),
                              marginRight: HeightRatio(20)
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faSolid, faUser}
                              style={{ color: 'white', margin: HeightRatio(14), alignSelf: 'center' }}
                            />
                            <Text
                              style={{ color: 'white', fontSize: HeightRatio(18), textAlign: 'center' }}
                              allowFontScaling={false}
                            >Username </Text>
                          </View>
                        }
                        {promptPasswordInput ?
                          <View
                            style={{
                              flexDirection: 'column',
                              marginLeft: HeightRatio(20),
                              marginRight: HeightRatio(20)
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faSolid, faCheck}
                              style={{ color: '#70e000', margin: HeightRatio(14), alignSelf: 'center' }}
                            />
                            <Text
                              style={{ color: 'white', fontSize: HeightRatio(18), textAlign: 'center' }}
                              allowFontScaling={false}
                            >Password</Text>
                          </View>
                          :
                          <View
                            style={{
                              flexDirection: 'column',
                              marginLeft: HeightRatio(20),
                              marginRight: HeightRatio(20)
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faSolid, faLock}
                              style={{ color: 'white', margin: HeightRatio(14), alignSelf: 'center' }}
                            />
                            <Text
                              style={{ color: 'white', fontSize: HeightRatio(18), textAlign: 'center' }}
                              allowFontScaling={false}
                            >Password</Text>
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
                      style={Styling.textInputStyle}
                      disableFullscreenUI={true}
                      allowFontScaling={false}
                    />
                    <TextInput
                      type="text"
                      name="username"
                      placeholder="Username"
                      placeholderTextColor="white"
                      value={promptUsernameInput}
                      onChangeText={setPromptUsernameInput}
                      style={Styling.textInputStyle}
                      disableFullscreenUI={true}
                      allowFontScaling={false}
                    />
                    <TextInput
                      type="password"
                      name="password"
                      placeholder="Password"
                      placeholderTextColor="white"
                      value={promptPasswordInput}
                      onChangeText={setPromptPasswordInput}
                      secureTextEntry={true}
                      style={Styling.textInputStyle}
                      disableFullscreenUI={true}
                      allowFontScaling={false}
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
                                borderColor: '#09e049',
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
                              SIGN UP
                            </Text>
                          </View>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                          onPress={() => { }}
                          disabled={true}
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
                                borderColor: '#09e049',
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
                              SIGN UP
                            </Text>
                          </View>
                        </TouchableOpacity>
                    }
                    <Text
                      style={{ color: 'white', alignSelf: 'center', fontSize: HeightRatio(30), marginTop: HeightRatio(50), fontWeight: 'bold' }}
                      allowFontScaling={false}
                    >
                      Already have an account?
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setPromptEmailInput("")
                        setPromptUsernameInput("")
                        setPromptPasswordInput("")
                        setNewUser(false)
                      }}
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
                          LOGIN
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                  :
                  <>
                    {displayLoading ?
                      <Loading />
                      :
                      <View>
                        <Text
                          style={{ color: 'white', alignSelf: 'center', fontSize: HeightRatio(50), margin: HeightRatio(15), marginTop: HeightRatio(10), fontWeight: 'bold' }}
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
                          style={Styling.textInputStyle}
                          disableFullscreenUI={true}
                          allowFontScaling={false}
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
                            ...Styling.textInputStyle,
                            borderColor: displayLoginFailureAlert ? 'red' : 'white',
                            borderWidth: displayLoginFailureAlert ? 4 : 2
                          }}
                          disableFullscreenUI={true}
                          allowFontScaling={false}
                        />
                        {displayLoginFailureAlert &&
                          <View style={{ alignSelf: 'center', }}>
                            <Text
                              style={{ fontSize: HeightRatio(15), fontWeight: 'bold', color: 'red' }}
                              allowFontScaling={false}
                            >
                              Incorrect Credentials
                            </Text>
                          </View>
                        }
                        {promptInput_0 != "" &&
                          promptInput_1 != "" ?
                          <TouchableOpacity onPress={() => { handleLogin(); setDisplayLoading(true); }}>
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
                                  borderColor: '#09e049',
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
                                LOGIN
                              </Text>
                            </View>
                          </TouchableOpacity>
                          :
                          <TouchableOpacity
                            onPress={() => { }}
                            disabled={true}
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
                                  borderColor: '#09e049',
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
                                LOGIN
                              </Text>
                            </View>
                          </TouchableOpacity>
                        }

                        {/* <View style={Styling.profileDivisionLine}></View> */}
                        <View style={{
                          // backgroundColor: 'rgba(0, 0, 0, 0.25)',
                          margin: HeightRatio(10),
                          marginTop: HeightRatio(20),
                          borderRadius: HeightRatio(30)
                        }}>

                          <TouchableOpacity
                            onPress={() => setDisplayForgotPasswordContent(current => !current)}>
                            <View>
                              <Text
                                style={{ color: 'white', alignSelf: 'center', fontSize: HeightRatio(20), fontWeight: 'bold' }}
                                allowFontScaling={false}
                              >
                                Forgot Password?
                              </Text>
                            </View>
                          </TouchableOpacity>
                          {displayForgotPasswordContent ?
                            <View
                              style={{
                                alignSelf: 'center',
                                margin: HeightRatio(20),
                                width: WidthRatio(300)
                              }}
                            >
                              <View style={{ flexDirection: 'column', alignSelf: 'center' }}>

                                <TextInput
                                  type="text"
                                  name="resetemail"
                                  placeholder="Enter Email"
                                  placeholderTextColor='white'
                                  value={promptResetEmail}
                                  onChangeText={setPromptResetEmail}
                                  allowFontScaling={false}
                                  style={Styling.textInputStyle}
                                  disableFullscreenUI={true}
                                  allowFontScaling={false}
                                />
                                {/* [[[SUBMIT BUTTON]]] */}

                                <TouchableOpacity onPress={() => handleRequestReset()}>
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
                                        borderColor: '#09e049',
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
                                      SUBMIT
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              </View>
                              {resetRequestStatus != '' &&
                                <View style={{}}>
                                  <Text
                                    style={{ color: 'white', alignSelf: 'center', fontSize: HeightRatio(60), margin: HeightRatio(20), fontWeight: 'bold' }}
                                    allowFontScaling={false}
                                  >{resetRequestStatus}</Text>
                                </View>
                              }

                              <TouchableOpacity onPress={() => setDisplayForgotPasswordForm(true)}>
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
                                    RESET TOKEN
                                  </Text>
                                </View>
                              </TouchableOpacity>
                              {displayForgotPasswordForm &&
                                <>
                                  <TextInput
                                    type="text"
                                    name="resetoken"
                                    placeholder="Enter Reset Token"
                                    placeholderTextColor="white"
                                    value={promptResetToken}
                                    onChangeText={setPromptResetToken}
                                    style={Styling.textInputStyle}
                                    disableFullscreenUI={true}
                                    allowFontScaling={false}
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
                                      style={Styling.textInputStyle}
                                      disableFullscreenUI={true}
                                      allowFontScaling={false}
                                    />
                                  </View>

                                  <View style={{ flexDirection: 'column', alignSelf: 'center', margin: 10 }}>
                                    <TextInput
                                      type="password"
                                      name="resetpassword_1"
                                      placeholder='Confirm Password'
                                      placeholderTextColor='white'
                                      value={promptResetPassword_1}
                                      onChangeText={setPromptResetPassword_1}
                                      secureTextEntry={true}
                                      allowFontScaling={false}
                                      style={Styling.textInputStyle}
                                      disableFullscreenUI={true}
                                      allowFontScaling={false}
                                    />
                                    {promptResetPassword_0 == promptResetPassword_1 && promptResetPassword_0 != '' && promptResetPassword_1 != '' &&
                                      <View style={{ alignSelf: 'center' }}>
                                        <Text style={{ color: 'white', fontSize: HeightRatio(22) }}
                                          allowFontScaling={false}>
                                          Passwords match!
                                        </Text>
                                      </View>
                                    }
                                    {promptResetPassword_0 != promptResetPassword_1 && promptResetPassword_0 != '' && promptResetPassword_1 != '' &&
                                      <View style={{ alignSelf: 'center' }}>
                                        <Text style={{ color: 'white', fontSize: HeightRatio(22) }}
                                          allowFontScaling={false}>
                                          Passwords do not match!
                                        </Text>
                                      </View>
                                    }
                                    {/* [[[SUBMIT BUTTON]]] */}
                                    <TouchableOpacity onPress={() => handleResetPassword()}>
                                      <View
                                        style={{
                                          backgroundColor: '#70e000',
                                          display: 'flex',
                                          justifyContent: 'flex-start',
                                          padding: HeightRatio(20),
                                          borderRadius: HeightRatio(80),
                                          alignSelf: 'center',
                                          margin: HeightRatio(20),
                                          width: WidthRatio(300)
                                        }}
                                      >
                                        <Text
                                          style={{ color: 'black', alignSelf: 'center', fontSize: HeightRatio(22), fontWeight: 'bold' }}
                                          allowFontScaling={false}
                                        >SUBMIT</Text>
                                      </View>
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
                                          borderRadius: HeightRatio(16),
                                          position: 'absolute',
                                          zIndex: 10,
                                          top: 0,
                                          right: 0
                                        }}
                                      >
                                        <TouchableOpacity
                                          onPress={() => { setDisplayResetSuccessModal(!displayResetSuccessModal); setDisplayForgotPasswordContent(false); }}
                                          style={{
                                            borderRadius: HeightRatio(20),
                                            height: HeightRatio(100),
                                            width: HeightRatio(100)
                                          }}
                                        >
                                          <FontAwesomeIcon
                                            icon={faSolid, faX}
                                            style={{
                                              color: 'black',
                                              justifyContent: 'center',
                                              alignSelf: 'center',
                                              marginTop: HeightRatio(30)
                                            }}
                                          />
                                        </TouchableOpacity>
                                      </View>
                                      {/* MIDDLE ROW */}
                                      <Text style={Styling.modalText}>Reset successful, try to Login!</Text>
                                      <TouchableOpacity
                                        style={[Styling.button, Styling.buttonClose]}
                                        onPress={() => { setDisplayResetSuccessModal(!displayResetSuccessModal); setDisplayForgotPasswordContent(false); }}
                                      >
                                        <Text style={Styling.textStyle} allowFontScaling={false}>Cool</Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </Modal>
                              </View>
                            </View>
                            :
                            <>
                              <Text
                                style={{ color: 'white', alignSelf: 'center', fontSize: HeightRatio(30), marginTop: HeightRatio(50), fontWeight: 'bold' }}
                                allowFontScaling={false}
                              >
                                Don't have an account?
                              </Text>
                              <TouchableOpacity onPress={() => { setNewUser(true) }}>
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
                                    SIGN UP
                                  </Text>
                                </View>
                              </TouchableOpacity>

                            </>
                          }
                        </View>

                        {/* <View style={Styling.profileDivisionLine}></View> */}




                      </View>
                    }
                  </>
                }

              </>
            }
            <View style={{ marginBottom: HeightRatio(400) }}></View>
            {/* </LinearGradient> */}
          </ScrollView>
        </SafeAreaView>
        <Navbar nav={navigation} auth={isTokenValid} position={'absolute'} from={'auth'} />
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

const styles = StyleSheet.create({
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
  }
});