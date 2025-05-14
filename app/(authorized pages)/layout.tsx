import { Navbar } from "@/components/Navbar/Navbar";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const cookieName = 'jwtToken';
  const cookieStore = cookies();
  const jwtCookie = (await cookieStore).get(cookieName);
  // const initialPosts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/get?offset=0&recordPerPage=6`, {
  //     method: 'GET',
  //     headers: {
  //         Cookie: jwtCookie ? `${cookieName}=${jwtCookie.value}` : ''
  //     },
  //     credentials: 'include'
  // })
  // .then( res => {
  //     if(!res.ok) return [];
  //     return res.json();
  // })

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
    // cache: "force-cache",
    cache: "no-cache",
    method: "GET",
    headers: {
      Cookie: jwtCookie ? `${cookieName}=${jwtCookie.value}` : ''
    },
    credentials: "include",
  });

  if (!response.ok) {
      redirect('/login');
  };

  const authUserData: User = await response.json();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link href="https://fonts.googleapis.com/css2?family=Fugaz+One&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
        <Script id="global-script" strategy="beforeInteractive" src="/global.js"></Script>
      </head>
      <Suspense fallback={<Loading />}> 
        <body
          className={`antialiased`}
          style={{ backgroundColor: "#dbdbdb7a" }}
        >
          <WebSocketProvider>
            <StoreProvider 
              currentUser={authUserData} 
              notifications={{
                ...notificationsInitialState,
                unseenNotificationCount: authUserData?.unseenNotificationCount ?? 0,
                seenNotificationCount: authUserData?.seenNotificationCount ?? 0,
              }}
              initialPosts={[]}
              allUnreadMessagesCount={authUserData!.unreadChatMessageCount}
            >
                  <Navbar />
                  <ConfirmationDialog />
                  <ToastContainer />
                  <FileViewer/>
                  {children}
            </StoreProvider>
          </WebSocketProvider>
        </body>
      </Suspense>
    </html>
  );
}
