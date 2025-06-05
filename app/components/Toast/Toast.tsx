"use client"
import React, { useEffect } from 'react'
import './style.css'
import { ToastType } from '@/redux/slices/toastSlice';

const Toast = (props: ToastType) => {
    const toastRef = React.useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        setTimeout(() => {
            toastRef.current?.classList.add("slide-out");
            setTimeout(() => {
                toastRef.current?.remove();
            }, 300);
        }, 5000);
    }, []);

    const hideToast = () => {
        toastRef.current?.classList.add("slide-out");
        setTimeout(() => {
            toastRef.current?.remove();
        }, 300);
    }

    return (
        <div ref={toastRef} className="toast relative p-2 flex gap-3 items-center bg-white border rounded-lg shadow-lg w-[300px] overflow-x-hidden" style={{zIndex: "9999"}}>
            {props.type === "success" ? <div className="toast-sidebar absolute h-full w-[5px] bg-green-600 start-[-1px] top-0"></div> : null}
            {props.type === "error" ? <div className="toast-sidebar absolute h-full w-[5px] bg-red-600 start-[-1px] top-0"></div> : null}
            {props.type === "info" ? <div className="toast-sidebar absolute h-full w-[5px] bg-blue-600 start-[-1px] top-0"></div> : null}
            <div className="toast-icon">
                {props.type === "success" ? 
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="toast-icon icon icon-tabler icons-tabler-filled icon-tabler-circle-check fill-green-600">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
                </svg> 
                : null}
                {props.type === "error" ? 
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="toast-icon icon icon-tabler icons-tabler-filled icon-tabler-exclamation-circle fill-red-600">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-5 11.66a1 1 0 0 0 -1 1v.01a1 1 0 0 0 2 0v-.01a1 1 0 0 0 -1 -1m0 -7a1 1 0 0 0 -1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0 -1 -1" />
                </svg>
                : null}
                {props.type === "info" ? 
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="toast-icon icon icon-tabler icons-tabler-filled icon-tabler-info-circle fill-blue-600">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
                </svg>
                : null}
            </div>
            <div className="flex flex-col">
                <p className="toast-header font-bold">{props.type[0].toUpperCase() + props.type.slice(1)}</p>
                <p className="toast-body text-slate-600">{props.message}</p>
            </div>
            <svg onClick={() => hideToast()} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x absolute top-0 end-0 cursor-pointer hover:opacity-50 me-2 mt-2">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
            </svg>
        </div>
    )
}

export default Toast