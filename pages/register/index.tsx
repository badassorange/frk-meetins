import Image from 'next/image'
import { useForm } from 'react-hook-form'
import loginIcon from '../../public/images/login.svg'
import passIcon from '../../public/images/pass.svg'
import phoneIcon from '../../public/images/phone.svg'
import femaleIcon from '../../public/images/female.svg'
import maleIcon from '../../public/images/male.svg'
import s from '../../styles/pageStyles/auth.module.scss'
import { useState } from 'react'
import EyeIcon from '../../global/helpers/Icons/EyeIcon'
import logo from '../../public/images/logo.svg';

import {
	isEmail,
	validateEmailOrPhone,
} from '../../global/helpers/validate'
import {
	sendRegData,
	setEmailForConfirmation,
	setRegisterDetails,
} from '../../global/store/register_model'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import Input from '../../components-ui/Input/Input'
import Link from 'next/link'

export default function Login(): JSX.Element {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const [gender, setGender] = useState<string>('')
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const router = useRouter();
	const { t } = useTranslation();

	const sendLoginData = (data: {
		name: string
		email: string | null
		pass: string
		gender: string
		city: string
	} | any) => {
		const email = isEmail(data.email);
		const nameArr = data.name.split(' ')
		
		setRegisterDetails({
			name: nameArr[0],
			email: email,
			password: data.pass,
			gender: data.gender,
			city: data.city
		})
		router.push(`/confirmation`);
		sendRegData({
			name: nameArr[0],
			email: email,
			password: data.pass,
			gender: data.gender,
			city: data.city
		}).then( (res: any) => {
			if(res.data?.statusCode <= 217) {
				setEmailForConfirmation(email);
			}
		})
	}

	return (
		<div className={s.cardWrapper}>
			<div className={s.card}>
				<Head>
					<title>Meetins-{t('Регистрация')}</title>
					<meta name="description" content="Meetins - регистрация" key="desc" />
					<meta property="og:title" content="Зарегестрируйтесь в Meetins и начните знакомится!" />
					<meta
						property="og:description"
						content="Регистрируйтесь и общайтесь!"
					/>
				</Head>
				<h1 style={{ display:"grid" }}>
					<Image
						src={logo}
					/>
					{t('Регистрация')}
				</h1>
				<form autoComplete='off' onSubmit={handleSubmit(sendLoginData)}>
					<Input
						icon={loginIcon}
						placeholder={t('Имя')}
						type='text'
						id='login'	
						autocomplete={'off'}
						className={errors.name && s.errorBorder}
						register={register('name', {
							required: true,
							validate: (value) =>
								/^[a-zа-яё]+$/i.test(value) === false
									? 'Пожалуйста следуйте формату: Имя'
									: true,
						})}
					/>
					{errors.name && (
						<span className={s.errorSpan}>Следуйте формату Имя: </span>
					)}
					<Input
						icon={phoneIcon}
						placeholder={t('Email')}
						type='text' 
						id='phoneOrEmail'
						style={{ marginTop: '25px' }}
						className={errors.phone_or_email && s.errorBorder}
						register={register('email', {
							required: true,
							validate: (value) => validateEmailOrPhone(value),
						})}
					/>
					{errors.email && (
						<span className={s.errorSpan}>{t('Введите валидную почту')}</span>
					)}
					
					<Input
						icon={passIcon}
						placeholder={t('Пароль')}
						type='password'
						id='pass'
						style={{ marginTop: '25px' }}
						register={register('pass', {
							required: true,
							validate: (value) =>
								value.length >= 6 && value.length <= 12
						})}>
						<EyeIcon
							onClick={() => {
								setShowPassword(!showPassword)
							}}
							width={25}
							height={25}
							style={{ cursor: 'pointer' }}
						/>
					</Input>
					{errors.pass && (
						<span className={s.errorSpan}>{t('Введите пароль от 6 до 12 символов')}</span>
					)}

					<Input
						icon={phoneIcon}
						placeholder={t('City')}
						type='text' 
						id='city'
						style={{ marginTop: '25px' }}
						className={errors.date && s.errorBorder}
						register={register('city', {
							required: true,
						})}
					/>
					{errors.city && (
						<span className={s.errorSpan}>{t('Пожалуйста укажите город')}</span>
					)}
					<div className={s.gender}>
						<span>Выберите пол:</span>
						<label
							onClick={() => setGender('male')}
							className={gender === 'male' ? `${s.checked}` : ''}
							htmlFor='gender_male'>
							<Image
								src={maleIcon}
								alt='male icon'
								width={40}
								height={40}
							/>
						</label>
						<input
							{...register('gender', { required: true })}
							id='gender_male'
							value='male'
							type='radio'
						/>
						<label
							onClick={() => setGender('female')}
							className={gender === 'female' ? `${s.checked}` : ''}
							htmlFor='gender_female'>
							<Image
								src={femaleIcon}
								alt='female icon'
								width={40}
								height={40}
							/>
						</label>
						<input
							{...register('gender', { required: true })}
							id='gender_female'
							value='female'
							type='radio'
						/>
					</div>
					{errors.gender && (
						<span className={s.errorSpan}>{t('Пожалуйста укажите пол')}</span>
					)}
					<button type='submit' className={` btn ${s.submitBtn}`}>
						{t('Регистрация')}
					</button>
					<div className={s.navActions}>
						<Link href="/login">Уже есть аккаунт?</Link>
					</div>
				</form>
			</div>
		</div>
	)
}
