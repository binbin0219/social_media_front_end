"use client"
import React from 'react'

const SectionToggles = () => {
    return (
        <div 
        className="
            mt-[50px]
            border-e-0 w-full p-8 m-0
            md:flex md:flex-col md:gap-2 md:p-2 md:pe-[90px] md:border-e-2 md:self-start md:w-fit
        ">
            <h4 className="font-extrabold text-4xl p-3">Settings</h4>
            <ul className="flex flex-col gap-2">
                <li>
                    <button type="button" 
                    className="
                        text-left rounded-lg hover:bg-slate-100 font-medium bg-slate-300 p-3
                        md:w-[200px] 
                        w-full
                    ">
                        Public profile
                    </button>
                </li>
                <li>
                    <button type="button" 
                    className="
                        text-left rounded-lg hover:bg-slate-100 font-medium p-3 cursor-not-allowed line-through
                        md:w-[200px] 
                        w-full
                    ">
                        Account Settings
                    </button>
                </li>
                <li>
                    <button type="button" 
                    className="
                        text-left rounded-lg hover:bg-slate-100 font-medium p-3 cursor-not-allowed line-through
                        md:w-[200px] 
                        w-full
                    ">
                        Notifucations
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default SectionToggles