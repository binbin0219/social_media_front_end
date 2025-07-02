"use client"
import React from 'react'
import { useSelector } from 'react-redux'
import Toast from '../Toast/Toast';
import { RootState } from '@/redux/store';
import { ToastType } from '@/redux/slices/toastSlice';

const ToastContainer = () => {
    const toast = useSelector((state: RootState) => state.toast);
    return (
        <div id="toastContainer" className='fixed bottom-0 end-0 me-3 mb-4 flex gap-3 flex-col-reverse' style={{zIndex: 9999}}>
            {toast.map((toast: ToastType, index: number) => <Toast key={index} type={toast.type} message={toast.message} />)}
        </div>
    )
}

export default ToastContainer