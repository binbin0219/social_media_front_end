"use client"
import React, { useEffect, useRef, useState } from 'react'
import 'intl-tel-input/build/css/intlTelInput.css';
import { CountryData, Plugin } from 'intl-tel-input';
import { PhoneNumber } from '@/lib/models/user';

type Props = {
    phoneNumber?: PhoneNumber | null,
    setterFunction: (value: PhoneNumber) => void
}

const PhoneNumberInput = ({phoneNumber, setterFunction} : Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const itiRef = useRef<Plugin>(null);
    const [isInputValid, setIsInputValid] = useState(true);
    const [phoneNumberBody, setPhoneNumberBody] = useState(phoneNumber?.phoneNumberBody);
    const [isIntlTelInputInitiated, setIsIntlTelInputInitiated] = useState(false);

    useEffect(() => {
        import('intl-tel-input').then((intlTelInput) => {
            if (inputRef.current && isIntlTelInputInitiated === false) {
                itiRef.current = intlTelInput.default(inputRef.current, {
                    initialCountry: phoneNumber?.countryISO2 ?? "us",
                    separateDialCode: true,
                    formatOnDisplay: false,
                    customContainer: "w-full",
                    utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js'
                });
                setIsIntlTelInputInitiated(true);
            }
        });
    }, [phoneNumber?.countryISO2, isIntlTelInputInitiated]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumberBody(e.target.value);

        const isNumberValid = itiRef.current?.isValidNumber();
        setIsInputValid(isNumberValid!);
        if(isNumberValid) {
            const phoneNumberDetails: CountryData = itiRef.current!.getSelectedCountryData();
            setterFunction({
                dialCode: phoneNumberDetails.dialCode,
                phoneNumberBody: e.target.value,
                fullNumber: `+${phoneNumberDetails.dialCode}${e.target.value}`,
                countryISO2: phoneNumberDetails.iso2,
                countryName: phoneNumberDetails.name,
            });
        }
    }

    return (
        <input onChange={(e) => handleInput(e)} ref={inputRef} id="phone_number_input" 
            value={phoneNumberBody}
            name="phoneNumber" 
            className={`px-3 py-2 border-2 rounded-lg w-full outline-none ${isInputValid ? 'border-slate-200' : 'border-red-500'}`}
        />
    )
}

export default PhoneNumberInput