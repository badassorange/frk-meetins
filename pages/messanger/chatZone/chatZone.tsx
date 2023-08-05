import { useStore } from "effector-react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDateInDMFormat } from "../../../global/functions/getDateInDMFormat";
import { getMinutesAndHoursFromString } from "../../../global/functions/getMinutesAndHoursFromString";
import { isTypeOfFileAreImage, isTypeOfFileAreVideo } from "../../../global/helpers/validate";
import { IMyDialog } from "../../../global/interfaces";
import { 
    activeChat, 
    createdSendMessageAndUploadActiveChat,
    getDialogMessages,
    isMessageWithFileLoaded,
    setActiveChat
} from "../../../global/store/chat_model";
import { $onlineUsers, $user, baseURL } from "../../../global/store/store";
import ChatMessageForm from "../chatMessageForm/chatMessageForm";
import s from "./chatZone.module.scss";
import Loader from "../../../components-ui/Loader/Loader";
import { defaultDialog } from "../../../global/mock/defaultDialog";
import { AiOutlinePhone } from "react-icons/ai";
import { MdOutlineOndemandVideo } from "react-icons/md";

interface IChatZoneProps {
    activeChat$: IMyDialog
}
export default function ChatZone({ activeChat$ }: IChatZoneProps): JSX.Element {
    
    const authedUser = useStore($user);
    const isMessageWithFileLoaded$ = useStore(isMessageWithFileLoaded);
    const onlineUsers = useStore($onlineUsers);
    const isUserOnline = onlineUsers.filter(el => el.userId !== activeChat$.userId).length > 0;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [moreActionForUserModal, setMoreActionUserForModal] = useState<boolean>(false);
    const { t } = useTranslation();

    const sendForm = (inputValue: string) => {
        if(inputValue.length > 0) {
            createdSendMessageAndUploadActiveChat(inputValue);
        }
    };
    const handleClickProfile = () => {
        //router.push(`/profile/${e.activeChat$.user}`)
    };

    useEffect(() => {
        return () => { 
            setActiveChat(defaultDialog);
        }
    }, []);

    if (activeChat$) {
        return(
            <div className={s.chat}>  
                <div className={`${s.user} ${s.block}`}>
                    <div className={s.avatar} style={{
                        backgroundImage: `url('${baseURL + activeChat$.userAvatar}')`}}>
                    </div>
                    <div className={s.userTextInfo}>
                        <div className={s.name}>
                            {activeChat$.userName}
                            <MdOutlineOndemandVideo 
                                fontSize={26}
                                style={{cursor: "pointer"}}
                            />
                        </div>
                        <div className={!isUserOnline ? s.statusOnline : s.status}>
                            {!isUserOnline ? t('В сети') : t('Не в сети')}
                        </div>
                        <div className={s.userMoreActions} onClick={() => setMoreActionUserForModal(!moreActionForUserModal)}>
                            <div className={s.userMoreActionsLine}></div>
                            <div className={s.userMoreActionsLine}></div>
                            <div className={s.userMoreActionsLine}></div>
                            {
                                moreActionForUserModal && 
                                <div className={s.userActionsList}>
                                    <div 
                                        className={s.userActionsListElement}
                                        onClick={handleClickProfile}
                                    >Профиль</div>
                                    <div className={s.userActionsListElement}>Очистить чат</div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className={`${s.messages} ${s.block}`}>
                    {activeChat$.messages
                        ? activeChat$.messages.map((message, index) => {
                            const isMyMessage = message.senderId === authedUser?.userId;
                            const isDateAlreadyExist = 
                                getDateInDMFormat(message.sendAt) !== getDateInDMFormat(activeChat$.messages[index - 1]?.sendAt);
                            return (
                                <div className={s.messageWrapper} key={message.messageId}>
                                    <div className={s.messageDateWrapper}>
                                        { isDateAlreadyExist && 
                                            <div className={s.messageDate}>{getDateInDMFormat(message.sendAt)}</div> 
                                        }
                                    </div>
                                    <div className={isMyMessage ? s.myMessageBlock : s.notMyMessageBlock}>
                                            <div 
                                                className={isMyMessage ? s.myMessage : s.notMyMessage}
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
                                                message.isFile && 
                                                !isTypeOfFileAreImage(message.content) && 
                                                !isTypeOfFileAreVideo(message.content) &&
                                                !message.content.includes('.blob') &&
                                                <a href={`${baseURL + message.content}`}>{message.content}</a>
                                            }
                                            {
                                                message.isFile &&
                                                message.content.includes('.blob') &&
                                                <video controls src={baseURL + message.content}></video>
                                            }
                                            {
                                                !message.isFile && message.content
                                            }
                                            <div className={s.messageTime}>
                                                { getMinutesAndHoursFromString(message.sendAt) }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        : <Loader/>
                    }
                    <div ref={messagesEndRef}>.</div>
                </div>
                <div className={`${s.form} ${s.block}`}>
                    <ChatMessageForm 
                        isLoaded={isMessageWithFileLoaded$} 
                        placeholder="Введите сообщение" 
                        onClickForm={(inputValue) => sendForm(inputValue)}
                        isChatExists={!activeChat$.userId}
                    />
                </div>
            </div>
        )
    } else {
        return null;
    }
}