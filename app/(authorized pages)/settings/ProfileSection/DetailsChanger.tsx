"use client"
import { PhoneNumber, User } from '@/lib/models/user'
import { IconGenderFemale, IconGenderMale } from '@tabler/icons-react';
import React from 'react'
import OccupationSelector from './OccupationSelector';
import PhoneNumberInput from './PhoneNumberInput';
import InputField from '@/components/InputField/InputField';
import CountryRegionSelector from '@/components/CountryRegionSelector';

type Props = {
    user: Partial<User>;
    updateUserData: (field: string, value: unknown) => void;
}

const DetailsChanger = ({user, updateUserData}: Props) => {
    return (
        <div className="flex flex-col mt-8 gap-5">
            <div>
                <label htmlFor="username_input" className="block font-bold">Username</label>
                <InputField
                value= {user?.username ?? ""}
                setter={(value: string) => updateUserData("username", value)}
                placeholder="username"
                type="text"
                name="username"
                min={6}
                max={20}
                disableSpace
                allowedTypes={['character', 'number']}
                />
            </div>
            <div className="flex w-full justify-between">
                <div className="w-[45%]">
                    <label htmlFor="first_name_input" className="block font-bold">First name</label>
                    <InputField
                    value= {user?.firstName ?? ""}
                    setter={(value: string) => updateUserData("firstName", value)}
                    placeholder="First name"
                    type="text"
                    name="firstName"
                    min={0}
                    max={20}
                    allowedTypes={['character', 'space']}
                    />
                </div>
                <div className="w-[45%]">
                    <label htmlFor="last_name_input" className="block font-bold">Last name</label>
                    <InputField
                    value= {user?.lastName ?? ""}
                    setter={(value: string) => updateUserData("lastName", value)}
                    placeholder="Last name"
                    type="text"
                    name="lastName"
                    min={0}
                    max={20}
                    allowedTypes={['character', 'space']}
                    />
                </div>
            </div>
            <div>
                <label className="block font-bold">Gender</label>
                <div id="gender_radio_container" data-gender={user?.gender} className="gender-radio-container flex w-full justify-between mt-2">
                    <div className="w-[45%]">
                        <label htmlFor="gender_radio_male" className="gender-radio-male px-3 py-2 border-2 border-sky-300 rounded-lg bg-sky-100 text-sky-600 hover:bg-sky-200 cursor-pointer inline-flex w-full">
                            <IconGenderMale />
                            Male
                            <input id="gender_radio_male" onChange={(e) => updateUserData("gender", e.target.checked ? "male" : "female")} type="radio" name="gender" value="Male" className="gender-radio hidden"/>
                        </label>
                    </div>
                    <div className="w-[45%]">
                        <label htmlFor="gender_radio_female" className="gender-radio-female px-3 py-2 border-2 border-pink-300 rounded-lg bg-pink-100 text-pink-600 inline-flex w-full cursor-pointer hover:opacity-100 hover:bg-pink-200">
                            <IconGenderFemale/>
                            Female
                            <input id="gender_radio_female" onChange={(e) => updateUserData("gender", e.target.checked ? "female" : "male")} type="radio" name="gender" value="Female" className="gender-radio hidden"/>
                        </label>
                    </div>
                </div>
            </div>
            <CountryRegionSelector
            selectedCountry={user?.country ?? ""}
            selectedRegion={user?.region ?? ""}
            onCountryChange={(country) => {
                updateUserData("country", country);
                updateUserData("region", "");
            }}
            onRegionChange={(region) => updateUserData("region", region)}
            />
            <div className="flex w-full justify-between">
                <div className="w-[45%]">
                    <label htmlFor="relationship_status_selector" className="block font-bold">Relationship Status</label>
                    <select onChange={(e) => updateUserData("relationshipStatus", e.target.value)} value={user?.relationshipStatus ?? ""} id="relationship_status_selector" name="relationshipStatus" className="px-3 py-2 border-2 border-slate-200 rounded-lg w-full">
                        <option data-index="0" value="">Not Specified</option>
                        <option data-index="1" value="Single">Single</option>
                        <option data-index="2" value="Married">Married</option>
                        <option data-index="3" value="Divorced">Divorced</option>
                        <option data-index="4" value="Widowed">Widowed</option>
                        <option data-index="5" value="Separated">Separated</option>
                        <option data-index="6" value="Looking For Relationship">Other</option>
                        <option data-index="7" value="It's Complicated">It&apos;s Complicated</option>
                        <option data-index="8" value="Forever Alone">Forever Alone</option>
                    </select>
                </div>
                <div className="w-[45%]">
                    <label htmlFor="occupation_selector" className="block font-bold">Occupation</label>
                    <OccupationSelector 
                        setterFunction={(value: string) => updateUserData("occupation", value)} 
                        defaultValue={user?.occupation}
                    />
                </div>
            </div>
            <div>
                <label htmlFor="phone_number_input" className="block font-bold">Phone Number</label>
                <PhoneNumberInput 
                    phoneNumber={user?.phoneNumber} 
                    setterFunction={(value: PhoneNumber) => updateUserData("phoneNumber", value)} 
                />
            </div>
        </div>
    )
}

export default DetailsChanger