"use client"
import React from 'react'
import SpinLoader from '../SpinLoader/SpinLoader'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const ConfirmationDialog = () => {
    const confDialogState = useSelector((state: RootState) => state.confDialog);

    return (
        <div id="conf_dialog" className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-start pt-10 ${!confDialogState.isOpen && 'hidden'}`} style={{zIndex: "9999"}}>
            <div className="bg-white min-w-[400px] max-w-[95%] w-fit min-h-[200px] h-fit rounded-lg flex flex-col justify-center items-start gap-2 p-5">
                <h4 className="conf-dialog-header text-2xl font-bold">{confDialogState.header}</h4>
                <div className="conf-dialog-body text-lg w-full max-w-[100%] overflow-x-auto">{confDialogState.body}</div>
                <div className="flex gap-5 w-full justify-end mt-7">
                    <button onClick={() => {}} className="bg-white border-black border-2 text-black px-3 py-2 rounded-lg font-bold hover:bg-black hover:text-white">Cancel</button>
                    <button onClick={() => confDialogState.onConfirm?.()} className="conf-dialog-action bg-red-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-red-800 flex gap-2 justify-center items-center">
                        <div id='conf-action-loader' className={`${!confDialogState.isLoading && 'hidden'}`}><SpinLoader width={24} color='white'/></div>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationDialog