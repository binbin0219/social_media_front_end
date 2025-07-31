"use client"
import { checkIsEmpty, checkIsValidInputLength } from '@/main';
import { IconAlertCircle } from '@tabler/icons-react';
import React, { useRef } from 'react'

type InputKey = "character" | "number" | "symbol" | "space";

type Props = {
    value: string;
    setter: (value: string) => void;
    name: string;
    placeholder: string;
    min: number;
    max: number;
    rows: number;
    className?: string;
    disabledInputKeys?: InputKey[];
    allowEmpty?: boolean;
    ref?: React.Ref<HTMLTextAreaElement>
}

const SmartTextArea = (props: Props) => {
    const { disabledInputKeys = [] } = props;
    const textLengthMessageRef = useRef<HTMLParagraphElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
            return;
        }
    
        props.setter(e.target.value);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isAllowedKey(e.key, disabledInputKeys)) return;
        e.preventDefault();
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const pastedText = e.clipboardData.getData('text');
        for (const char of pastedText) {
            if (!isAllowedKey(char, disabledInputKeys)) {
                e.preventDefault();
                return;
            }
        }
    };

    const isAllowedKey = (char: string, disabledInputKeys: InputKey[]) => {
        const isLetter = /[a-zA-Z]/.test(char);
        const isNumber = /[0-9]/.test(char);
        const isSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(char);
        const isSpace = /\s/.test(char);

        if (isLetter && disabledInputKeys.includes('character')) return false;
        if (isNumber && disabledInputKeys.includes('number')) return false;
        if (isSymbol && disabledInputKeys.includes('symbol')) return false;
        if (isSpace && disabledInputKeys.includes('space')) return false;

        return true;
    };

    return (
        <div className='flex flex-col gap-2'>
            <textarea
            ref={props.ref}
            rows={props.rows}
            name={props.name}
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => handleInputChange(e)}
            onKeyDown= {(e) => handleKeyDown(e)}
            onPaste= {(e) => handlePaste(e)}
            className={props.className}
            >
            </textarea>
            <p className='text-sm text-slate-500 text-end'>{props.value.length} / {props.max}</p>
            <p ref={textLengthMessageRef} className='text-red-500 mt-2' style={{display: 'none'}}>
                <IconAlertCircle className='me-2'/>
                Must between {props.min} and {props.max} characters
            </p>
        </div>
    )
}

export default SmartTextArea