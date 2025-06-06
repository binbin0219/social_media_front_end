import { IconPhotoPlus, IconX } from '@tabler/icons-react'
// import Image from 'next/image'
import React from 'react'

const InputImagePreview = () => {
    return (
        <div className='flex gap-2 mb-2'>
            <button className='h-[55px] w-[55px] bg-slate-200 hover:bg-slate-300 rounded-lg flex justify-center items-center'>
                <IconPhotoPlus/>
            </button>
            <div className='relative'>
                {/* <Image
                    alt='Chat image attachment preview' 
                    className='rounded-lg'
                    src="https://www.mdxblog.io/images/posts/how-to-use-images/grass-tree-sky.jpg"
                    style={{
                        height: '55px',
                        width: 'auto'
                    }}
                    fill
                /> */}
                <button 
                type='button' 
                className='rounded-full p-1 absolute top-0 end-0 translate-x-2 -translate-y-2 bg-stone-600 hover:bg-stone-800 text-white'
                >
                    <IconX height={18} width={18}/>
                </button>
            </div>
        </div>
    )
}

export default InputImagePreview