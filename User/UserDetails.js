import React, { useState } from 'react';
import { Button, View, TouchableOpacity, Text, TextInput } from "react-native";
import { Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSolid, faAddressCard, faEnvelope, faSackDollar, faStar, faX, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_USER, LOGIN_USER, UPDATE_USER_PASSWORD } from '../utils/mutations';
import { GET_USER_BY_ID } from '../utils/queries';
import axios from 'axios';
import { Loading } from '../components/Loading';
import { DemoAppInvoiceAndQuote } from './VerificationInvoiceAndQuote';

export const UserDetails = (props) => {
    // console.log(props)
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [updateUser] = useMutation(UPDATE_USER);
    const [updateUserPassword] = useMutation(UPDATE_USER_PASSWORD);

    const [showEditableFieldUsername, setShowEditableFieldUsername] = useState(false);
    const [showEditableFieldEmail, setShowEditableFieldEmail] = useState(false);
    const [showEditableFieldPassword, setShowEditableFieldPassword] = useState(false);
    const [showEditableFieldVerification, setShowEditableFieldVerification] = useState(false);

    const [promptUsernameInput, setPromptUsernameInput] = useState("")
    const [promptEmailInput, setPromptEmailInput] = useState("")
    const [promptPasswordInput, setPromptPasswordInput] = useState("")
    const [promptVerificationInput, setPromptVerificationInput] = useState("")

    let userDetailsArray = [];


    const { data: userByID, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: props.currentuser._id }
    });


    // [[[USER DETAILS]]]
    const EditableFields = [
        {
            title: 'Username',
            detail: props.currentuser.username,
            edit: showEditableFieldUsername,
            setedit: setShowEditableFieldUsername,
            prompt: promptUsernameInput,
            setprompt: setPromptUsernameInput
        },
        {
            title: 'Email',
            detail: props.currentuser.email,
            edit: showEditableFieldEmail,
            setedit: setShowEditableFieldEmail,
            prompt: promptEmailInput,
            setprompt: setPromptEmailInput
        },
        {
            title: 'Password',
            detail: '* * * * *',
            edit: showEditableFieldPassword,
            setedit: setShowEditableFieldPassword,
            prompt: promptPasswordInput,
            setprompt: setPromptPasswordInput
        }
    ]




    // [[[UPDATE USER BASED ON USER DETAIL SELECTED]]]
    const handleFormSubmit = async () => {
        if (showEditableFieldUsername) {
            try {
                await updateUser({
                    variables: {
                        profilepicture: props.currentuser.profilepicture,
                        verified: props.currentuser.verified,
                        username: promptUsernameInput,
                        email: props.currentuser.email,
                        rating: props.currentuser.rating,
                    }
                });
                refetch();
            }
            catch (e) { console.error(e); }
        } else if (showEditableFieldEmail) {
            try {
                await updateUser({
                    variables: {
                        profilepicture: props.currentuser.profilepicture,
                        verified: props.currentuser.verified,
                        username: props.currentuser.username,
                        email: promptEmailInput,
                        rating: props.currentuser.rating,
                    }
                });
                refetch();
            }
            catch (e) { console.error(e); }
        } else if (showEditableFieldPassword) {
            try {
                await updateUserPassword({
                    variables: {
                        password: promptPasswordInput
                    }
                });
                refetch();
            }
            catch (e) { console.error(e); }
        }
    }

    // [[[PRODUCT USER DETAIL SECTIONS]]]
    for (let i = 0; i < EditableFields.length; i++) {
        userDetailsArray[i] =
            <View style={{}} key={i}>
                <TouchableOpacity
                    onPress={() => {
                        setShowEditableFieldUsername(false);
                        setShowEditableFieldEmail(false);
                        setShowEditableFieldPassword(false);
                        setShowEditableFieldVerification(false);
                        EditableFields[i].setedit(current => !current);
                        setPromptUsernameInput("");
                        setPromptEmailInput("");
                        setPromptPasswordInput("");
                        setPromptVerificationInput("");
                    }}
                >
                    <View
                        style={{
                            border: 'solid',
                            borderColor: 'white',
                            borderTopWidth: 1,
                            borderLeftWidth: 1,
                            borderBottomWidth: 1,
                            // borderTopLeftRadius: 30,
                            borderBottomLeftRadius: 25,
                            padding: 10,
                            width: windowWidth - 40,
                            flexDirection: 'column',
                            margin: 10,
                            backgroundColor: `${EditableFields[i].edit ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}`,
                            // borderTopRightRadius: 10,
                            borderTopLeftRadius: 10
                        }}

                    >
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={{ color: 'white', marginRight: 10, fontSize: windowWidth*0.06, fontWeight: 'bold', alignSelf: 'center' }}>{EditableFields[i].title}</Text>

                            <Text
                                style={{ color: 'white', alignSelf: 'center', fontSize: windowWidth*0.03, width: windowWidth/2.3  }}
                                numberOfLines={1}
                                ellipsizeMode='tail'
                            >
                                {EditableFields[i].detail}
                            </Text>

                            {EditableFields[i].edit ?
                                null
                                :
                                <View
                                    style={{
                                        position: 'absolute',
                                        zIndex: 10,
                                        alignSelf: 'center',
                                        left: windowWidth - 115,
                                        padding: 4,
                                        borderRadius: 4,
                                        flexDirection: 'row'
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faSolid, faPenToSquare}
                                        style={{ color: 'white', justifyContent: 'flex-end', marginRight: 10 }}
                                    />
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                        EDIT
                                    </Text>
                                </View>
                            }
                        </View>
                        {EditableFields[i].edit ?
                            <>
                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    {/* [[[IF USER DETAIL/PASSWORD ELSE]]] */}
                                    {promptPasswordInput ?
                                        <TextInput
                                            type="password"
                                            name={EditableFields[i].title}
                                            placeholder={EditableFields[i].title}
                                            value={EditableFields[i].prompt}
                                            onChangeText={EditableFields[i].setprompt}
                                            secureTextEntry={true}
                                            style={{
                                                outline: 'none',
                                                backgroundColor: '#e9ecef',
                                                color: '#001219',
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                padding: 10,
                                                border: 'solid',
                                                borderColor: 'white',
                                                borderTopLeftRadius: 10,
                                                borderBottomLeftRadius: 10,
                                                alignSelf: 'center',
                                                marginTop: 10,
                                                marginBottom: 10,
                                                width: windowWidth - 120
                                            }}
                                        />
                                        :
                                        <>
                                            <TextInput
                                                type="text"
                                                name={EditableFields[i].title}
                                                placeholder={EditableFields[i].title}
                                                value={EditableFields[i].prompt}
                                                onChangeText={EditableFields[i].setprompt}
                                                style={{
                                                    outline: 'none',
                                                    backgroundColor: '#e9ecef',
                                                    color: '#001219',
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    padding: 10,
                                                    border: 'solid',
                                                    borderColor: 'white',
                                                    borderTopLeftRadius: 10,
                                                    borderBottomLeftRadius: 10,
                                                    alignSelf: 'center',
                                                    marginTop: 10,
                                                    marginBottom: 10,
                                                    width: windowWidth - 120
                                                }}
                                            />
                                        </>
                                    }
                                    {i != 4 &&
                                        <TouchableOpacity
                                            onPress={() => {
                                                handleFormSubmit();
                                                setShowEditableFieldUsername(false);
                                                setShowEditableFieldEmail(false);
                                                setShowEditableFieldPassword(false);
                                                setShowEditableFieldVerification(false);
                                            }}
                                        >
                                            <View
                                                style={{
                                                    backgroundColor: '#4cc9f0',
                                                    padding: 10,
                                                    borderTopRightRadius: 10,
                                                    borderBottomRightRadius: 10,
                                                    marginTop: 10,
                                                    marginBottom: 10,
                                                    flex: 1, alignItems: 'center', justifyContent: 'center'
                                                }}
                                            >
                                                <Text style={{ color: 'white', alignSelf: 'center', }}>Submit</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </>
                            :
                            null
                        }
                        {!userByID?.user.verified &&
                            <>
                                {showEditableFieldVerification && i == 4 &&
                                    <View>
                                        <DemoAppInvoiceAndQuote currentuser={userByID?.user} />
                                    </View>
                                }
                            </>
                        }
                    </View>
                </TouchableOpacity>

            </View>
    }
    return (userDetailsArray);

}