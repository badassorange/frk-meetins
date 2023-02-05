import { useStore } from "effector-react";
import React from "react";
import PageContainer from "../../components/pageContainer/pageContainer";
import { IMyDialog } from "../../global/interfaces";
import { activeChat, setActiveChat } from "../../global/store/chat_model";
import { isMobile } from "../../global/store/store";
import ChatList from "./chatList/chatList";
import ChatZone from "./chatZone/chatZone";
import s from "./messanger.module.scss";
import MobileChatList from "./mobileChatList/mobileChatList";

export default function Messanger(): JSX.Element {
    
    const activeChat$ = useStore(activeChat);
    const isMobile$ = useStore(isMobile);

    const handleBack = () => {
        setActiveChat({} as IMyDialog);
    }
    return(
        <PageContainer> 
           { !isMobile$ 
            ? 
            <div className={s.messangerContent}>
                <div className={`${s.chatList} ${s.block}`}>
                    <ChatList/>
                </div>
                <div className={`${s.chatZone} ${s.block}`}>
                    {activeChat$.dialogId ? <ChatZone/> : 
                    <div className={s.noChat}>
                        <h3 className={s.alert}>Выберите диалог...</h3>
                    </div>
                    }
                </div>
            </div>
            :
            <div className={s.mobileMessangerContent}>
                {
                    !activeChat$.dialogId 
                    ? <MobileChatList /> 
                    : 
                    <div className={`${s.mobileChatZone}`}>
                        <div className={s.mobileChatZoneBack} onClick={handleBack}>{`< Назад`}</div>
                        <div className={s.mobileChatZoneContent}>
                            <ChatZone />
                        </div>
                    </div>
                }
            </div>
            }
        </PageContainer>
    )
}