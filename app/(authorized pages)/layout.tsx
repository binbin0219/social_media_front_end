import '../globals.css';
import Script from "next/script";
import { Suspense } from "react";
import Loading from "./loading";
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog";
import StoreProvider from "@/context/ReduxContext";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@/lib/models/user";
import { initialState as notificationsInitialState } from "@/redux/slices/notificationSlice";
import FileViewer from "@/components/FileViewer/FileViewer";
import { WebSocketProvider } from "@/context/WebSocketContext";
import { Poppins, Fugaz_One } from 'next/font/google';
import { DialogContextProvider } from "@/context/DialogContext";
import Navbar from "@/components/Navbar/Navbar";

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700', '800', '900'],
	display: 'swap',
	variable: '--font-poppins',
});

const fugaz = Fugaz_One({
	subsets: ['latin'],
	weight: '400',
	display: 'swap',
	variable: '--font-fugaz',
});

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	let authUserData: User | null = null;

	try {
		const cookieStore = await cookies();
		const nextJwtCookie = cookieStore.get(process.env.NEXT_JWT_TOKEN_NAME!);
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
			// cache: "force-cache",
			cache: "no-cache",
			method: "GET",
			headers: {
				Cookie: nextJwtCookie ? `${process.env.JWT_TOKEN_NAME}=${nextJwtCookie.value}` : ''
			},
			credentials: "include",
		});

		if (!response.ok) {
			throw new Error();
		};

		authUserData = await response.json();
	} catch (e) {
		console.log("Failed to authenticate user :" + e);
		redirect('/login');
	}

	return (
		<html lang="en" className={`${poppins.variable} ${fugaz.variable}`}>
			<head>
				<Script id="global-script" strategy="beforeInteractive" src="/global.js"></Script>
			</head>
			<Suspense fallback={<Loading />}> 
				<body
					className={`antialiased`}
					style={{ backgroundColor: "#F7F8FA" }}
				>
					<WebSocketProvider>
						<StoreProvider 
							currentUser={authUserData} 
							notifications={{
								...notificationsInitialState,
								newNotificationCount: authUserData?.newNotificationCount ?? 0,
							}}
							initialPosts={[]}
							allUnreadMessagesCount={authUserData?.unreadChatMessageCount ?? 0}
						>
							<DialogContextProvider>
								<Navbar/>
								<ConfirmationDialog />
								<ToastContainer />
								<FileViewer/>
								{children}
							</DialogContextProvider>
						</StoreProvider>
					</WebSocketProvider>
				</body>
			</Suspense>
		</html>
	);
}
