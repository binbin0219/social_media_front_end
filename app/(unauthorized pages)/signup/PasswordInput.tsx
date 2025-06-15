"use client"
import { IconEye, IconEyeOff, IconLock } from '@tabler/icons-react';
import React, { useState } from 'react'

type Props = {
    password: string;
    setPassword: (email: string) => void;
    isPasswordValid: boolean;
    setIsPasswordValid: (valid: boolean) => void;
    setStep: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
}

const PasswordInput = ({password, setPassword, isPasswordValid, setStep, setIsPasswordValid}: Props) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    function checkPasswordValidity(password: string): boolean {
        const hasLetter = /[A-Za-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const noSpaces = !/\s/.test(password);
        const isLongEnough = password.length > 6;
        const isNotEmpty = password.trim().length > 0;

        return hasLetter && hasDigit && noSpaces && isLongEnough && isNotEmpty;
    }


    const handlePasswordInput = (e: React.FormEvent<HTMLInputElement>) => {
        const newPassword = (e.target as HTMLInputElement).value;

        setIsPasswordValid(checkPasswordValidity(newPassword));
        setPassword(newPassword)
    }

    const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!isPasswordValid) {
            return;
        }

        setStep(3);
    }

    return (
        <form onSubmit={(e) => handlePasswordSubmit(e)} action="" className='sign-up-form'>
            <div>
                <div className='w-full flex justify-between'>
                    <label>Password</label>
                    <button onClick={() => setIsPasswordVisible(!isPasswordVisible)} type='button' className='hover:opacity-50'>
                        {isPasswordVisible && <IconEye/>}
                        {!isPasswordVisible && <IconEyeOff/>}
                    </button>
                </div>
                <div className="InputFields">
                    <IconLock className='icon'/>
                    <input 
                    value={password} 
                    onInput={e => handlePasswordInput(e)} 
                    placeholder='password' 
                    name="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    autoComplete='new-password'
                    required
                    />
                    <div className="InputFieldBottomLine"></div>
                    {!isPasswordValid && password.trim() !== "" && (
                        <span id="passwordRules" className="input-error-message" style={{color: "red", fontSize: "12px"}}>
                            Password must be 6–20 characters, contain at least one letter and one number, and have no spaces
                        </span>
                    )}
                </div>
            </div>
            <div className='flex flex-col gap-4 w-full' style={{ marginTop: "20px" }}>
                <button type="submit" className={`sign-up-button w-[100%] ${!isPasswordValid && 'disabled'}`} >Next</button>
                <button onClick={() => setStep(1)} type="button" className={`w-[100%] flex justify-center items-center rounded-full border p-2 hover:bg-slate-200 transition-all`} >
                    Back
                </button>
            </div>
        </form>
    )
}

export default PasswordInput