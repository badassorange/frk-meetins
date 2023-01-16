import { useStore } from "effector-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getMyDialogs, isMyDialogsLoaded, myDialogs } from "../../../global/store/chat_model";
import { $user } from "../../../global/store/store";
import UserChatCard from "../userChatCard/userChatCard";
import s from "./chatList.module.scss";
 
export default function ChatList(): JSX.Element {

    const myDialogs$ = useStore(myDialogs);
    const isLoaded$ = useStore(isMyDialogsLoaded);
    const authedUser$ = useStore($user);
    const { t } = useTranslation();
    
    useEffect(() => {
        getMyDialogs(); 
    },[]) 
    return(  
        <div className={s.chatList}>
            <div className={s.menu}>
                <button>{t('Все')}</button>
                <button>{t('Онлайн')}</button>
                <button>{t('Важные')}</button>
                <button>{t('Поиск')}</button>
            </div>
            <div className={s.list}>
                {isLoaded$ !== false && myDialogs$ !== null ? myDialogs$.map( dialog => 
                <UserChatCard
                    key={dialog.userAvatar}
                    dialog={dialog}
                    authedUser={authedUser$}
                />) : <div className={s.loader}></div>}
            </div>
        </div>
    )
}