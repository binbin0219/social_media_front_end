import DynamicTooltip from '@/components/Tooltip/DynamicToolTip';
import React from 'react'
import GenderInput from './GenderInput';
import { Gender } from '@/lib/models/user';
import { IconUser } from '@tabler/icons-react';

type Props = {
    username: string;
    setUsername: (username: string) => void;
    isUsernameValid: boolean;
    setIsUsernameValid: (valid: boolean) => void;
    gender: Gender;
    setGender: (gender: Gender) => void;
}

const UsernameInput = ({username, setUsername, isUsernameValid, setIsUsernameValid, gender, setGender}: Props) => {

    function checkUsernameValidity(username: string): boolean {
        const isNotEmpty = username.trim().length > 0;
        const isCorrectLength = username.length >= 6 && username.length <= 20;
        const isAlphanumeric = /^[A-Za-z0-9]+$/.test(username);

        return isNotEmpty && isCorrectLength && isAlphanumeric;
    }

    const firstNames = [
        'Desmond', 'Alice', 'Maya', 'Liam', 'Noah', 'Emma', 'Olivia', 'Ethan', 'Ava',
        'Sophia', 'Jackson', 'Isabella', 'Lucas', 'Mia', 'Amelia', 'Elijah', 'Charlotte',
        'Benjamin', 'Harper', 'James', 'Ella', 'Logan', 'Grace', 'Alexander', 'Chloe',
        'Henry', 'Lily', 'Sebastian', 'Zoe'
    ];

    const lastNames = [
        'Smith', 'Johnson', 'Brown', 'Lee', 'Wilson', 'Nguyen', 'Garcia', 'Martinez',
        'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'White', 'Harris',
        'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall', 'Young', 'Allen',
        'King', 'Wright', 'Scott', 'Torres'
    ];

    const generateRandomUsername = (): string => {
        const MIN_LENGTH = 6;
        const MAX_LENGTH = 20;

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const useLastName = Math.random() < 0.5;
        let lastName = useLastName
            ? lastNames[Math.floor(Math.random() * lastNames.length)]
            : '';

        const maxDigitsLength = Math.min(5, MAX_LENGTH - firstName.length - lastName.length);
        const digitsLength = Math.max(3, maxDigitsLength > 3 ? maxDigitsLength : 3);

        const maxLastNameLength = MAX_LENGTH - firstName.length - digitsLength;
        if (lastName.length > maxLastNameLength) {
            lastName = lastName.substring(0, maxLastNameLength);
        }

        let digits = '';
        for (let i = 0; i < digitsLength; i++) {
            digits += Math.floor(Math.random() * 10);
        }

        let username = firstName + lastName + digits;

        while (username.length < MIN_LENGTH) {
            username += Math.floor(Math.random() * 10);
        }

        return username;
    };

    const handleRandonNameBtnClick = () => {
        const randomName = generateRandomUsername();
        setUsername(randomName);
        setIsUsernameValid(checkUsernameValidity(randomName));
    }

    const handleUsernameInput = (e: React.FormEvent<HTMLInputElement>) => {
        const newUsername = (e.target as HTMLInputElement).value;

        setIsUsernameValid(checkUsernameValidity(newUsername));
        setUsername(newUsername)
    }

    return (
        <>
            <div>
                <div className='w-full flex justify-between'>
                    <label>Username</label>
                    <DynamicTooltip text='Random name'>
                        <button onClick={() => handleRandonNameBtnClick()} type='button'>
                            <svg className='hover:fill-violet-800' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="25px" width="25px" version="1.1" id="_x32_" viewBox="0 0 512 512" xmlSpace="preserve">
                                
                                <g>
                                    <path className="st0" d="M449.532,105.602L288.463,8.989C278.474,2.994,267.235,0,256.011,0c-11.239,0-22.483,2.994-32.467,8.989   L62.475,105.602c-19.012,11.406-30.647,31.95-30.647,54.117v192.562c0,22.168,11.635,42.711,30.647,54.117l161.069,96.613   c9.984,5.988,21.228,8.989,32.467,8.989c11.225,0,22.463-3.001,32.452-8.989l161.069-96.613   c19.012-11.406,30.64-31.949,30.64-54.117V159.719C480.172,137.552,468.544,117.008,449.532,105.602z M250.599,492.733   c-6.029-0.745-11.93-2.719-17.32-5.948L72.21,390.172c-13.306-7.989-21.456-22.369-21.456-37.891V159.719   c0-6.022,1.236-11.862,3.518-17.233l196.328,117.76V492.733z M59.669,133.114c3.364-4.464,7.593-8.318,12.541-11.285   l161.069-96.613c6.995-4.196,14.85-6.291,22.732-6.291c7.868,0,15.723,2.095,22.718,6.291l161.069,96.613   c4.941,2.967,9.184,6.821,12.54,11.285L256.011,250.881L59.669,133.114z M461.254,352.281c0,15.522-8.15,29.902-21.456,37.891   l-161.069,96.613c-5.398,3.229-11.292,5.203-17.321,5.948V260.246l196.328-117.76c2.283,5.37,3.518,11.211,3.518,17.233V352.281z"/>
                                    <path className="st0" d="M160.209,119.875c-9.828-7.278-26.021-7.465-36.165-0.41c-10.144,7.056-10.399,18.67-0.57,25.947   c9.828,7.277,26.022,7.459,36.159,0.41C169.783,138.766,170.038,127.152,160.209,119.875z"/>
                                    <path className="st0" d="M279.159,48.686c-9.829-7.277-26.022-7.458-36.172-0.403c-10.137,7.049-10.393,18.664-0.564,25.941   c9.829,7.284,26.022,7.458,36.159,0.416C288.732,67.578,288.987,55.963,279.159,48.686z"/>
                                    <path className="st0" d="M220.59,82.024c-9.834-7.27-26.028-7.458-36.172-0.403c-10.15,7.049-10.406,18.664-0.571,25.941   c9.829,7.284,26.022,7.458,36.166,0.416C230.151,100.916,230.412,89.302,220.59,82.024z"/>
                                    <path className="st0" d="M267.437,184.754c-9.828-7.277-26.015-7.459-36.159-0.41c-10.15,7.056-10.405,18.671-0.577,25.947   c9.828,7.284,26.021,7.459,36.172,0.41C277.01,203.645,277.265,192.031,267.437,184.754z"/>
                                    <path className="st0" d="M386.385,113.564c-9.828-7.271-26.021-7.458-36.158-0.403c-10.151,7.049-10.406,18.664-0.577,25.941   c9.828,7.284,26.02,7.458,36.172,0.416C395.959,132.456,396.214,120.842,386.385,113.564z"/>
                                    <path className="st0" d="M327.817,146.903c-9.829-7.27-26.022-7.458-36.172-0.403c-10.137,7.049-10.392,18.664-0.564,25.941   c9.828,7.284,26.021,7.465,36.158,0.416C337.391,165.795,337.646,154.188,327.817,146.903z"/>
                                    <path className="st0" d="M89.289,248.303c11.158,6.083,20.194,1.961,20.194-9.19c0-11.158-9.036-25.128-20.194-31.21   c-11.157-6.083-20.207-1.967-20.207,9.19C69.081,228.244,78.131,242.221,89.289,248.303z"/>
                                    <path className="st0" d="M202.061,309.771c11.158,6.082,20.208,1.967,20.208-9.184c0-11.157-9.05-25.135-20.208-31.217   c-11.15-6.076-20.194-1.961-20.194,9.198C181.867,289.719,190.911,303.689,202.061,309.771z"/>
                                    <path className="st0" d="M89.289,361.082c11.158,6.076,20.194,1.967,20.194-9.19c0-11.158-9.036-25.129-20.194-31.21   c-11.157-6.083-20.207-1.968-20.207,9.19C69.081,341.029,78.131,355,89.289,361.082z"/>
                                    <path className="st0" d="M202.061,422.55c11.158,6.082,20.208,1.967,20.208-9.191c0-11.151-9.05-25.128-20.208-31.21   c-11.15-6.076-20.194-1.961-20.194,9.19C181.867,402.497,190.911,416.468,202.061,422.55z"/>
                                    <path className="st0" d="M145.675,335.424c11.158,6.082,20.201,1.967,20.201-9.191c0-11.151-9.044-25.128-20.201-31.204   c-11.158-6.082-20.201-1.967-20.201,9.185C125.474,315.37,134.517,329.341,145.675,335.424z"/>
                                    <path className="st0" d="M418.341,207.902c-11.158,6.082-20.208,20.053-20.208,31.21c0,11.151,9.05,15.273,20.208,9.19   c11.144-6.082,20.194-20.059,20.194-31.21C438.535,205.935,429.486,201.819,418.341,207.902z"/>
                                    <path className="st0" d="M305.555,382.149c-11.158,6.082-20.194,20.059-20.194,31.21c0,11.158,9.036,15.273,20.194,9.191   c11.158-6.082,20.194-20.053,20.194-31.211C325.749,380.188,316.714,376.074,305.555,382.149z"/>
                                    <path className="st0" d="M361.948,295.028c-11.158,6.076-20.207,20.053-20.207,31.204c0,11.158,9.05,15.273,20.207,9.191   c11.158-6.083,20.194-20.053,20.194-31.21C382.142,293.062,373.106,288.947,361.948,295.028z"/>
                                </g>
                            </svg>
                        </button>
                    </DynamicTooltip>
                </div>
                <div className="InputFields">
                    <IconUser className='icon'/>
                    <input
                    value={username}
                    onInput={e => handleUsernameInput(e)}
                    placeholder='username'
                    name="username"
                    autoComplete='off'  
                    required
                    />
                    <div className="InputFieldBottomLine"></div>
                    {!isUsernameValid && username.trim() !== "" && (
                        <span id="usernameRules" className="input-error-message" style={{color: "red", fontSize: "12px"}}>
                            Username must be 6–20 characters and can only contain letters and numbers
                        </span>
                    )}
                </div>
            </div>
            <GenderInput 
                gender={gender}
                setGender={setGender}
            />
            {/* <div className='flex flex-col gap-4 w-full' style={{ marginTop: "20px" }}>
                <button type="submit" className={`sign-up-button ${!isUsernameValid && 'disabled'}`}>Finish sign up</button>
                <button onClick={() => setStep(2)} type="button" className={`w-[100%] flex justify-center items-center rounded-full border p-2 hover:bg-slate-200 transition-all`} >
                    Back
                </button>
            </div> */}
        </>
    )
}

export default UsernameInput