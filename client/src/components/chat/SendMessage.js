import React, { useEffect, useRef, useState } from 'react'
import {IconButton, Input } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import {storage,DataBase} from '../firebase';
import firebase from 'firebase/app'
import 'emoji-mart/css/emoji-mart.css';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import {useStateValue} from '../../contexts/StateProvider';
import {InsertEmoticon, MicOutlined} from '@material-ui/icons';
import {realtime} from '../firebase';
import './SendMessage.css'
import EmojiSelect from './EmojiSelect';


function SendMessage({chatId}) {
    //get the user from the provider  
    const [{user}, dispatch] = useStateValue();
    //set the input 
    const [input, setCaption] = useState('');
    //show/hide emoji picker menu
    const [emoMenuVisible,setEmoMenuVisible] = useState(false)
    //ref to input to focus on the input element after selecting the emoji 
    const inputRef = useRef();
    //current element of inputRef
    const inputRefCurrent = inputRef.current
    //image 
    const [image,setImage] = useState(null);
    //progress bar
    const [progress,setProgress] = useState(0); 
    //open the modal 
    const [openProgress,setOpenProgress] = useState(false)
    //open alert box when a new post is created
    const [openAlert,setOpenAlert] = useState(false)

    //get the name of the first image file you selected (image as a file)
    const handleChange = (e) =>{
        if (e.target.files[0]){
            setImage(e.target.files[0])
            var image2 = `${e.target.files[0]}`;
            setCaption(image2);
        }
    }

    //empty input and focus on the input everytime a new chatId is opened
    useEffect(() => {
        setCaption('')
        inputRef.current.focus();
    }
    ,[chatId])
    

//========================================================POST Messages========================================
const sendMessage = () => {
    if (user){
                   //add message to user1's database (sender)
                   realtime
                   .ref(`/'messages'/${user.uid}/${chatId}`)
                   //push create a unique id for each new doc 
                   .push({
                       text:input,
                       timestamp:firebase.database.ServerValue.TIMESTAMP,
                       author:user.uid,
                       authorName:user.displayName,
                       imageUrl:"",},
                       (error) => {
                       if (error) {
                       alert(error.message)
                       } else {
                       //successful!!
                       }         
                   })
                   //add message to user2's database (sendee)
                   //add to realtime db 
                       realtime
                       .ref(`/'messages'/${chatId}/${user.uid}`)
                       //push create a unique id for each new doc 
                       .push({     
                               text:input,
                               timestamp:firebase.database.ServerValue.TIMESTAMP,
                               author:user.uid,
                               authorName:user.displayName,
                               imageUrl:"",
                           },
                           (error) => {
                           if (error) {
                           alert(error.message)
                           } else {
                           //successful!!
                           }
                       
                       })
                    //post the time at which we sent a text to that user/received a text from that user lately
                    realtime.ref(`/'chats'/${user.uid}/${chatId}`).update(
                        {
                            lastchatAt:firebase.database.ServerValue.TIMESTAMP
                        }
                    )
                    realtime.ref(`/'chats'/${chatId}/${user.uid}`).update(
                        {
                            lastchatAt:firebase.database.ServerValue.TIMESTAMP
                        }
                    )
                    

                    setCaption('');
    }
    if(image){
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        
        //listen to changes in the state of the upload
        uploadTask.on(
            "state_changed",
            //keep track of the progress and give a snapshot each time
            (snapshot) =>{

                //a number between 0 to 100 is stored in progress_ to keep track of the progress
                const progress_ = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                );
                setOpenProgress(true)
                setProgress(progress_)
            },
            //catch the error
            (error) => {
                //because the error is not user friendly just log it to the console
                console.log(error)
                //show the error message
                alert(error.message)
            }, 

//===================={get the uploaded image from the firebase database}========================

            () => {
                storage
                //access the 'images' folder in the storage
                .ref('images')
                //get the name of the image file
                .child(image.name)
                //get the url to download the image
                .getDownloadURL()
                //add the image to the 'posts' folder of the database
                .then((url)=>{
                    DataBase.collection('posts').add({
                        //set the attribute to the time stamp of the server which serves the file
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        //set the cation attribute to the cation user entered   
                            caption:input,
                        //set image url attribute to the 'url' we got from the getDownloadURL() method
                            imageUrl:url,
                        //get the username as a prop from the 'App.js' file
                            username:user,
                        //post the id of the user from 'user' object  
                            user_id:user.uid,
                        //initially set likesCount to 0 
                            likesCount:0
                        })
                        //once done set clear the input c
                        setProgress(0);
                        setOpenProgress(false)
                        setCaption("");
                        setImage(null)
                        

                })
                setOpenAlert(true)
            }

        )
    }
    
}

//=============================================================================================================
    return (
    <div className="sendMessage">
                                                                {/*emoji select menu*/}
                                            {/*make the menu visible only when user clicks on emoji icon*/}
                                            {/*send the reference of the input component to <EmojiSelect/> to .focus() after emoji is selected*/}

                {emoMenuVisible?
                    (<EmojiSelect inputRefCurrent={inputRefCurrent} addEmojiToInput={(emoji)=>{setCaption(input+emoji)}}  EmojiMenuVisibility={(visibility)=>{setEmoMenuVisible(visibility)}} />):(<></>)
                }
            <form className="chat__inputForm" onSubmit={(e)=>{e.preventDefault()}}>
                                                            {/*image input*/}
                <input className="imageUpload__fileInput" accept="image/*" id="image-button-file" type="file" placeholder="Choose a file" onChange={handleChange} />
                <label htmlFor="image-button-file">
                    <IconButton color="primary" aria-label="upload picture" component="span">
                    <AddPhotoAlternateIcon/>
                    </IconButton>
                </label>
                                                            {/*selected image preview*/}
                {image&&(<img className="imageUpload__preview" width="20px" height="20px" src={URL.createObjectURL(image)}/>)}
                                                             {/*image caption*/}
     
                <InsertEmoticon className="sendMessage__emojiIcon" onClick={()=>{setEmoMenuVisible(!emoMenuVisible)}} style={{cursor: 'pointer'}}/>
                <Input accept="image/*" inputRef={inputRef} style={{color:"aliceblue"}} className="sendMessage__input" value={input} onChange={(e)=>setCaption(e.target.value)} type="text" placeholder="   Send a texx..."/>
                <IconButton  variant ='contained' color="primary"disabled={!input} onClick={sendMessage} type="submit"><SendIcon /></IconButton>
                {/* <MicOutlined/> */}
            </form>
    </div>
    )
}

export default SendMessage
