import LoadingButton from '@/components/LoadingButton/LoadingButton';
import { IconMail } from '@tabler/icons-react';
import React, { useState } from 'react'

type Props = {
    email: string;
    setEmail: (email: string) => void;
    isEmailValid: boolean;
    isEmailExisted: boolean;
    setExistedEmail: (value: React.SetStateAction<string[]>) => void;
    setIsEmailValid: (valid: boolean) => void;
    setStep: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
}

const EmailInput = ({email, setEmail, isEmailExisted, isEmailValid, setStep, setExistedEmail, setIsEmailValid}: Props) => {
    const [isCheckingEmailExist, setIsCheckingEmailExist] = useState(false);

    const checkIsEmailExistedOnServer = async (email: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/email/exist?email=${email}`);
        if(!response.ok) {
            throw new Error("Failed to check is email existed on server");
        }
        return await response.json();
    }

    const checkEmailValidity = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return false;
        }

        return true;
    }

    const handleEmailInput = (e: React.FormEvent<HTMLInputElement>) => {
        const newEmail = (e.target as HTMLInputElement).value;

        setIsEmailValid(checkEmailValidity(newEmail));
        setEmail(newEmail);
    }

    const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!isEmailValid) {
            return;
        }

        try {
            setIsCheckingEmailExist(true);
            const isEmailExisted = await checkIsEmailExistedOnServer(email);
            if(isEmailExisted) {
                setExistedEmail(prev => [...prev , email]);
                return;
            }

            setStep(2);
        } catch (error) {
            console.error(error);
            alert("Something went wrong while validating email, please try again");
        } finally {
            setIsCheckingEmailExist(false);
        }
    }

    return (
        <form onSubmit={(e) => handleEmailSubmit(e)} action="" className='sign-up-form'>
            <div>
                <label>Email</label>
                <div className="InputFields">
                    <IconMail className='icon'/>
                    <input 
                    value={email} 
                    onInput={e => handleEmailInput(e)} 
                    placeholder='example@domain.com' 
                    name="email" 
                    autoComplete='off'
                    required
                    />
                    <div className="InputFieldBottomLine"></div>
                    {!isEmailValid && !isEmailExisted && email.trim() !== "" && (
                        <span id="emailRules" className="input-error-message" style={{color: "red", fontSize: "12px"}}>
                            Invalid Email
                        </span>
                    )}
                    {isEmailExisted && (
                        <span className="input-error-message" style={{color: "red", fontSize: "12px"}}>
                            This email existed
                        </span>
                    )}
                </div>
            </div>
            <LoadingButton
                type='submit'
                className={`sign-up-button flex items-center justify-center gap-3 ${!isEmailValid && 'disabled'} mt-5`}
                isLoading={isCheckingEmailExist}
                text='Next'
                loadingText='Validating email...'
                loaderColor='#8F00FF'
            />
        </form>
    )
}

export default EmailInput