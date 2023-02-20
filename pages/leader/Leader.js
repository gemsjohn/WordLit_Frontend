import React, { useEffect, useState, useRef, useContext } from 'react';
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_BY_ID, LEADERBOARD } from '../../utils/queries';
import { Text, View, Image, StatusBar, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Navbar } from '../../components/Navbar';
import { Styling, HeightRatio, WidthRatio, windowHeight, windowWidth } from '../../Styling';
import { MainStateContext } from '../../App';

export const LeaderScreen = ({ navigation }) => {
  const { mainState, setMainState } = useContext(MainStateContext);
  const [selectedColor, setSelectedColor] = useState(null);
  const { data: leaderboard, refetch } = useQuery(LEADERBOARD);
  const DATA = leaderboard?.leaderBoard;

  const Item = ({ username, score, pos }) => (
    <>
      <View>
        <View
          style={{
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

          <View style={{ 
            flexDirection: 'row', 
            marginLeft: WidthRatio(20), 
            marginTop: HeightRatio(15), 
          }}>
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
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      
    </>
  );

  const renderItem = ({ item }) => (
    <Item username={item.username} score={item.score} pos={item.position} />
  );

  useEffect(() => {
    refetch();
  }, [])

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
      <View style={{ 
        ...Styling.container, 
        backgroundColor: 'black' 
      }}>
        <Navbar 
          nav={navigation} 
          position={'relative'} 
          from={'leader'} 
        />
        {selectedColor && selectedColor.gradient && selectedColor.image ?
            <DisplayGradient 
              gradient={selectedColor.gradient} 
              image={selectedColor.image} 
            />
            :
          <>
            <Image 
              source={require('../../assets/dalle_7.png')} 
              style={{ ...Styling.background, opacity: 0.4 }} 
            />
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

          <View style={{marginTop: HeightRatio(50), alignItems: 'center'}}>
            <Text style={{
              color: 'white', 
              fontSize: HeightRatio(50),
              textAlign: 'center',
              width: HeightRatio(300) 
            }}
            allowFontScaling={false}
            >
              Leaderboard
            </Text>
          </View>
          <View style={{marginTop: HeightRatio(5), alignItems: 'center'}}>
            <Text style={{
              color: 'white', 
              fontSize: HeightRatio(25),
              textAlign: 'center',
              width: HeightRatio(300) 
            }}
            allowFontScaling={false}
            >
              Last 30 days
            </Text>
          </View>
          <SafeAreaView 
            style={{
              ...Styling.flatlistContainer, 
              marginTop: HeightRatio(20)
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
