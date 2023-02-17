import React, { useEffect, useState, useRef } from 'react';
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache, useMutation, useQuery } from "@apollo/client";
import { GET_USER_BY_ID, LEADERBOARD } from '../../utils/queries';
import { Alert, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Dimensions, Button, Linking, ImageBackground, FlatList, PixelRatio, Modal } from 'react-native';
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

export const LeaderScreen = ({ navigation }) => {
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
        <Image source={props.image} style={{ ...Styling.background, opacity: 0.4 }} />
        <LinearGradient
          colors={props.gradient}
          style={{ ...Styling.background, opacity: 0.5 }}
        />
      </>
    )
  }


  const { data: leaderboard, refetch } = useQuery(LEADERBOARD);
  // console.log(leaderboard)

  const DATA = leaderboard?.leaderBoard;
  // console.log(DATA)


  const Item = ({ username, score, pos }) => (
    <>
      <View>
        <View
          style={{
            // backgroundColor: 'rgba(149, 33, 66, 0.50)',
            // height: HeightRatio(100),
            width: WidthRatio(340),
            height: HeightRatio(60),
            alignSelf: 'center',
            borderRadius: HeightRatio(8),
            flexDirection: 'row',
            marginTop: HeightRatio(10)
          }}
        >
          <LinearGradient
            colors={['#0b132b', '#181d21']}
            style={{
              ...Styling.background,
              height: HeightRatio(60),
              borderRadius: HeightRatio(8),
              borderWidth: 2,
              borderColor: '#ff0076',
              opacity: 0.9
            }}
          />
          {/* <View style={{ flexDirection: 'column' }}>
            <Text
              style={{
                color: 'white',
                fontSize: HeightRatio(20),
                fontWeight: 'bold',
                marginTop: HeightRatio(10),
                marginLeft: WidthRatio(20)
              }}
              allowFontScaling={false}
            >
              {pos}
            </Text>
          </View> */}
          <View style={{ flexDirection: 'row', marginLeft: WidthRatio(20), marginTop: HeightRatio(15), }}>
            <View style={{ flexDirection: 'column' }}>
              <View style={{ alignSelf: 'flex-start' }}>
                <Text
                  style={{
                    fontSize: HeightRatio(25),
                    fontWeight: 'bold',
                    color: 'white',
                    width: WidthRatio(140)
                  }}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  allowFontScaling={false}
                >
                  {username.toUpperCase()}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'column',
                width: WidthRatio(200),
                
              }}

            >
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
                <Text
                  style={{
                    fontSize: HeightRatio(25), // reduced font size
                    fontWeight: 'bold',
                    color: 'white',
                    marginRight: HeightRatio(40),
                    padding: 2, // reduced padding
                  }}
                  numberOfLines={1} // added numberOfLines prop
                  ellipsizeMode='tail' // added ellipsizeMode prop
                  allowFontScaling={false}
                >
                  {score} 
                  {/* <Text style={{ color: '#83e377' }} allowFontScaling={false}>
                    {' points'}
                  </Text> */}
                </Text>
              </View>



            </View>
          </View>
        </View>
        {/* <View style={Styling.modalDivisionLine}></View> */}
      </View>
      
    </>
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
      <View style={{ ...Styling.container, backgroundColor: 'black', }}>
        <Navbar nav={navigation} auth={authState} position={'relative'} from={'leader'} />
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

        <View
          style={{
            alignSelf: 'center',
            flexDirection: 'column'
          }}
        >

          {/* <View style={{ 
            alignSelf: 'center', 
            flexDirection: 'column', 
            backgroundColor: '(rgba(255, 255, 255, 0.1)', 
            padding: 10, 
            borderRadius: 50, 
            width: WidthRatio(340), 
            marginTop: HeightRatio(30) 
          }}>
            <Text style={{ color: 'white', fontSize: HeightRatio(40), fontWeight: 'bold', alignSelf: 'center' }}>Leaderboard</Text>
            <Text style={{ color: 'white', fontSize: HeightRatio(20), alignSelf: 'center' }}>Last 30 Days</Text>
          </View> */}
            <Image
              source={require('../../assets/leaderboard.png')}
              style={{
                height: HeightRatio(250),
                width: HeightRatio(500),
                alignSelf: 'center',
                position: 'absolute',
                top: HeightRatio(-20)
              }}
            />
            {/* <Image
              source={require('../../assets/leaderboard_1.png')}
              style={{
                height: HeightRatio(150),
                width: HeightRatio(450),
                alignSelf: 'center',
                position: 'absolute',
                top: HeightRatio(10)
              }}
            /> */}
          <SafeAreaView 
            style={{
              ...Styling.flatlistContainer, 
              position: 'absolute', 
              top: HeightRatio(150),
              left: HeightRatio(-185),
              // backgroundColor: 'red'
            }}>
            <FlatList
              data={DATA}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
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
