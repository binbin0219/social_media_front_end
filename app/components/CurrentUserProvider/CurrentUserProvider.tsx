"use client";

import { User } from "@/lib/models/user";

type Props = {
    children: React.ReactNode;
    currentUser: User;
};

const CurrentUserProvider = ({ children , currentUser}: Props) => {

    return (
        {children}
    );
};


export default CurrentUserProvider;
