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
            // backgroundColor: 'rgba(0, 0, 0, 0.5)',
            // height: HeightRatio(100),
            width: WidthRatio(340),
            height: HeightRatio(50),
            alignSelf: 'center',
            // borderRadius: 50,
            flexDirection: 'row',
            marginTop: HeightRatio(20)
          }}
        >
          <LinearGradient
            colors={['#0b132b', '#181d21']}
            style={{
              ...Styling.background,
              height: HeightRatio(50),
              borderRadius: HeightRatio(20),
              borderWidth: 2,
              borderColor: 'rgba(255, 255, 255, 0.25)',
              opacity: 0.5
            }}
          />
          <View style={{ flexDirection: 'column' }}>
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
          </View>
          <View style={{ flexDirection: 'row', marginLeft: WidthRatio(20), marginTop: HeightRatio(10), }}>
            <View style={{ flexDirection: 'column' }}>
              <View style={{ alignSelf: 'flex-start' }}>
                <Text
                  style={{
                    fontSize: HeightRatio(20),
                    fontWeight: 'bold',
                    color: '#efea5a',
                    width: WidthRatio(100)
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
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    fontSize: HeightRatio(20),
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
                  style={{ fontSize: HeightRatio(20), fontWeight: 'bold', color: '#83e377', alignSelf: 'flex-end', marginLeft: 4 }}
                  allowFontScaling={false}
                >
                  points
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

          }}
        >

          <View style={{ 
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
          </View>
          <SafeAreaView style={{...Styling.flatlistContainer}}>
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
