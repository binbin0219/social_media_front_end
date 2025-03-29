"use client";
import { User } from "@/lib/models/user";
import { createContext, useContext } from "react";

interface UserContextType {
    currentUser: User | null;
}

const CurrentUserContext = createContext<UserContextType>({ currentUser: null });

export const CurrentUserProvider = ({ currentUser, children }: { currentUser: User; children: React.ReactNode }) => {
    return <CurrentUserContext.Provider value={{ currentUser }}>{children}</CurrentUserContext.Provider>;
};

export const useCurrentUser = () => useContext(CurrentUserContext);
