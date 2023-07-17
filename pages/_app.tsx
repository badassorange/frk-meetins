import 'regenerator-runtime/runtime';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { setIsMobile } from '../global/store/store';
import { connection, setNewConnection } from '../global/store/connection_model';
import { useStore } from 'effector-react';
import { detectUserLanguage } from '../global/helpers/helper';
import { useResize } from '../global/hooks/useResize';
import Layout from '../components/Layout/Layout';
import '../styles/app.css';
import '../styles/themes.css';
import '../node_modules/reseter.css/css/reseter.min.css';
import Head from 'next/head';
import ErrorBlock from '../components/ErrorBlock/errorBlock';
import '../i18n';
import i18n from '../i18n';
import CustomModal from '../global/helpers/CustomModal/CustomModal';
import { getMyDialogs } from '../global/store/chat_model';
import { useAuthAndInithialSocket } from '../global/hooks/useAuthAndInithialSocket';

function MyApp({ Component, pageProps }: AppProps) {

	const connection$ = useStore(connection);
	const {isMobile, isUnAdaptive} = useResize();
	const [isNotifyAdaptive, setIsNotifyAdaptive] = useState<boolean>();
	const isConnected = useAuthAndInithialSocket();

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", localStorage.getItem('data-theme') || 'black');
		i18n.changeLanguage(detectUserLanguage());
		return () => {
			connection$?.disconnect();
		}
	}, []);

	useEffect(() => {
		setIsMobile(isMobile);
		setIsNotifyAdaptive(isUnAdaptive);
	}, [isMobile, isUnAdaptive]);

	useEffect(() => {
		if(isConnected) {
			getMyDialogs(true);
		}
	}, [isConnected]);
	
	return (
		<Layout>
			<Head>
				<title>Meetins</title>
				<link rel='icon' href='/images/logo.svg' />
				<meta name="description" content="Checkout our service" key="desc" />
				<meta property="og:title" content="Social Media Meetins for cool persons" />
				<meta
				property="og:description"
				content="Join us and get a lot of fun and new friends"
				/>
			</Head>
			<Component {...pageProps} />
			<ErrorBlock />
			<CustomModal
				isDisplay={isNotifyAdaptive}
				changeModal={setIsNotifyAdaptive}
				actionConfirmed={(status) => setIsNotifyAdaptive(false)}
				title='Уведомление'
				typeOfActions='default'
			>
				Внимание, возможно параметры Вашего экрана отличаются от ожидаемых.
				Отображение страниц сайта может быть некорректным.
			</CustomModal>
		</Layout>
	)
}

export default MyApp;

