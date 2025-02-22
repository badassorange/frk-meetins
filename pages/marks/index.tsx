import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";
import { $markedUsersInfo, $user, getMarkedUsersInfo } from "../../global/store/store";
import PageContainer from "../../global/components/PageContainer/pageContainer";
import MarkedEvents from "./components/MarkedEvents/markedEvents";
import MarkedUsers from "./components/MarkedUsers/markedUsers";
import s from "./marks.module.scss";
import { getUserEventsInfo, userEvents } from "../../global/store/events_model";

export default function Marks(): JSX.Element {

    const [currentMark, setCurrentMark] = useState<string>('events');
    const user$ = useStore($user);
    const markedUsersInfo$ = useStore($markedUsersInfo);
    const markedEventsInfo$ = useStore(userEvents);

    useEffect(() => {
        getMarkedUsersInfo();
        getUserEventsInfo();
    }, [user$]);

    return(
        <PageContainer>
            <div className={s.content}>
            <div className={s.types}>
                <button 
                    className={currentMark === 'peoples' ? s.active : s.inactive} 
                    onClick={() => setCurrentMark('peoples')}>Люди
                </button>
                <button
                    className={currentMark === 'events' ? s.active : s.inactive} 
                    onClick={() => setCurrentMark('events')}>События
                </button>
            </div>
            <div className={s.result}>
                { currentMark === 'events' && <MarkedEvents markedEvents={markedEventsInfo$} /> }
                { currentMark === 'peoples' && <MarkedUsers markedUsers={markedUsersInfo$} /> }
            </div>
            </div>
        </PageContainer>
    )
}