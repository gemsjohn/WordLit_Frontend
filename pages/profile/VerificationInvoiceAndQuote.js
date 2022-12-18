import React, { useEffect, useState } from 'react';
import { Button, View, Text, Image, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, ScrollView, StatusBar, Alert, Modal, Pressable, Dimensions, Linking } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSolid, faSackDollar, faCircleArrowLeft, faX, faUserShield, faStar, faPenToSquare, faCopy, faMinus, faMessage, faTrash, faArrowRight } from '@fortawesome/free-solid-svg-icons'
// import { Row, Spinner, Button } from 'react-bootstrap';
// import QRCode from 'qrcode';
import {
    strikeIssueNewInvoiceForSpecifiedReceiver,
    lnInvoice,
} from '../../utils/API';
import { UPDATE_USER, } from '../../utils/mutations';
import { GET_USER_BY_ID } from '../../utils/queries';
import { useMutation, useQuery } from '@apollo/client';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SvgQRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const DemoAppInvoiceAndQuote = (props) => {
    // localStorage.setItem("strikeBtnSelected", false);
    const [modalVisible, setModalVisible] = useState(true);
    const businessOwner = 'bekkahhuss' // PRIVATE INFORMATION, NEED TO REMOVE!

    // let imageQRCode;
    let amount = 0.25;
    let correlationIdLocal;
    // let intervalID;

    const [imageQRCode, setImageQRCode] = useState('')
    const [displayQRCode, setDisplayQRCode] = useState(false);
    const [eventID, setEventID] = useState('');
    const [paymentStatus, setPaymentStatus] = useState(false);
    const [startLoadingProcess, setStartLoadingProcess] = useState(false)
    const [count, setCount] = useState(0);
    const [remainder, setRemainder] = useState(30);
    const [correlationValue, setCorrelationValue] = useState('');
    const [updateUser] = useMutation(UPDATE_USER);
    const [paymentReceived, setPaymentReceived] = useState(false)
    const [modalShow, setModalShow] = useState(false);
    const [displayHelpContent, setDisplayHelpContent] = useState(false);
    const [paymentReceivedFalseStatement, setPaymentReceivedFalseStatement] = useState(true);
    const [runModal, setRunModal] = useState(false);
    // const me = UserData();

    // Copy to clipboard
    const [copiedText, setCopiedText] = useState('');

    const fetchCopiedText = async () => {
        const text = await Clipboard.getStringAsync();
        setCopiedText(text);
    };

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(lnInvoice);
        fetchCopiedText()
    };

    // Modal
    const [stage1, setStage1] = useState(false);




    const [asyncCorrelationIdLocal, setAsyncCorrelationIdLocal] = useState('');
    const [asyncLNInvoice, setAsyncLNInvoice] = useState('')

    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: props.currentuser._id }
    });


    const getCorrelationIdLocal = async () => {
        try {
            const value = await AsyncStorage.getItem('@correlationIdLocal')
            if (value !== null) {
                setAsyncCorrelationIdLocal(value)
                // console.log("getCorrelationIdLocal: " + value)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const storeLNInvoice = async () => {
        try {
            const value = await AsyncStorage.getItem('@lnInvoice')
            if (value !== null) {
                setAsyncLNInvoice(value)
                // console.log("storeLNInvoice: " + value)
            }
        } catch (e) {
            console.error(e)
        }
    }
    getCorrelationIdLocal();
    storeLNInvoice();

    // [[[SPINNER]]]
    // Loads the React Bootstrap Spinner.
    function LoadingSpinner() {
        return (
            <Spinner style={{ margin: '10px', color: 'white' }} animation="border" role="status"></Spinner>
        );
    }

    const envelope = (recipient, amount) => {
        strikeIssueNewInvoiceForSpecifiedReceiver(recipient, amount, "Honest Patina Verification");
        let intervalID = setInterval(() => {
            console.log("lnInvoice: " + lnInvoice)
            if (lnInvoice != undefined) {
                setDisplayQRCode(true);
                clearInterval(intervalID)
            }
        }, 1000)
    }

    const resetEnvelope = () => {
        setDisplayQRCode(false);
    }



    const checkStatus = () => {
        let config = {
            method: 'get',
            url: `https://api.strike.me/v1/invoices/${asyncCorrelationIdLocal}`,
            headers: {
                'Accept': 'application/json',
                authorization: `Bearer BFD7B987D3F72566DEA49CE1FF7D8F592817AADC8B9A62100E71E897AC760BE2`  //API KEY NEED TO REMOVE!!!
            }
        };
        axios(config)
            .then((response) => {
                if (response.data.state === 'PAID') {
                    updateVerificationStatus(true);
                    setPaymentReceived(true)
                    setModalVisible(!modalVisible);
                }
                else if (response.data.state === 'UNPAID') {
                    setPaymentReceived(false)
                    setPaymentReceivedFalseStatement(false)
                }
            })
            .catch((error) => { console.log(error); });
    }

    const updateVerificationStatus = async (status) => {
        try {
            await updateUser({
                variables: {
                    username: userByID?.user.username,
                    email: userByID?.user.email,
                    profilepicture: userByID?.user.profilepicture,
                    primarylocation: userByID?.user.primarylocation,
                    verified: status
                }
            });
            refetch();
            // localStorage.setItem("lnInvoice", null);
            // localStorage.setItem("correlationIdLocal", null)
        }
        catch (e) { console.error(e); }
    }

    useEffect(() => {
        envelope(businessOwner, amount);
    }, [])


    return (
        <>
            {displayQRCode &&
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {/* TOP ROW */}
                        <View
                            style={{
                                backgroundColor: 'rgba(255, 0, 0, 1)',
                                alignSelf: 'center',
                                borderRadius: 10,
                                position: 'absolute',
                                top: 3,
                                right: 4
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => { setModalVisible(!modalVisible); }}
                                style={{ borderRadius: 10 }}
                            >
                                <FontAwesomeIcon
                                    icon={faSolid, faX}
                                    style={{ color: 'black', justifyContent: 'center', alignSelf: 'center', margin: 10 }}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* MIDDLE ROW */}
                        {!stage1 &&
                            <>
                                <View style={{ flexDirection: 'row', alignSelf: 'center', backgroundColor: '#00a896', borderRadius: 10, margin: 5, width: windowWidth - 80, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', alignSelf: 'center', margin: 10 }}>
                                        Verification costs $0.25.
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignSelf: 'center', backgroundColor: '#00a896', borderRadius: 10, margin: 5, width: windowWidth - 80, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', alignSelf: 'center', margin: 10, }}>
                                        You need a Bitcoin Lightning compatable digital wallet.
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignSelf: 'center', backgroundColor: '#00a896', borderRadius: 10, margin: 5, width: windowWidth - 80, justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', alignSelf: 'center', margin: 10, }}>
                                        Select one below to install.
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignSelf: 'center', backgroundColor: 'transparent', borderRadius: 10, margin: 10, width: windowWidth - 80, justifyContent: 'center', padding: 20 }}>

                                    <TouchableOpacity
                                        onPress={() => Linking.openURL('https://bluewallet.io/')}
                                        style={{ marginLeft: 20, marginRight: 20 }}
                                    >
                                        <View style={{ flexDirection: 'column' }}>
                                            <Image source={require('../../assets/bluewalleticon.png')} style={{ height: 63, width: 60, alignSelf: 'center', borderRadius: 10 }} />
                                            <Text style={{ color: 'white', alignSelf: 'center', marginTop: 4 }}>
                                                Blue Wallet
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => Linking.openURL('https://strike.me/')}
                                        style={{ marginLeft: 20, marginRight: 20 }}
                                    >
                                        <View style={{ flexDirection: 'column' }}>
                                            <Image source={require('../../assets/stikeicon.png')} style={{ height: 63, width: 60, alignSelf: 'center', borderRadius: 10 }} />
                                            <Text style={{ color: 'white', alignSelf: 'center', marginTop: 4 }}>
                                                Strike
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => Linking.openURL('https://cash.app/')}
                                        style={{ marginLeft: 20, marginRight: 20 }}
                                    >
                                        <View style={{ flexDirection: 'column' }}>
                                            <Image source={require('../../assets/cashappicon.png')} style={{ height: 63, width: 60, alignSelf: 'center', borderRadius: 10 }} />
                                            <Text style={{ color: 'white', alignSelf: 'center', marginTop: 4 }}>
                                                Cash App
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>
                                <TouchableOpacity
                                    onPress={() => { setStage1(true) }}
                                    style={{ borderRadius: 10, backgroundColor: 'blue', marginTop: 10, flexDirection: 'row' }}
                                >
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', alignSelf: 'center', margin: 10, }}>
                                        Next
                                    </Text>
                                    <FontAwesomeIcon
                                        icon={faSolid, faArrowRight}
                                        style={{ color: 'white', justifyContent: 'center', alignSelf: 'center', margin: 10 }}
                                    />
                                </TouchableOpacity>
                            </>
                        }


                        {stage1 &&
                            <>
                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    <Image source={require('../../assets/lnicon.png')} style={{ height: 63, width: 60 }} />
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', alignSelf: 'center', margin: 10 }}>
                                        Lightning Network Invoice
                                    </Text>
                                </View>
                                {/* QR CODE */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginBottom: 10,
                                        alignItems: 'center',
                                    }}
                                >
                                    <SvgQRCode size={200} value={lnInvoice} />
                                </View>

                                {/* COPY TEXT AND BUTTON */}
                                <View>
                                    <Text 
                                        style={{ color: 'white' }}
                                        numberOfLines={1} 
                                        ellipsizeMode='middle'
                                    >
                                        {copiedText}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    onPress={copyToClipboard}
                                    style={{ backgroundColor: 'blue', padding: 10, borderRadius: 10, margin: 20, flexDirection: 'row' }}
                                >
                                    <Text style={{ color: 'white', alignSelf: 'center', fontSize: 15, fontWeight: 'bold' }}>Copy LN Invoice</Text>
                                    <FontAwesomeIcon
                                        icon={faSolid, faCopy}
                                        style={{ color: 'white', justifyContent: 'center', alignSelf: 'center', margin: 10 }}
                                    />

                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={checkStatus}
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
                                    <Text style={{ color: '#001219', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' }}>Confirm Payment</Text>
                                </TouchableOpacity>
                            </>
                        }
                    </View>
                </View>
            </Modal>
            }
        </>
    )
    // return (
    //     <>
    //         {!me?.verified ?
    //             <>
    //                 <button
    //                     onClick={() => {
    //                         setModalShow(true);
    //                         envelope(businessOwner, amount);
    //                     }}
    //                     type='button'
    //                     style={{
    //                         backgroundColor: '#55a630',
    //                         border: 'none',
    //                         borderRadius: '10px',
    //                         outline: 'none',
    //                         alignItems: 'center',
    //                         margin: '1rem',
    //                         color: 'white',
    //                         width: 'fit-content'
    //                     }}
    //                 >
    //                     <p style={{ alignItems: 'center', margin: 'auto', padding: '0.5rem' }}><i className="fa-solid fa-bolt"></i> Pay $0.10 to Communicate</p>

    //                 </button>
    //                 <button
    //                     onClick={() => {
    //                         setDisplayHelpContent(current => !current)
    //                     }}
    //                     type='button'
    //                     style={{
    //                         backgroundColor: '#e63946',
    //                         border: 'none',
    //                         borderRadius: '10px',
    //                         outline: 'none',
    //                         alignItems: 'center',
    //                         margin: '1rem',
    //                         color: 'white',
    //                         width: 'fit-content'
    //                     }}
    //                 >
    //                     <p style={{ alignItems: 'center', margin: 'auto', padding: '0.5rem' }}>Help</p>

    //                 </button>
    //                 <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
    //                     {displayHelpContent ?
    //                         <div style={{ backgroundColor: 'rgba(230, 57, 70, 0.75)', borderRadius: '20px', padding: '1rem' }}>
    //                             <p style={{ backgroundColor: 'rgba(230, 57, 70, 1)', borderRadius: '20px', padding: '1rem' }}>Help</p>
    //                             <div style={{ display: 'flex', padding: '0.1rem' }}>
    //                                 <p style={{ width: '80vw', color: 'white', margin: '0.5rem auto' }}>
    //                                     1. You need a Bitcoin Lightning compatable digital wallet such as Cash App, Strike, Bluewallet, etc.
    //                                 </p>
    //                             </div>
    //                             <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '0.1rem', fontSize: '1rem', width: 'fit-content', margin: 'auto' }}>
    //                                 <a
    //                                     style={{ background: 'transparent', border: 'solid', borderWidth: 'thin', margin: 'auto 0.5rem', borderRadius: '10px' }}
    //                                     href='https://cash.app/'
    //                                 >
    //                                     <img src={cashappicon} style={{ height: '4rem', borderRadius: '10px' }}></img>
    //                                 </a>
    //                                 <a
    //                                     style={{ background: 'transparent', border: 'solid', borderWidth: 'thin', margin: 'auto 0.5rem', borderRadius: '10px' }}
    //                                     href='https://strike.me/'
    //                                 >
    //                                     <img src={strikeicon} style={{ height: '4rem', borderRadius: '10px' }}></img>
    //                                 </a>
    //                                 <a
    //                                     style={{ background: 'transparent', border: 'solid', borderWidth: 'thin', margin: 'auto 0.5rem', borderRadius: '10px' }}
    //                                     href='https://bluewallet.io/'
    //                                 >
    //                                     <img src={bulletwalleticon} style={{ height: '4rem', borderRadius: '10px' }}></img>
    //                                 </a>
    //                             </div>
    //                             {/* <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '1rem 0' }}>
    //                         <p style={{ padding: '0.1rem' }}>2. Follow this 1 min video</p>
    //                     </div> */}
    //                         </div>

    //                         :
    //                         null
    //                     }
    //                 </div>
    //                 <Modal onClose={() => { setModalShow(false); resetEnvelope(); localStorage.setItem("lnInvoice", null); localStorage.setItem("correlationIdLocal", null) }} show={modalShow}>
    //                     {!paymentStatus ?
    //                         <>
    //                             {displayQRCode ?
    //                                 <>
    //                                     <img src={lnicon} style={{ height: '4rem', position: 'absolute', zIndex: '1', marginTop: '-5rem' }} />
    //                                     <p
    //                                         style={{
    //                                             height: '4rem',
    //                                             position: 'absolute',
    //                                             marginTop: '-5rem',
    //                                             color: 'white',
    //                                             marginLeft: '-0.1rem',
    //                                             backgroundColor: 'black',
    //                                             padding: '1rem',
    //                                             borderRadius: '20px',
    //                                             width: '22rem',
    //                                             display: 'flex',
    //                                             flexWrap: 'wrap',
    //                                             justifyContent: 'center',
    //                                             fontSize: '1.5rem'
    //                                         }}>Lightning Network Invoice</p>
    //                                     {imageQRCode ?

    //                                         <Row>
    //                                             <div style={{ margin: 'auto' }}>

    //                                                 <img src={imageQRCode} alt=""></img>
    //                                             </div>
    //                                         </Row>
    //                                         :
    //                                         <Row>
    //                                             <div style={{ margin: 'auto' }}>
    //                                                 <p style={{ color: '#EE9B00' }}>Clear and try again.</p>
    //                                             </div>
    //                                         </Row>
    //                                     }

    //                                     <button
    //                                         onClick={() => copyLink()}
    //                                         style={{
    //                                             backgroundColor: 'green',
    //                                             color: 'white',
    //                                             borderStyle: 'none',
    //                                             borderRadius: '10px',
    //                                             width: '20rem',
    //                                             display: 'flex',
    //                                             flexWrap: 'wrap',
    //                                             justifyContent: 'center',
    //                                             margin: '10px auto',
    //                                             padding: '0.5rem'
    //                                         }}
    //                                     >
    //                                         Copy &nbsp;<i className="fa-solid fa-bolt"></i>&nbsp; Invoice
    //                                     </button>
    //                                     <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', color: 'white', margin: 'auto' }}>{copySuccess}</div>
    //                                     <button
    //                                         onClick={() => {
    //                                             checkStatus()
    //                                         }}
    //                                         style={{
    //                                             backgroundColor: 'blue',
    //                                             color: 'white',
    //                                             borderStyle: 'none',
    //                                             borderRadius: '10px',
    //                                             width: '20rem',
    //                                             display: 'flex',
    //                                             flexWrap: 'wrap',
    //                                             justifyContent: 'center',
    //                                             margin: 'auto',
    //                                             padding: '0.5rem'
    //                                         }}
    //                                     >Select to Confirm Payment</button>
    //                                     {paymentReceived ?
    //                                         <p style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', color: 'green', }}>Payment Received!</p>
    //                                         :
    //                                         <>
    //                                             {paymentReceivedFalseStatement ?
    //                                                 null
    //                                                 :
    //                                                 <p style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', color: '#EE9B00', marginTop: '1rem' }}>The Payment has not been received.</p>
    //                                             }
    //                                         </>
    //                                     }
    //                                     <button
    //                                         onClick={() => {
    //                                             resetEnvelope();
    //                                             setModalShow(false);
    //                                             setTimeout(() => {
    //                                                 window.location.reload(false);
    //                                             }, 100)

    //                                         }}
    //                                         style={{
    //                                             backgroundColor: 'red',
    //                                             color: 'white',
    //                                             borderStyle: 'none',
    //                                             borderRadius: '10px',
    //                                             width: '20rem',
    //                                             display: 'flex',
    //                                             flexWrap: 'wrap',
    //                                             justifyContent: 'center',
    //                                             margin: '10px auto',
    //                                             padding: '0.5rem'
    //                                         }}>Clear</button>
    //                                     <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
    //                                         <img src={strikeIcon} style={{ height: '3rem', width: '3rem' }} alt="" />
    //                                         <p style={{ color: 'white', margin: 'auto 1rem' }}>Powered by Strike API</p>
    //                                     </div>
    //                                 </>
    //                                 :
    //                                 <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
    //                                     <LoadingSpinner />
    //                                 </div>

    //                             }
    //                         </>
    //                         :
    //                         null
    //                     }

    //                 </Modal>

    //             </>
    //             :
    //             <p>You are verified!</p>
    //         }
    //     </>
    // )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //   paddingTop: StatusBar.currentHeight,
    },
    scrollView: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        marginHorizontal: 0,
    },
    text: {
        fontSize: 42,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        width: windowWidth - 20
    },
    modalView: {
        margin: 20,
        backgroundColor: '#001219',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
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
        width: windowWidth - 20
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginLeft: 10,
        marginRight: 10
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 20,
        fontWeight: 'bold'
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    }
});
