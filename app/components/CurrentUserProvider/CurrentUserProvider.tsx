"use client";

import { User } from "@/lib/models/user";

type Props = {
    children: React.ReactNode;
    currentUser: User;
};

const CurrentUserProvider = ({ children }: Props) => {

    return (
        {children}
    );
};


export default CurrentUserProvider;
