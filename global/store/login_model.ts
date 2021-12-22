import { instance, setUser, User } from './store'
import { createEffect, createEvent, createStore } from 'effector'


type LoginDetailsType = {
	emailOrPhone: string,
	password: string 
} | null 

export const sendLogData = createEffect()

export const setLoginDetails = createEvent<LoginDetailsType>()
export const $loginDetails = createStore<LoginDetailsType>(null).on(
	setLoginDetails,
	(_, newLogDetails) => {
		return newLogDetails
	}  
)

sendLogData.use(async (logDetails) => {
	const response = await instance.post('user/login', JSON.stringify(logDetails))
	if(response.status === 200) {
		localStorage.setItem('isLogged', 'true');
		localStorage.setItem("access-token", response.data.authenticateResponse.accessToken);
		localStorage.setItem("refrash-token", response.data.authenticateResponse.refreshToken);
		localStorage.setItem("user", response.data.profile);
		const userObj: User = {
			firstName: response.data.profile.firstName,
			lastName: response.data.profile.lastName,
			phoneNumber: response.data.profile.phoneNumber,
			email: response.data.profile.email,
			gender: response.data.profile.gender,
			userIcon: response.data.profile.userIcon,
			dateRegister: response.data.profile.dateRegister,
		}
		console.log(userObj.userIcon);
		
		setUser(userObj);
	} else {
		localStorage.setItem('isLogged', 'false');
	}
	return response;
})