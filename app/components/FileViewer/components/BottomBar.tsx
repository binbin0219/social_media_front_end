import { IconX } from '@tabler/icons-react'
import React from 'react'

const BottomBar = () => {
    return (
        <div className='fixed bottom-0 start-0 flex justify-between w-full p-3 bg-black bg-opacity-40'>
            <div className='flex gap-4 items-center'>
                <button className='rounded-full p-2 hover:bg-black'>
                    <IconX color='white' width={28} height={28}/>
                </button>
                <p className='text-white'>Medias</p>
            </div>
            <div></div>
        </div>
    )
}

export default BottomBar