import { useEffect, useState, useContext, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../utils/queries';
import { MainStateContext } from '../../App';
import { LinearGradient } from 'expo-linear-gradient';
import { Styling, HeightRatio, WidthRatio, windowHeight, windowWidth } from '../../Styling';
import {
    Text,
    View,
} from 'react-native';
import {
    faSolid,
    faClock,
    faFlagCheckered,
} from '@fortawesome/free-solid-svg-icons'

const COLORS = [
    '#f94144',
    '#f3722c',
    '#f8961e',
    '#43aa8b',
    '#577590',
    '#f72585',
    '#4361ee',
    '#9f86c0',
    '#ff1654',
    '#4a5759',
    '#ad2831',
    '#cc8b79'
];

const RecentGames = (props) => {
    const { mainState, setMainState } = useContext(MainStateContext);
    let gameCards = [];

    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: mainState.current.userID }
    });
    
    for (let i = 0; i < userByID?.user.games.length; i++) {
        const index = Math.floor(Math.random() * COLORS.length);
        gameCards[i] =
            <View
                style={{
                    padding: HeightRatio(10),
                    flexDirection: 'row',
                    marginTop: 5,
                    marginBottom: 5,
                    width: windowWidth * 0.9,
                }}
                key={i}
            >
                <LinearGradient
                    colors={['#0b132b', '#181d21']}
                    style={{
                        ...Styling.background,
                        height: HeightRatio(90),
                        borderRadius: HeightRatio(8),
                        borderWidth: 2,
                        borderColor: '#ff0076',
                        opacity: 0.9
                    }}
                />
                <View style={{ 
                    flexDirection: 'column', 
                    backgroundColor: `${COLORS[index]}`, 
                    borderRadius: 100, 
                    width: WidthRatio(50), 
                    height: WidthRatio(50), 
                    marginRight: 10, 
                    borderLeftWidth: 2, 
                    borderBottomWidth: 2 }}>
                    <FontAwesomeIcon
                        icon={faSolid, faFlagCheckered}
                        style={{ 
                            color: 'white', 
                            alignSelf: 'center', 
                            marginRight: 10 
                        }}
                        size={20}
                    />
                </View>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row' }}>


                        <Text
                            style={{ 
                                fontSize: windowWidth * 0.05, 
                                fontWeight: 'bold', 
                                color: '#efea5a', 
                                marginRight: 10 
                            }}
                            allowFontScaling={false}
                        >{userByID?.user.games[i].score} points</Text>
                        <FontAwesomeIcon
                            icon={faSolid, faClock}
                            style={{ 
                                color: 'white', 
                                alignSelf: 'center', 
                                marginRight: 10 
                            }}
                            size={20}
                        />
                        <Text
                            style={{ 
                                fontSize: windowWidth * 0.05, 
                                fontWeight: 'bold', 
                                color: 'white', 
                                marginRight: 10 
                            }}
                            allowFontScaling={false}
                        >{userByID?.user.games[i].time} seconds</Text>
                    </View>
                    <View style={{ 
                        flexDirection: 'row', 
                        marginLeft: 30 
                    }}>
                        <Text
                            style={{ 
                                fontSize: windowWidth * 0.05, 
                                fontWeight: 'bold', 
                                color: '#19d0bf', 
                                marginRight: 10 
                            }}
                            allowFontScaling={false}
                        >Words:</Text>
                        <Text
                            style={{ 
                                fontSize: windowWidth * 0.05, 
                                fontWeight: 'bold', 
                                color: 'white', 
                                marginRight: 10 
                            }}
                            allowFontScaling={false}
                        >{userByID?.user.games[i].w1},</Text>
                        <Text
                            style={{ 
                                fontSize: windowWidth * 0.05, 
                                fontWeight: 'bold', 
                                color: 'white', 
                                marginRight: 10 }}
                            allowFontScaling={false}
                        >{userByID?.user.games[i].w2}</Text>
                    </View>
                </View>
            </View>
    }

    useEffect(() => {
        refetch()
    }, [])

    return (
        <>
            <View style={{ alignSelf: 'center' }}>
                {gameCards.reverse()}
            </View>
        </>
    )
}

export default memo(RecentGames);