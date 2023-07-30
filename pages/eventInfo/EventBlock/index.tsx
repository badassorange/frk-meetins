import { useTranslation } from "react-i18next";
import { IEventComments, IEventInfoCard } from "../../../global/interfaces/events";
import s from "./eventBlock.module.scss";
import EventMoreInfo from "../EventMoreInfo";
import CustomSlider from "../../../components-ui/CustomSlider/CustomSlider";
import Loader from "../../../components-ui/Loader/Loader";
import Image from "next/image";
import { baseURL } from "../../../global/store/store";


export default function EventBlock(props: {
    currentEventById: IEventInfoCard,
    addUserEvent: (id: number) => void,
    commentsEvent: IEventComments[]
}): JSX.Element {
    const event = props.currentEventById;
    const { t } = useTranslation();
    
	if (event) {
        return(
            <div className={s.eventBlockContent}>
                <div className={s.eventBlockTitle}>{t('Информация про')} {event.title}</div>
                <div className={s.eventBlockMainInfo}>
                    <div className={s.eventInfo}>
                        <CustomSlider 
                            images={props.currentEventById.images}
                            width="300px"
                            height="300px"
                        />
                    </div>
                    <div className={s.help}>
                        <div>{event.title}, {event.age_restriction}+</div>
                        <div dangerouslySetInnerHTML={{ __html: event.description }} />
                        <EventMoreInfo 
                            price={event.price}
                            tags={event.tags}
                            siteUrl={event.site_url}
                            favoritesCount={event.favorites_count}
                        />
                        <div className={s.actions}>
                            <button onClick={() => props.addUserEvent(event.id)}>{t('Я пойду')}!</button>
                            <button>{t('Понравилось')}!</button>
                        </div>
                    </div>
                </div>
                <div className={s.commentsWrapper}>
                    { props.commentsEvent.length === 0 ? 'Комментариев пока нет' : 'Комментарии'}
                    {
                        props.commentsEvent.map(comment => (
                            <div className={s.wrapper}>
                                <div className={s.userInfo}>
                                    {
                                        comment.user.avatar.length !== 0
                                        ? <Image
                                            className={s.avatar}
                                            src={comment.user.avatar}
                                            width={50}
                                            height={50}
                                        />
                                        : <Image
                                            className={s.avatar}
                                            src={baseURL + 'no-avatar.jpg'}
                                            width={50}
                                            height={50}
                                        />
                                    }
                                </div>
                                <div className={s.commentInfo}>
                                    <div className={s.name}>
                                        {comment.user.name}
                                    </div>
                                    <div className={s.text}>
                                            {comment.text}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
    return <Loader />;
};
