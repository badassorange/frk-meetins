import { createEffect, createEvent, createStore } from "effector";
import { IPeople, Params } from "../interfaces";
import { instance } from "./store";

export const setAllPeoples = createEvent<IPeople[]>();
export const fullUpdatePeoples = createEvent<[]>();
export const allPeoples = createStore<IPeople[]>([]).on(setAllPeoples, (currentPeoples, peoples) => {
    return [...currentPeoples, ...peoples];
});
allPeoples.on(fullUpdatePeoples, (_, fullUpdatePeoples) => {
    return fullUpdatePeoples;
});

export const setMaxPageOfPeople = createEvent<number>();
export const maxPageOfPeople = createStore<number>(0).on(setMaxPageOfPeople, (_, maxPageOfPeople) => {
    return maxPageOfPeople;
});

export const setIsPeoplesLoaded = createEvent<boolean>();
export const isPeoplesLoaded = createStore<boolean>(false).on(setIsPeoplesLoaded, (_, peoplesLoaded) => {
    return peoplesLoaded;
});
export const setFilterParams = createEvent();
export const filterParams = createStore<Params | any>({gender: "all", age: 0});

export const getAllPeoplesByPageNumber = createEffect(async (data: { pageNumber: number, pageSize: number, filters: any }) => {
    setIsPeoplesLoaded(false);
    const response = await instance.post('/users/getUserListByPageNumber', {
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
        filters: data.filters
    });
    if(response.status === 201) {
        setAllPeoples(response.data.peoples);
        setMaxPageOfPeople(response.data.maxPage)
        return response.data;
    }
});

export const getAllPeoples = createEffect(async () => {
    const response = await instance.get('/users/getUserList');
    if(response.status === 200) {
        setAllPeoples(response.data);
        return response.data;
    }
});
getAllPeoples.doneData.watch((peoples: IPeople[]) => {
    setIsPeoplesLoaded(true);
})
getAllPeoplesByPageNumber.doneData.watch(() => {
    setIsPeoplesLoaded(true);
})