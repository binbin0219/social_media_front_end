"use client"
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Toast from '../Toast/Toast';

const ToastContainer = () => {
    const toast = useSelector((state: any) => state.toast);
    return (
        <div id="toastContainer" className='fixed bottom-0 end-0 me-3 mb-4 flex gap-3 flex-col-reverse' style={{zIndex: 1000}}>
            {toast.map((toast: any, index: number) => <Toast key={index} type={toast.type} message={toast.message} />)}
        </div>
    )
}

export default ToastContainer