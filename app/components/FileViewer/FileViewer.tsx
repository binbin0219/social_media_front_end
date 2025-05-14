import React from 'react'
import TopBar from './components/TopBar'
import BottomBar from './components/BottomBar'

const FileViewer = () => {
    return (
        <div className='fixed w-full h-full top-0 start-0 bg-black bg-opacity-60 hidden' style={{zIndex: 1000}}>
            <TopBar/>
            <div className='w-full h-full flex items-center justify-center'>
                <img 
                className='max-w-[70%]'
                src="https://www.mdxblog.io/images/posts/how-to-use-images/grass-tree-sky.jpg"
                />
            </div>
            <BottomBar/>
        </div>
    )
}

export default FileViewer