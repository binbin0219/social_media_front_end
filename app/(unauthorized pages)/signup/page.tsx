"use client"
import React, { useState } from 'react'
import './signup.css'
import EmailInput from './EmailInput'
import PasswordInput from './PasswordInput'
import UsernameInput from './UsernameInput'
import { Gender } from '@/lib/models/user'

type SignUpDetails = {
    username: string;
    email: string;
    password: string;
    gender: Gender;
}

const page = () => {
    const [signUpDetails, setSignUpDetails] = useState<SignUpDetails>({
        username: "",
        email: "",
        password: "",
        gender: "male"
    });
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isUsernameValid, setIsUsernameValid] = useState(false);
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [existedEmail, setExistedEmail] = useState<string[]>([]);
    const isEmailExisted = existedEmail.find(email => email == signUpDetails.email);

    React.useEffect(() => {
        inputIconAnimation()
    })
    function inputIconAnimation() {
        document.querySelectorAll(".InputFields input").forEach(InputField => {
            InputField.addEventListener('focus', (event) => {
                var UserIcon = event.target.parentNode.querySelector("span");
                UserIcon.classList.add("IconFocus");
            })

            InputField.addEventListener('blur', (event) => {
                var UserIcon = event.target.parentNode.querySelector("span");
                UserIcon.classList.remove("IconFocus");
            })
        })
    }

    const handleSignup = async (event : React.FormEvent) => {
        event.preventDefault();

        if(!isEmailValid || isEmailExisted) {
            setStep(1);
            return;
        }
        if(!isPasswordValid) {
            setStep(2);
            return;
        }
        if(!isUsernameValid) {
            return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: signUpDetails.username,
                email: signUpDetails.email,
                password: signUpDetails.password,
                gender: signUpDetails.gender
            })
        });

        if (!response.ok) {
            alert("Something went wrong, please try again later.");
            return;
        }

        window.location.href = '/signup/success';
    }

    return (
        <>
        <link
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet" />
        <link rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            
        <div className="sign-up relative">
            <h1 className="font-bold text-4xl">Sign up</h1>
            {step === 1 && (
                <EmailInput
                    email={signUpDetails.email}
                    setEmail={(email) => setSignUpDetails(prev => ({...prev, email}))}
                    isEmailValid={isEmailValid}
                    isEmailExisted={isEmailExisted !== undefined}
                    setExistedEmail={setExistedEmail}
                    setIsEmailValid={setIsEmailValid}
                    setStep={setStep}
                />
            )}
            {step === 2 && (
                <PasswordInput
                    password={signUpDetails.password}
                    setPassword={(password) => setSignUpDetails(prev => ({...prev, password}))}
                    isPasswordValid={isPasswordValid}
                    setIsPasswordValid={setIsPasswordValid}
                    setStep={setStep}
                />
            )}
            {step === 3 && (
                <form onSubmit={(e) => handleSignup(e)} action="" className='sign-up-form'>
                    <UsernameInput
                        username={signUpDetails.username}
                        setUsername={(username) => setSignUpDetails(prev => ({...prev, username}))}
                        isUsernameValid={isUsernameValid}
                        setIsUsernameValid={setIsUsernameValid}
                        setStep={setStep}
                        gender={signUpDetails.gender}
                        setGender={(gender) => setSignUpDetails(prev => ({...prev, gender}))}
                    />
                </form>
            )}
            <div className="alreadyHaveAnAccount">
                <p>Already have an account?</p>
                <a href="/login" className='text-indigo-600 hover:opacity-50'>Go to login &gt;&gt;</a>
            </div>
        </div>
        </>
    )
}

export default page