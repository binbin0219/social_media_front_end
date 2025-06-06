import { fetchProfileUserFromServer } from '@/lib/main';
import React from 'react'
import PageClient from './PageClient';

const page = async ({params} : {params: Promise<{userId: number}>}) => {
    const {userId} = await params;
    const result = await fetchProfileUserFromServer(userId);

    return (
        <PageClient profileUser={result!.user}/>
    )
}

export const dynamic = 'force-dynamic';
export default page