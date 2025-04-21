import React from 'react'

type Props = {
    defaultValue?: string | null,
    setterFunction: (value: string) => void
}

const OccupationSelector = ({setterFunction, defaultValue} : Props) => {
    return (
        <select onChange={(e) => setterFunction(e.target.value)} value={defaultValue ?? ""} id="occupation_selector" name="occupation" className="px-3 py-2 border-2 border-slate-200 rounded-lg w-full">
            <option value="" data-index="0">Not Specified</option>

            <optgroup label="Technology & IT">
                <option value="Software Engineer" data-index="1">Software Engineer</option>
                <option value="Web Developer" data-index="2">Web Developer</option>
                <option value="Data Scientist" data-index="3">Data Scientist</option>
                <option value="IT Specialist" data-index="4">IT Specialist</option>
                <option value="Cybersecurity Analyst" data-index="5">Cybersecurity Analyst</option>
            </optgroup>

            <optgroup label="Healthcare">
                <option value="Doctor" data-index="6">Doctor</option>
                <option value="Nurse" data-index="7">Nurse</option>
                <option value="Pharmacist" data-index="8">Pharmacist</option>
                <option value="Therapist" data-index="9">Therapist</option>
                <option value="Medical Technician" data-index="10">Medical Technician</option>
            </optgroup>

            <optgroup label="Education">
                <option value="Teacher" data-index="11">Teacher</option>
                <option value="Professor" data-index="12">Professor</option>
                <option value="Academic Researcher" data-index="13">Academic Researcher</option>
                <option value="Tutor" data-index="14">Tutor</option>
            </optgroup>

            <optgroup label="Business & Finance">
                <option value="Accountant" data-index="15">Accountant</option>
                <option value="Financial Analyst" data-index="16">Financial Analyst</option>
                <option value="Marketing Specialist" data-index="17">Marketing Specialist</option>
                <option value="Entrepreneur" data-index="18">Entrepreneur</option>
                <option value="HR Manager" data-index="19">HR Manager</option>
            </optgroup>

            <optgroup label="Engineering & Construction">
                <option value="Civil Engineer" data-index="20">Civil Engineer</option>
                <option value="Mechanical Engineer" data-index="21">Mechanical Engineer</option>
                <option value="Architect" data-index="22">Architect</option>
                <option value="Electrician" data-index="23">Electrician</option>
                <option value="Construction Worker" data-index="24">Construction Worker</option>
            </optgroup>

            <optgroup label="Creative Arts & Media">
                <option value="Graphic Designer" data-index="25">Graphic Designer</option>
                <option value="Writer/Author" data-index="26">Writer/Author</option>
                <option value="Photographer" data-index="27">Photographer</option>
                <option value="Film Maker" data-index="28">Film Maker</option>
                <option value="Musician" data-index="29">Musician</option>
            </optgroup>

            <optgroup label="Skilled Trades">
                <option value="Chef" data-index="30">Chef</option>
                <option value="Carpenter" data-index="31">Carpenter</option>
                <option value="Plumber" data-index="32">Plumber</option>
                <option value="Mechanic" data-index="33">Mechanic</option>
            </optgroup>

            <optgroup label="Public Service & Law">
                <option value="Police Officer" data-index="34">Police Officer</option>
                <option value="Firefighter" data-index="35">Firefighter</option>
                <option value="Lawyer" data-index="36">Lawyer</option>
                <option value="Social Worker" data-index="37">Social Worker</option>
            </optgroup>

            <optgroup label="Science & Research">
                <option value="Biologist" data-index="38">Biologist</option>
                <option value="Physicist" data-index="39">Physicist</option>
                <option value="Chemist" data-index="40">Chemist</option>
                <option value="Researcher" data-index="41">Researcher</option>
            </optgroup>
        </select>
    )
}

export default OccupationSelector