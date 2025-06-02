import { Gender } from '@/lib/models/user'
import React from 'react'

type Props = {
    gender: Gender;
    setGender: (gender: Gender) => void;
};

const GenderInput = ({ gender, setGender }: Props) => {
    return (
        <div style={{ display: "flex", justifyContent: "space-around", marginTop: "10px" }}>
            <div className="gender-checkbox" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                {/* Male Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2986cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 14m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
                    <path d="M19 5l-5.4 5.4" />
                    <path d="M19 5l-5 0" />
                    <path d="M19 5l0 5" />
                </svg>
                <p style={{ margin: 0 }}>Male</p>
                <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={() => setGender("male")}
                required
                />
            </div>

            <div className="gender-checkbox" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                {/* Female Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c90076" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 9m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
                    <path d="M12 14l0 7" />
                    <path d="M9 18l6 0" />
                </svg>
                <p style={{ margin: 0 }}>Female</p>
                <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={() => setGender("female")}
                required
                />
            </div>
        </div>
    );
};


export default GenderInput