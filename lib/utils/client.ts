import { RefObject } from "react";

export const disableBtn = (element: RefObject<HTMLButtonElement | null>) => {
    (element.current as HTMLButtonElement).classList.add('pointer-events-none');
}

export const enableBtn = (element: RefObject<HTMLButtonElement | null>) => {
    (element.current as HTMLButtonElement).classList.remove('pointer-events-none');
}