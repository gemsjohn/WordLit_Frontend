import React, { createContext, useEffect, useRef, useState } from 'react';
import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/link-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameScreen } from './pages/game/Game';
import { HomeScreen } from './pages/home/Home';
import { KeyScreen } from './pages/home/Key';
import { LeaderScreen } from './pages/leader/Leader';
import { ProfileScreen } from './pages/profile/Profile';
import { Auth } from './pages/auth/auth';
import * as SecureStore from 'expo-secure-store';

export const MainStateContext = createContext();

const Stack = createNativeStackNavigator();

export default function App() {
  const mainStateRef = useRef({});
  const setMainState = (newState) => {
    mainStateRef.current = { ...mainStateRef.current, ...newState };
  };

  const [initRoute, setInitRoute] = useState("Key");

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      setInitRoute("Key")
      
    } else {
      setInitRoute("Home")
    }
  }

  useEffect(() => {
    getValueFor('cosmicKey')
  }, [])

  const GRAPHQL_API_URL = 'https://wordlit-backend.herokuapp.com/graphql';
  const asyncAuthLink = setContext(async () => {
    return {
      headers: {
        Authorization: mainStateRef.current.bearerToken,
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

  



  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  return (
    <>
      <ApolloProvider client={apolloClient}>
      <MainStateContext.Provider
          value={{ mainState: mainStateRef, setMainState }}>
        <NavigationContainer onStateChange={(state) => console.log('New state is', state.routes)}>
          <Stack.Navigator
            initialRouteName={initRoute}
            screenOptions={{
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
                orientation: 'portrait_up',

              }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                animationEnabled: false,
                headerShown: false,
                orientation: 'portrait_up',

              }}
            />
            <Stack.Screen
              name="Key"
              component={KeyScreen}
              options={{
              animationEnabled: false,
              headerShown: false,
              orientation: 'portrait_up'
            }}
            />
            <Stack.Screen
              name="Game"
              component={GameScreen}
              options={{
                animationEnabled: false,
                headerShown: false,
                orientation: 'portrait_up'
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                animationEnabled: false,
                headerShown: false,
                orientation: 'portrait_up'
              }}
            />
            <Stack.Screen
              name="Leader"
              component={LeaderScreen}
              options={{
                animationEnabled: false,
                headerShown: false,
                orientation: 'portrait_up'
              }}
            />

          </Stack.Navigator>
        </NavigationContainer>
        </MainStateContext.Provider>
      </ApolloProvider>
    </>
  );
}
