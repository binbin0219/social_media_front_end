"use client"
import { checkIsEmpty, checkIsValidInputLength } from '@/main';
import { IconAlertCircle } from '@tabler/icons-react';
import React, { useRef } from 'react'

type InputKey = "character" | "number" | "symbol" | "space";

type Props = {
    value: string;
    setter: (value: string) => void;
    type: string;
    name: string;
    placeholder: string;
    min: number;
    max: number;
    disableSpace?: boolean;
    allowedTypes: InputKey[];
    allowEmpty?: boolean;
}

const InputField = (props: Props) => {
    const textLengthMessageRef = useRef<HTMLParagraphElement>(null);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        const value = target.value;
        const isEmpty = checkIsEmpty(value);

        if(props.allowEmpty) {
            if(isEmpty) {
                target.style.borderColor = 'red';
            } else {
                target.style.borderColor = '';
            }
        }

        if(!checkIsValidInputLength(value, props.min, props.max)) {
            textLengthMessageRef.current!.style.display = 'flex';
            target.style.borderColor = 'red';
        } else {
            textLengthMessageRef.current!.style.display = 'none';
            target.style.borderColor = '';
        }
    
        props.setter(e.target.value);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (isAllowedKey(e.key, props.allowedTypes)) return;
        e.preventDefault();
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedText = e.clipboardData.getData('text');
        for (const char of pastedText) {
            if (!isAllowedKey(char, props.allowedTypes)) {
                e.preventDefault();
                return;
            }
        }
    };

    const isAllowedKey = (char: string, allowedTypes: InputKey[]) => {
        const isLetter = /[a-zA-Z]/.test(char);
        const isNumber = /[0-9]/.test(char);
        const isSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(char);
        const isSpace = /\s/.test(char);
    
        return (
            (allowedTypes.includes('character') && isLetter) ||
            (allowedTypes.includes('number') && isNumber) ||
            (allowedTypes.includes('symbol') && isSymbol) ||
            (allowedTypes.includes('space') && isSpace)
        );
    };

    return (
        <div className='flex flex-col gap-2'>
            <input
            type={props.type}
            name={props.name}
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => handleUsernameChange(e)}
            onKeyDown= {(e) => handleKeyDown(e)}
            onPaste= {(e) => handlePaste(e)}
            className="px-3 py-2 border-2 border-slate-200 rounded-lg w-full outline-none"
            />
            <p ref={textLengthMessageRef} className='text-red-500 mt-2' style={{display: 'none'}}>
                <IconAlertCircle className='me-2'/>
                Must between {props.min} and {props.max} characters
            </p>
        </div>
    )
}

export default InputField