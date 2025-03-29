"use client"
import React from 'react'

const ConfirmationDialog = () => {
    return (
        <div id="conf_dialog" className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-start pt-10 hidden" style={{zIndex: "9999"}}>
            <div className="bg-white min-w-[400px] max-w-[95%] w-fit min-h-[200px] h-fit rounded-lg flex flex-col justify-center items-start gap-2 p-5">
                <h4 className="conf-dialog-header text-2xl font-bold"></h4>
                <div className="conf-dialog-body text-lg w-full max-w-[100%] overflow-x-auto"></div>
                <div className="flex gap-5 w-full justify-end mt-7">
                    <button onClick={() => confDialog()} className="bg-white border-black border-2 text-black px-3 py-2 rounded-lg font-bold hover:bg-black hover:text-white">Cancel</button>
                    <button className="conf-dialog-action bg-red-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-red-800">Confirm</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationDialog