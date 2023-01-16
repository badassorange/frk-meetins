import { useStore } from "effector-react";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/Loader/Loader";
import { getDateInDMFormat } from "../../../global/functions/getDateInDMFormat";
import { getMinutesAndHoursFromString } from "../../../global/functions/getMinutesAndHoursFromString";
import { isTypeOfFileAreImage, isTypeOfFileAreVideo } from "../../../global/helpers/validate";
import { IMyDialog } from "../../../global/interfaces";
import { 
    activeChat, 
    createdSendMessageAndUploadActiveChat,
    getDialogMessages,
    isMessageWithFileLoaded,
    setActiveChat,
    updatedIsReadMessagesInActiveDialog
} from "../../../global/store/chat_model";
import { $onlineUsers, $user, baseURL } from "../../../global/store/store";
import ChatMessageForm from "../chatMessageForm/chatMessageForm";
import s from "./chatZone.module.scss";

export default function ChatZone(): JSX.Element {

    const authedUser = useStore($user);
    const activeChat$ = useStore(activeChat);
    const isMessageWithFileLoaded$ = useStore(isMessageWithFileLoaded);
    const onlineUsers = useStore($onlineUsers);
    const isUserOnline = onlineUsers.filter(el => el.userId !== activeChat$.userId).length > 0;
    const ref = useRef(null);
    const messagesEndRef = useRef<HTMLSpanElement>(null);
    const { t } = useTranslation();

    const sendForm = (inputValue: string) => {
        if(inputValue.length > 0) {
            createdSendMessageAndUploadActiveChat(inputValue);
        }
    }

    useEffect(() => {
        updatedIsReadMessagesInActiveDialog(activeChat$.dialogId);
        getDialogMessages(activeChat$);
        if (ref.current && window.screen.height <= 670) {
            ref.current.scrollIntoView({behavior: "smooth"});
        }
        return () => { 
            setActiveChat({} as IMyDialog);
        }
    }, [activeChat$.dialogId])
        return(
            <div className={s.chat} ref={ref}>  
                <div className={`${s.user} ${s.block}`}>
                    <div className={s.avatar} style={{
                        backgroundImage: `url('${baseURL + activeChat$.userAvatar}')`}}>
                    </div>
                    <div className={s.name}>
                        {activeChat$.userName}
                    </div>
                    <div className={!isUserOnline ? s.statusOnline : s.status}>
                        {!isUserOnline ? t('В сети') : t('Не в сети')}
                    </div>
                </div>
                <div className={s.messages}>
                    {activeChat$.messages
                        ? activeChat$.messages.map(message => {
                            const isMyMessage = message.senderId === authedUser?.userId;
                            return (
                                <div key={message.sendAt} className={isMyMessage ? s.myMessageBlock : s.notMyMessageBlock}>
                                    <div className={s.messageDate}>{getDateInDMFormat(message.sendAt)}</div>
                                        <div 
                                            className={isMyMessage ? s.myMessage : s.notMyMessage}
                                            key={message.content}
                                        >
                                        {
                                            message.isFile && isTypeOfFileAreImage(message.content) 
                                            && 
                                            <div className={s.messageWithFile}>
                                                <img 
                                                    src={baseURL + message.content} 
                                                    width="100px" 
                                                    height="100px"
                                                />
                                                <a href={baseURL + message.content} target="_blank">{t('Открыть полностью')}</a>
                                            </div>
                                        }
                                        {
                                            message.isFile && isTypeOfFileAreVideo(message.content)
                                            && 
                                            <div className={s.messageWithVideo}>
                                                <a href={baseURL + message.content} target="_blank">{t('Видео')} - {message.content}</a>
                                            </div>
                                        }
                                        {
                                            message.isFile && !isTypeOfFileAreImage(message.content) && !isTypeOfFileAreVideo(message.content)
                                            && <a href={`${baseURL + message.content}`}>{message.content}</a>
                                        }
                                        {
                                            !message.isFile && message.content
                                        }
                                        <div className={s.messageTime}>
                                            {getMinutesAndHoursFromString(message.sendAt)}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        : <Loader/>
                    }
                    <span ref={messagesEndRef}></span>
                </div>
                <div className={`${s.form} ${s.block}`}>
                    <ChatMessageForm 
                        isLoaded={isMessageWithFileLoaded$} 
                        placeholder="Введите сообщение" 
                        onClickForm={(inputValue) => sendForm(inputValue)}
                    />
                </div>
            </div>
        )
}