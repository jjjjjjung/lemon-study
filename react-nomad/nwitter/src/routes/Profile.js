import { authService, dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { collection, getDocs, query, where } from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";

export default ({refreshUser, userObj}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName ?? "USER");
    const onLogOutClick = () => {
        authService.signOut();
        history.push('/')
    }
    const getMyNweets = async () => {
        const q = query(
            collection(dbService, "nweets"),
            where("creatorId", "==", userObj.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    };
    const onchange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        // if(userObj.displayName !== newDisplayName){
        //     await userObj.updateProfile({
        //         displayName: newDisplayName,
        //     })
        // }
        if(userObj.displayName !== newDisplayName){
            await updateProfile(authService.currentUser, { displayName: newDisplayName });
            refreshUser();
        }
    }
    useEffect(() => {
        getMyNweets();
    }, [])
    return (
        <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Display name" onChange={onchange} value={newDisplayName}/>
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>로그아웃</button>
        </>
    );
};