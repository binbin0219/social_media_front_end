"use client"
import React, { FormEvent, useEffect, useState } from 'react'
import './login.css'
import { useRouter } from 'next/navigation'
import LoadingButton from '@/components/LoadingButton/LoadingButton'

const Page = () => {
    const router = useRouter();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isInputWrong, setIsInputWrong] = useState(false);

    const handleLogin = async (event : FormEvent) => {
        try {
            event.preventDefault();
            if(isLoggingIn) return;
            setIsLoggingIn(true);
            setIsInputWrong(false);
            const target = event.target as HTMLFormElement;
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    email: target.email.value, 
                    password: target.password.value
                }) 
            });

            if(!response.ok) {
                setIsInputWrong(true);
                return;
            }

            const nextJsResponse = await fetch(`/api/auth/login`, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    email: target.email.value, 
                    password: target.password.value
                }) 
            });

            if(!nextJsResponse) {
                throw new Error("Failed to login on front-end server!");
            }

            router.push('/');
        } catch (e) {
            console.log(e);
            alert("Lost connection from server! please try again later.");
        } finally {
            setIsLoggingIn(false);
        }
    }

    const inputIconAnimation = () => {
        document.querySelectorAll(".InputFields input").forEach(InputField => {
            InputField.addEventListener('focus', (event) => {
                const target = event.target as HTMLElement;
                const UserIcon = target.parentNode!.querySelector(".icon.icon-tabler");
                UserIcon!.classList.add("IconFocus");
            })

            InputField.addEventListener('blur', (event) => {
                const target = event.target as HTMLElement;
                const UserIcon = target.parentNode!.querySelector(".icon.icon-tabler");
                UserIcon!.classList.remove("IconFocus");
            })
        })
    }

    useEffect(() => {
        inputIconAnimation();
    })
    
    return (
        <>
            <div className="login shadow-xl">
                <div className='w-[80%]'>
                    <h1 className="font-normal text-4xl my-7 text-indigo-800 text-center" style={{fontFamily: "Fugaz One"}}>Blogify</h1>
                    {/* <h1 className="LoginTitle font-bold text-3xl mt-5">Login</h1> */}
                    <form className="NameAndPasswordForm gap-5" action="/api/auth/login" method="post" onSubmit={(event) => handleLogin(event)}>
                        {/* <input type="hidden" name="sa" /> */}
                        <div>
                            <label>Email</label>
                            <div className="InputFields">
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={30}  height={30}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-mail">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                                    <path d="M3 7l9 6l9 -6" />
                                </svg>
                                <input name="email"/>
                                <div className="InputFieldBottomLine"></div>
                                {isInputWrong && (
                                    <span style={{color: 'red'}}>
                                        Incorrect email or password
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            <label>Password</label>
                            <div className="InputFields">
                            <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-lock">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
                                <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                                <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
                            </svg>
                                <input name="password" type="password"/>
                                <div className="InputFieldBottomLine"></div>
                                {isInputWrong && (
                                    <span style={{color: 'red'}}>
                                        Incorrect email or password
                                    </span>
                                )}
                            </div>
                        </div>
                        <LoadingButton
                            type='submit'
                            className='LoginButton poppins-regular mt-5 flex gap-3 items-center justify-center'
                            isLoading={isLoggingIn}
                            text='Login'
                            loadingText='Logging in...'
                            loaderColor='#8F00FF'
                        />
                    </form>
                    <div className="alreadyHaveAnAccount">
                        <p>Don&apos;t have an account?</p>
                        <a href="/signup" className='text-indigo-600 hover:opacity-50'>Go to Sign Up &gt;&gt;</a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page