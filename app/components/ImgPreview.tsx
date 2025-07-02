import { IconX } from '@tabler/icons-react'
import Image from 'next/image'
import React from 'react'

type Props = {
    src: string;
    alt?: string;
    height: number;
    width: number;
}

const ImgPreview = ({src, alt, height, width }: Props) => {
    return (
        <div className='relative'>
            <Image
                alt={alt ?? 'image'} 
                className='rounded-lg'
                src={src}
                style={{
                    height: `${height}px`,
                    width: `${width}px`
                }}
                height={height}
                width={width}
            />
            <button 
            type='button' 
            className='rounded-full p-1 absolute top-0 end-0 translate-x-2 -translate-y-2 bg-stone-600 hover:bg-stone-800 text-white'
            >
                <IconX height={18} width={18}/>
            </button>
        </div>
    )
}

export default ImgPreview