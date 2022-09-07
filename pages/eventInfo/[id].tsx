import { useStore } from "effector-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import PageContainer from "../../components/pageContainer/pageContainer";
import { currentEventById, getEventById, setCurrentEventById } from "../../global/store/events_model";
import EventBlock from "./EventBlock";


export default function EventInfo(): JSX.Element {

    const currentEventById$ = useStore(currentEventById);
    const { query } = useRouter();

    useEffect(() => {
        if (query.id) {
            getEventById(String(query.id));
        }
    }, [query])
    useEffect(() => {
        return () => {
            setCurrentEventById(null);
        }
    }, [])
	return(
        <PageContainer>
            {currentEventById$ ? <EventBlock currentEventById={currentEventById$} /> : <Loader />}
        </PageContainer>
    )
};

