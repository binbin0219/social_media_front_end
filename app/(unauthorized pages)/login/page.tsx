"use client"
import React, { FormEvent, use, useEffect } from 'react'
import './login.css'
import { useRouter } from 'next/navigation'

const page = () => {
    const router = useRouter();

    const handleLogin = async (event : FormEvent) => {
        try {
            event.preventDefault();
            const target = event.target as HTMLFormElement;
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    accountName: target.accountName.value, 
                    password: target.password.value
                }) 
            });

            if(!response.ok) {
                displayMessage("show");
                return;
            }

            router.push('/');
        } catch (e) {
            alert("Lost connection from server! please try again later.");
        }
    }
    
    function displayMessage(action: string) {
        var messageDisplayer = document.querySelectorAll(".incorrectUsernameOrPassword");
        for (var i = 0; i < messageDisplayer.length; i++) {
            
            action === "show" ? messageDisplayer[i].classList.remove("hidden") : messageDisplayer[i].classList.add("hidden");
        }
    }

    function inputIconAnimation() {
        document.querySelectorAll(".InputFields input").forEach(InputField => {
            InputField.addEventListener('focus', (event) => {
                var UserIcon = event.target.parentNode.querySelector(".icon.icon-tabler");
                UserIcon.classList.add("IconFocus");
            })

            InputField.addEventListener('blur', (event) => {
                var UserIcon = event.target.parentNode.querySelector(".icon.icon-tabler");
                UserIcon.classList.remove("IconFocus");
            })
        })
    }

    useEffect(() => {
        inputIconAnimation();
    })
    
    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com"></link>
            <link rel="preconnect" href="https://fonts.gstatic.com"></link>
            <link href="https://fonts.googleapis.com/css2?family=Fugaz+One&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
            <div className="login shadow-xl">
                <div className='w-[80%]'>
                    <h1 className="font-normal text-4xl my-7 text-indigo-800 text-center" style={{fontFamily: "Fugaz One"}}>Blogify</h1>
                    {/* <h1 className="LoginTitle font-bold text-3xl mt-5">Login</h1> */}
                    <form className="NameAndPasswordForm" action="/api/auth/login" method="post" onSubmit={(event) => handleLogin(event)}>
                        {/* <input type="hidden" name="sa" /> */}
                        <label>Username</label>
                        <div className="InputFields">
                        <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                        </svg>
                            <input name="accountName"/>
                            <div className="InputFieldBottomLine"></div>
                            <span className="incorrectUsernameOrPassword hidden" style={{color: "red"}}>
                                Incorrect username or password</span>
                        </div>
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
                            <span className="incorrectUsernameOrPassword hidden" style={{color: 'red'}}>
                                Incorrect username or password</span>
                        </div>
                        <button type="submit" className="LoginButton poppins-regular mt-5">Login</button>
                    </form>
                    <div className="alreadyHaveAnAccount">
                        <p>Don't have an account?</p>
                        <a href="/signup" className='text-indigo-600'>Go to Sign Up &gt;&gt;</a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page