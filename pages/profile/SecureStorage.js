import React, { useState, useContext, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { MainStateContext } from '../../App';
import { HeightRatio, Styling } from '../../Styling';

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function deleteKey(key) {
  await SecureStore.deleteItemAsync(key);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    alert("🔐 Here's your value 🔐 \n" + result);
  } else {
    alert('No values stored under that key.');
  }
}

export const SecureStorage = () => {
  const { mainState, setMainState } = useContext(MainStateContext);

  const [key, onChangeKey] = useState('Your key here');
  const [value, onChangeValue] = useState('Your value here');
  const [prompKeyInput, setPromptKeyInput] = useState()
  const userID = useRef(null);
  const [keyPress, setKeyPress] = useState('');
  const [keyArray, setKeyArray] = useState([]);
  const [count, setCount] = useState(0);
  const [warning, setWarning] = useState(false);
  const [displayKeycode, setDisplayKeycode] = useState(false)
  const [displaySetCode, setDisplaySetCode] = useState(false)
  const [combinedStringState, setCombinedStringState] = useState('')

  const handleKeyPress = (value) => {
    setKeyPress(keyPress + value);
    setKeyArray(current => [...current, value])
    setCount(prev => prev + 1)
  };

  const clearKeyCode = () => {
    setKeyPress('');
    setKeyArray([])
    setCount(0)
  }

  const setKeyCode = () => {
    if (count > 3) {
      let combinedString = keyArray.join('');
      save('cosmicKey', `${combinedString}`);
      setCombinedStringState(combinedString)
      setKeyPress('');
      setKeyArray([])
      setCount(0)
      setDisplayKeycode(false)
      setDisplaySetCode(true)
      // setTimeout(() => {
      //   setDisplaySetCode(false)
      // }, 5000);
    } else {
      setWarning(true)
      setTimeout(() => {
        setWarning(false)
        setCombinedStringState('')
      }, 3000);
    }

  }

  useEffect(() => {
    userID.current = mainState.current.userID;
  }, [])


  return (
    <>
      {!displaySetCode ?
        <View style={{ marginTop: HeightRatio(10), borderRadius: 40, backgroundColor: 'black' }}>
          <View style={{ alignSelf: 'center' }}>
            <Text
              style={{ color: 'white', fontSize: HeightRatio(30), fontWeight: 'bold', textAlign: 'center', width: HeightRatio(200), margin: HeightRatio(10), marginTop: HeightRatio(20) }}
              allowFontScaling={false}>
              Set a Keycode for easy login!
            </Text>
          </View>
          <>
            <View style={{ marginTop: HeightRatio(10), flexDirection: 'row', alignSelf: 'center' }}>
              {count > 0 ?
                <View style={{
                  backgroundColor: 'rgba(255, 255, 255, 1.0)',
                  height: HeightRatio(40),
                  width: HeightRatio(40),
                  margin: HeightRatio(10),
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text style={{
                    color: 'black',
                    fontSize: HeightRatio(15),
                    fontWeight: 'bold',
                    alignSelf: 'center'
                  }}
                    allowFontScaling={false}>
                    {keyArray[0]}
                  </Text>
                </View>

                :
                <View style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  height: HeightRatio(40),
                  width: HeightRatio(40),
                  margin: HeightRatio(10)
                }} />
              }
              {count > 1 ?
                <View style={{
                  backgroundColor: 'rgba(255, 255, 255, 1.0)',
                  height: HeightRatio(40),
                  width: HeightRatio(40),
                  margin: HeightRatio(10),
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text style={{
                    color: 'black',
                    fontSize: HeightRatio(15),
                    fontWeight: 'bold',
                    alignSelf: 'center'
                  }}
                    allowFontScaling={false}>
                    {keyArray[1]}
                  </Text>
                </View>

                :
                <View style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  height: HeightRatio(40),
                  width: HeightRatio(40),
                  margin: HeightRatio(10)
                }} />
              }
              {count > 2 ?
                <View style={{
                  backgroundColor: 'rgba(255, 255, 255, 1.0)',
                  height: HeightRatio(40),
                  width: HeightRatio(40),
                  margin: HeightRatio(10),
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text style={{
                    color: 'black',
                    fontSize: HeightRatio(15),
                    fontWeight: 'bold',
                    alignSelf: 'center'
                  }}
                    allowFontScaling={false}>
                    {keyArray[2]}
                  </Text>
                </View>

                :
                <View style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  height: HeightRatio(40),
                  width: HeightRatio(40),
                  margin: HeightRatio(10)
                }} />
              }
              {count > 3 ?
                <View style={{
                  backgroundColor: 'rgba(255, 255, 255, 1.0)',
                  height: HeightRatio(40),
                  width: HeightRatio(40),
                  margin: HeightRatio(10),
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text style={{
                    color: 'black',
                    fontSize: HeightRatio(15),
                    fontWeight: 'bold',
                    alignSelf: 'center'
                  }}
                    allowFontScaling={false}>
                    {keyArray[3]}
                  </Text>
                </View>

                :
                <View style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  height: HeightRatio(40),
                  width: HeightRatio(40),
                  margin: HeightRatio(10)
                }} />
              }



            </View>

            {warning &&
              <Text style={{ color: 'red', fontSize: HeightRatio(15), alignSelf: 'center', marginTop: 20 }}>
                Must be 4 #'s!
              </Text>
            }

            <View style={{ marginTop: 10, marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    height: HeightRatio(60),
                    width: HeightRatio(60),
                    borderRadius: HeightRatio(200),
                    margin: HeightRatio(10)
                  }}
                  onPress={() => handleKeyPress('1')}>
                  <Text
                    style={{ color: 'white', fontSize: HeightRatio(30), fontWeight: 'bold', flex: 1, alignSelf: 'center', marginTop: HeightRatio(12) }}
                    allowFontScaling={false}
                  >1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    height: HeightRatio(60),
                    width: HeightRatio(60),
                    borderRadius: HeightRatio(200),
                    margin: HeightRatio(10)
                  }}
                  onPress={() => handleKeyPress('2')}>
                  <Text
                    style={{ color: 'white', fontSize: HeightRatio(30), fontWeight: 'bold', flex: 1, alignSelf: 'center', marginTop: HeightRatio(12) }}
                    allowFontScaling={false}
                  >2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  height: HeightRatio(60),
                  width: HeightRatio(60),
                  borderRadius: HeightRatio(200),
                  margin: HeightRatio(10)
                }} onPress={() => handleKeyPress('3')}>
                  <Text
                    style={{ color: 'white', fontSize: HeightRatio(30), fontWeight: 'bold', flex: 1, alignSelf: 'center', marginTop: HeightRatio(12) }}
                    allowFontScaling={false}
                  >3</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  height: HeightRatio(60),
                  width: HeightRatio(60),
                  borderRadius: HeightRatio(200),
                  margin: HeightRatio(10)
                }} onPress={() => handleKeyPress('4')}>
                  <Text
                    style={{ color: 'white', fontSize: HeightRatio(30), fontWeight: 'bold', flex: 1, alignSelf: 'center', marginTop: HeightRatio(12) }}
                    allowFontScaling={false}
                  >4</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  height: HeightRatio(60),
                  width: HeightRatio(60),
                  borderRadius: HeightRatio(200),
                  margin: HeightRatio(10)
                }} onPress={() => handleKeyPress('5')}>
                  <Text
                    style={{ color: 'white', fontSize: HeightRatio(30), fontWeight: 'bold', flex: 1, alignSelf: 'center', marginTop: HeightRatio(12) }}
                    allowFontScaling={false}
                  >5</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  height: HeightRatio(60),
                  width: HeightRatio(60),
                  borderRadius: HeightRatio(200),
                  margin: HeightRatio(10)
                }} onPress={() => handleKeyPress('6')}>
                  <Text
                    style={{ color: 'white', fontSize: HeightRatio(30), fontWeight: 'bold', flex: 1, alignSelf: 'center', marginTop: HeightRatio(12) }}
                    allowFontScaling={false}
                  >6</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  height: HeightRatio(60),
                  width: HeightRatio(60),
                  borderRadius: HeightRatio(200),
                  margin: HeightRatio(10)
                }} onPress={() => handleKeyPress('7')}>
                  <Text
                    style={{ color: 'white', fontSize: HeightRatio(30), fontWeight: 'bold', flex: 1, alignSelf: 'center', marginTop: HeightRatio(12) }}
                    allowFontScaling={false}
                  >7</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  height: HeightRatio(60),
                  width: HeightRatio(60),
                  borderRadius: HeightRatio(200),
                  margin: HeightRatio(10)
                }} onPress={() => handleKeyPress('8')}>
                  <Text
                    style={{ color: 'white', fontSize: HeightRatio(30), fontWeight: 'bold', flex: 1, alignSelf: 'center', marginTop: HeightRatio(12) }}
                    allowFontScaling={false}
                  >8</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  height: HeightRatio(60),
                  width: HeightRatio(60),
                  borderRadius: HeightRatio(200),
                  margin: HeightRatio(10)
                }} onPress={() => handleKeyPress('9')}>
                  <Text
                    style={{ color: 'white', fontSize: HeightRatio(30), fontWeight: 'bold', flex: 1, alignSelf: 'center', marginTop: HeightRatio(12) }}
                    allowFontScaling={false}
                  >9</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'red',
                    height: HeightRatio(60),
                    width: HeightRatio(60),
                    borderRadius: HeightRatio(200),
                    margin: HeightRatio(10)
                  }}
                  onPress={() => clearKeyCode()}>
                  <Text style={{ color: 'white', fontSize: HeightRatio(16), fontWeight: 'bold', flex: 1, alignSelf: 'center', marginTop: HeightRatio(15) }}
                    allowFontScaling={false}
                  >Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  height: HeightRatio(60),
                  width: HeightRatio(60),
                  borderRadius: HeightRatio(200),
                  margin: HeightRatio(10)
                }} onPress={() => handleKeyPress('0')}>
                  <Text
                    style={{ color: 'white', fontSize: HeightRatio(30), fontWeight: 'bold', flex: 1, alignSelf: 'center', marginTop: HeightRatio(12) }}
                    allowFontScaling={false}
                  >0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'green',
                    height: HeightRatio(60),
                    width: HeightRatio(60),
                    borderRadius: HeightRatio(200),
                    margin: HeightRatio(10)
                  }}
                  onPress={() => setKeyCode()}>
                  <Text style={{ color: 'white', fontSize: HeightRatio(16), fontWeight: 'bold', flex: 1, alignSelf: 'center', marginTop: HeightRatio(15) }}
                    allowFontScaling={false}
                  >Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        </View>
        :
        <View style={{ alignSelf: 'center' }}>
          <Text style={{ fontSize: HeightRatio(50), color: 'white' }}>
            &nbsp; Saved &nbsp;
          </Text>
        </View>
      }
    </>

  );
}