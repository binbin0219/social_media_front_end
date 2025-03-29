"use client"
import React from 'react'
import './signup.css'

const page = () => {

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

    async function checkAccountNameValidity(accountName: string): Promise<boolean> {
        if (accountName.length < 6) {
            displayMessage("accountNameRules");
            return false;
        }
    
        if (!/[a-zA-Z]/.test(accountName)) {
            displayMessage("accountNameRules");
            return false;
        }
    
        if (!/^[a-zA-Z]/.test(accountName)) {
            displayMessage("accountNameRules");
            return false;
        }
    
        if (!/\d/.test(accountName)) {
            displayMessage("accountNameRules");
            return false;
        }
    
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]/.test(accountName)) {
            displayMessage("accountNameRules");
            return false;
        }
    
        return true;
    }
    

    function isPasswordValid() {

        var password = document.querySelector(".InputFields input[name='password']").value;
        var passwordRulesDiaplayer = document.querySelector("#passwordRules");
        var valid = true;
        console.log(containsUppercase(password));

        if (containsUppercase(password) && password.length > 6 && /\d/.test(password) && !/^\s*$/.test(password) && /[\W_]/.test(password)) {
            valid = true;
        } else {
            displayMessage("passwordRules");
            valid = false;
        }

        return valid;
    }

    function containsUppercase(str) {
        return /[A-Z]/.test(str);
    }

    const hideAllInputErrorMessages = () => {
        const inputErrorMessages = document.querySelectorAll(".input-error-message");
        inputErrorMessages.forEach((errorMessage) => {
            errorMessage.classList.add("hidden");
        });
    }

    function displayMessage(name: string) {
        const accountNameExistedDisplayer = (document.querySelector("#usernameExisted") as HTMLSpanElement).classList;
        const accountNameRulesDisplayer = (document.querySelector("#accountNameRules") as HTMLSpanElement).classList;
        const passwordRulesDiaplayer = (document.querySelector("#passwordRules") as HTMLSpanElement).classList;
        const usernameRules = (document.querySelector("#usernameRules") as HTMLSpanElement).classList;
        const firstNameRules = (document.querySelector("#firstNameRules") as HTMLSpanElement).classList;
        const lastNameRules = (document.querySelector("#lastNameRules") as HTMLSpanElement).classList;
        switch (name) {
            case "usernameExist":
                accountNameExistedDisplayer.remove("hidden");
                break;

            case "accountNameRules":
                accountNameRulesDisplayer.remove("hidden");
                break;

            case "passwordRules":
                passwordRulesDiaplayer.remove("hidden");
                break;

            case "usernameRules":
                usernameRules.remove("hidden");
                break;

            case "firstName":
                firstNameRules.remove("hidden");
                break;

            case "lastName":
                lastNameRules.remove("hidden");
                break;

            default:
                break;
        }
    }

    const signupHandler = async (event : React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: (form.elements.namedItem('first_name_input') as HTMLInputElement).value,
                    lastName: (form.elements.namedItem('last_name_input') as HTMLInputElement).value,
                    username: (form.elements.namedItem('username') as HTMLInputElement).value,
                    accountName: (form.elements.namedItem('accountName') as HTMLInputElement).value,
                    password: (form.elements.namedItem('password') as HTMLInputElement).value,
                    gender: (form.elements.namedItem('gender') as HTMLInputElement).value
                })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Signup failed:', errorData);
                hideAllInputErrorMessages();
                if(errorData.errors.password) displayMessage("passwordRules");
                if(errorData.errors.accountName) displayMessage("accountNameRules");
                if(errorData.errors.username) displayMessage("usernameRules");
                return;
            }

            window.location.href = '/signup/success';
        } catch (error) {
            console.error('Network error:', error);
        }
    }

    return (
        <>
        <link
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet" />
        <link rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            
        <div className="sign-up">
            <h1 className="font-bold text-4xl">Sign up</h1>
            <form onSubmit={signupHandler} className="sign-up-form" action={process.env.NEXT_PUBLIC_API_URL + '/api/auth/signup'} method="POST">
                <div className="w-full flex justify-between">
                    <div className="flex flex-col w-[45%]">
                        <label htmlFor="firstName">First Name</label>
                        <div className="InputFields">
                            <span className="material-symbols-outlined icon">first_page</span>
                            <input id="first_name_input" min={2} maxLength={20} name="firstName" required/>
                            <div className="InputFieldBottomLine"></div>
                            <span id="firstNameRules" className="input-error-message hidden" style={{color: "red", fontSize: "12px"}}>
                                First name must be between 2 and 20 characters
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col w-[45%]">
                        <label htmlFor="lastName">Last Name</label>
                        <div className="InputFields">
                            <span className="material-symbols-outlined icon">last_page</span>
                            <input id="last_name_input" min={2} maxLength={20} name="lastName" required/>
                            <div className="InputFieldBottomLine"></div>
                            <span id="lastNameRules" className="input-error-message hidden" style={{color: "red", fontSize: "12px"}}>
                                Last name must be between 2 and 20 characters
                            </span>
                        </div>
                    </div>
                </div>
                <label>Username</label>
                <div className="InputFields">
                    <span className="material-symbols-outlined icon"> person</span>
                    <input name="username" required/>
                    <div className="InputFieldBottomLine"></div>
                    <span id="usernameExisted" className="hidden" style={{color: "red", fontSize: "12px"}}>Username Existed</span>
                    <span id="usernameRules" className="input-error-message hidden" style={{color: "red", fontSize: "12px"}}>
                        Username must follow these rules<br />
                        *Username cannot contain symbol or space<br />
                        *Username must contain between 6 and 20 characters
                    </span>
                </div>
                <label>Account Name</label>
                <div className="InputFields">
                    <span className="material-symbols-outlined icon"> person</span>
                    <input maxLength={20} minLength={6} name="accountName" required/>
                    <div className="InputFieldBottomLine"></div>
                    <span id="accountNameRules" className="input-error-message hidden" style={{color: "red", fontSize: "12px"}}>
                        Account Name must follow these rules<br />
                        *Account Name must contain at least one alphabet character<br />
                        *Account Name cannot contain symbol or space<br />
                        *Account Name must start with alphabet character<br />
                        *Account Name must contain more than 6 characters
                    </span>
                </div>
                <label>Password</label>
                <div className="InputFields">
                    <span className="material-symbols-outlined icon"> lock</span>
                    <input name="password" type="password" required/>
                    <div className="InputFieldBottomLine"></div>
                    <span id="passwordRules" className="input-error-message hidden" style={{color: "red", fontSize: "12px"}}>
                        Password must follow these rules<br/>
                        *Must contains at least one uppercase character<br/>
                        *Must use number alphabet combination<br/>
                        *Not less than 6 chatracters<br/>
                        *Contains at least one special character
                    </span>
                </div>
                <label>Gender</label>
                <div style={{display: "flex", justifyContent: "space-around" ,marginTop: "10px"}}>
                    <div className="gender-checkbox" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2986cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-mars">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 14m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
                            <path d="M19 5l-5.4 5.4" />
                            <path d="M19 5l-5 0" />
                            <path d="M19 5l0 5" />
                        </svg>
                        <p style={{margin: 0}}>Male</p>
                        <input defaultChecked type="radio" name="gender" value="male" required/>
                    </div>
                    <div className="gender-checkbox" style={{display: "flex", flexDirection: "column", gap: "10px", alignItems: "center"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c90076" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-venus">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 9m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
                            <path d="M12 14l0 7" />
                            <path d="M9 18l6 0" />
                        </svg>
                        <p style={{ margin: 0 }}>Female</p>
                        <input type="radio" name="gender" value="female" required/>
                    </div>
                </div>
                <button type="submit" className="sign-up-button" style={{ marginTop: "30px" }}>Sign up</button>
            </form>

            <div className="alreadyHaveAnAccount">
                <p>Already have an account?</p>
                <a href="/login">Go to login &gt;&gt;</a>
            </div>
        </div>
        </>
    )
}

export default page