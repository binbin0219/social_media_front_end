import React from 'react'
import PageClient from './PageClient';
import { userService } from '@/lib/services/user';

const page = async ({params} : {params: Promise<{userId: number}>}) => {
    const {userId} = await params;
    const result = await userService.fetchProfileUserFromServer(userId);

    return (
        <PageClient profileUser={result!.user}/>
    )
}

export const dynamic = 'force-dynamic';
export default page