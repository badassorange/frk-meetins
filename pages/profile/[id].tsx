import Router, { useRouter } from "next/router";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { $currentProfileUser, $user, getDataForProfilePage, isAsyncLoaded, setCurrentProfileUser, setUser } from "../../global/store/store";
import { useStore } from "effector-react";
import { updateUserAvatar, updateUserStatus } from "../../global/store/settings_model";
import { checkDialog, } from "../../global/store/chat_model";
import { sendInviteToUser } from "../../global/store/events_model";
import { User } from "../../global/interfaces";
import ProfileView from "./ProfileView/profileView";
import PageContainer from "../../components/PageContainer/pageContainer";

function Profile(): JSX.Element {

    const route = useRouter();
    const asyncLoaded = useStore(isAsyncLoaded);
    const currentUser = useStore($currentProfileUser);
    const authedUser = useStore($user);

    const [addingImageStatus, setAddingImageStatus] = useState<boolean>(false);
    const [isModal, setIsModal] = useState<boolean>(false);
    const [isAddPostModal, setIsAddPostModal] = useState<boolean>(false);
    const [isInviteModal, setIsInviteModal] = useState<boolean>(false);
    const [choosedEventForInvite, setChoosedEventForInvite] = useState<number>();

    const changeAddingImageStatus = (status: boolean) => {
        if(currentUser.login === authedUser?.login) {
            setAddingImageStatus(() => status);
        }
    }

    const onChangeInputImage = (event: ChangeEvent<HTMLInputElement>) => {
        updateUserAvatar(event).then((res: { data: User }) => {
            setCurrentProfileUser(res.data)
            setUser(res.data);
        })
        setIsModal(true);
    }

    const handleSaveNewStatus = useCallback((userStatus: string) => {
        updateUserStatus(userStatus).then( (user: User) => {
            setUser(user);
            setCurrentProfileUser(user);
        });
    }, [])

    const handleStartDialog = () => {
        checkDialog(currentUser);
        Router.push('/messanger')
    } 
    const onImageModalClick = (status: boolean) => {
        if (status) {
            window.location.reload();
        }
        setIsModal(false);
    }

    const onAddingModalClick = () => {
        setIsAddPostModal(false);
    }

    const handleSendInvite = () => {
        sendInviteToUser({ userToId: currentUser.userId, eventId: choosedEventForInvite });
        setIsInviteModal(false);
    }

    useEffect( () => {
        getDataForProfilePage(route);
    }, [route])

    return(
        <PageContainer>
            <ProfileView
                asyncLoaded={asyncLoaded}
                addingImageStatus={addingImageStatus}
                currentUser={currentUser}
                authedUser={authedUser}
                isAddPostModal={isAddPostModal}
                isImageModal={isModal}
                isInviteModal={isInviteModal}
                handleSendInvite={handleSendInvite}
                setChoosedEventForInvite={setChoosedEventForInvite}
                setIsAddPostModal={setIsAddPostModal}
                setIsInviteModal={setIsInviteModal}
                handleStartDialog={handleStartDialog}
                onChangeInputImage={onChangeInputImage}
                handleSaveNewStatus={handleSaveNewStatus}
                changeAddingImageStatus={changeAddingImageStatus}
                onAddingModalClick={onAddingModalClick}
                onImageModalClick={onImageModalClick}
            />
        </PageContainer>
    )
}

export default Profile;