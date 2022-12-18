import React, { useEffect, useState, useRef } from 'react';
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache, useMutation, useQuery } from "@apollo/client";
import { GET_USER_BY_ID, LEADERBOARD } from '../../utils/queries';
import { Alert, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Dimensions, Button, Linking, ImageBackground, FlatList, PixelRatio, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';


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

export const Leader = (props) => {
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
      <View>
        <View
          style={{
            backgroundColor: '#001219',
            height: HeightRatio(100),
            width: WidthRatio(340),
            alignSelf: 'center',
            borderRadius: 50,
            flexDirection: 'row'
          }}
        >
          <View style={{ flexDirection: 'column' }}>
            <Text
              style={{
                color: 'white',
                fontSize: HeightRatio(30),
                fontWeight: 'bold',
                marginTop: HeightRatio(30),
                marginLeft: WidthRatio(20)
              }}
              allowFontScaling={false}
            >
              {pos}
            </Text>
          </View>
          <View style={{ flexDirection: 'column', alignSelf: 'center', marginLeft: WidthRatio(20) }}>
            <View style={{ flexDirection: 'column', width: WidthRatio(240) }}>
              <View style={{ flexDirection: 'row', alignSelf: 'flex-start', margin: windowWidth * 0.01 }}>
                <Text
                  style={{
                    fontSize: windowWidth * 0.08,
                    fontWeight: 'bold',
                    color: '#efea5a'
                  }}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  allowFontScaling={false}
                >
                  {username}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'column',
                width: WidthRatio(240),
              }}
  
            >
              <View style={{ flexDirection: 'row', margin: windowWidth * 0.01 }}>
                <Text
                  style={{
                    fontSize: windowWidth * 0.05,
                    fontWeight: 'bold',
                    color: 'white',
                    alignSelf: 'flex-end',
                    marginLeft: 10,
                  }}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  allowFontScaling={false}
                >
                  {score}
                </Text>
                <Text
                  style={{ fontSize: windowWidth * 0.05, fontWeight: 'bold', color: '#83e377', alignSelf: 'flex-end', marginLeft: 4 }}
                  allowFontScaling={false}
                >
                  points
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.modalDivisionLine}></View>
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
          <SafeAreaView style={styles.flatlistContainer}>
            <FlatList
              data={DATA}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </SafeAreaView>
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