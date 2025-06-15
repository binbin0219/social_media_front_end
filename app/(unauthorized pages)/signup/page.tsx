"use client"
import React, { useState } from 'react'
import './signup.css'
import EmailInput from './EmailInput'
import PasswordInput from './PasswordInput'
import UsernameInput from './UsernameInput'
import { Gender } from '@/lib/models/user'
import LoadingButton from '@/components/LoadingButton/LoadingButton'

type SignUpDetails = {
    username: string;
    email: string;
    password: string;
    gender: Gender;
}

const Page = () => {
    const [signUpDetails, setSignUpDetails] = useState<SignUpDetails>({
        username: "",
        email: "",
        password: "",
        gender: "male"
    });
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isUsernameValid, setIsUsernameValid] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [existedEmail, setExistedEmail] = useState<string[]>([]);
    const isEmailExisted = existedEmail.find(email => email == signUpDetails.email);

    React.useEffect(() => {
        inputIconAnimation()
    })
    function inputIconAnimation() {
        document.querySelectorAll(".InputFields input").forEach(InputField => {
            InputField.addEventListener('focus', (event) => {
                const target = event.target as HTMLElement;
                const UserIcon = target.parentNode!.querySelector(".tabler-icon");
                UserIcon!.classList.add("IconFocus");
            })

            InputField.addEventListener('blur', (event) => {
                const target = event.target as HTMLElement;
                const UserIcon = target.parentNode!.querySelector(".tabler-icon");
                UserIcon!.classList.remove("IconFocus");
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

        try {
            if(isSigningUp) return;
            setIsSigningUp(true);
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
        } catch (error) {
            console.error(error);
            alert("Failed to sign up, please try again");
        } finally {
            setIsSigningUp(false);
        }
    }

    return (
        <>
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
                        gender={signUpDetails.gender}
                        setGender={(gender) => setSignUpDetails(prev => ({...prev, gender}))}
                    />
                    <div className='flex flex-col gap-4 w-full' style={{ marginTop: "20px" }}>
                        <LoadingButton
                        type='submit'
                        className={`sign-up-button ${!isUsernameValid && 'disabled'} flex items-center justify-center gap-3`}
                        isLoading={isSigningUp}
                        text='Finish sign up'
                        loadingText='Signing up...'
                        loaderColor='#8F00FF'
                        />
                        <button onClick={() => {if(isSigningUp) return; setStep(2)}} type="button" className={`w-[100%] flex justify-center items-center rounded-full border p-2 hover:bg-slate-200 transition-all`} >
                            Back
                        </button>
                    </div>
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

export default Page