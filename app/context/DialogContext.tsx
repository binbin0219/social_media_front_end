"use client"
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import { createContext, useContext, useState } from "react";

export type DialogState = {
    isOpen: boolean;
    isLoading: boolean;
    header?: React.ReactNode | string;
    body?: React.ReactNode | string;
    actionText?: string;
    onConfirm?: () => Promise<void> | void;
}

type DialogContextType = {
    open: (
        header?: React.ReactNode | string,
        body?: React.ReactNode | string,
        actionText?: string,
        onConfirm?: () => void
    ) => void
    setLoading: (isLoading: boolean) => void;
    close: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [dialogState, setDialogState] = useState<DialogState>({
        isOpen: false,
        isLoading: false
    });

    const open = (
        header?: React.ReactNode | string,
        body?: React.ReactNode | string,
        actionText?: string,
        onConfirm?: () => void
    ) => {
        setDialogState({
            isOpen: true,
            isLoading: false,
            header,
            body,
            actionText: actionText ?? "Confirm",
            onConfirm
        });
        document.body.style.overflow = 'hidden';
    }

    const setLoading = (isLoading: boolean) => {
        setDialogState(prev => ({
            ...prev,
            isLoading
        }))
    }

    const close = () => {
        setDialogState({
            isOpen: false,
            isLoading: false
        });
        document.body.style.overflow = 'auto';
    }

    const handleClose = () => {
        if(dialogState.isLoading) {
            throw new Error("Failed to close conformation dialog: it is in loading state");
        };

        close();
    }

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await dialogState.onConfirm?.();
        } catch (e) {
            console.error("Error while executing dialog callback : " + e);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <DialogContext.Provider value={{ open, setLoading, close }}>
            <div id="conf_dialog" className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-start pt-10 overflow-y-auto ${!dialogState.isOpen && 'hidden'}`} style={{zIndex: "1010"}}>
                <div className="bg-white min-w-[400px] max-w-[95%] w-fit min-h-[200px] h-fit rounded-lg flex flex-col justify-center items-start gap-2 p-5">
                    <h4 className="conf-dialog-header text-2xl font-bold">{dialogState.header}</h4>
                    <div className="conf-dialog-body text-lg w-full max-w-[100%]">{dialogState.body}</div>
                    {dialogState.onConfirm && (
                        <div className="flex gap-5 w-full justify-end mt-7">
                            <button onClick={() => handleClose()} className="bg-white border-black border-2 text-black px-3 py-2 rounded-lg font-bold hover:bg-black hover:text-white">Cancel</button>
                            <button onClick={() => handleConfirm()} className="conf-dialog-action bg-red-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-red-800 flex gap-2 justify-center items-center">
                                <div id='conf-action-loader' className={`${!dialogState.isLoading && 'hidden'}`}><SpinLoader width={24} color='white'/></div>
                                {dialogState.actionText}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {children}
        </DialogContext.Provider>
    )
}

export const useDialogContext = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialogContext must be used within a DialogProvider');
    }
    return context;
};
