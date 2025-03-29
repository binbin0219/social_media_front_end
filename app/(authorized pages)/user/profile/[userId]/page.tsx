import { fetchUserDataFromServer } from '@/lib/main';
import React from 'react'
import PageClient from './PageClient';

const page = async ({params} : {params: Promise<{userId: number}>}) => {
    const {userId} = await params;
    const {user} = await fetchUserDataFromServer(userId);

    return (
        <PageClient profileUser={user}/>
    )
}

export default page