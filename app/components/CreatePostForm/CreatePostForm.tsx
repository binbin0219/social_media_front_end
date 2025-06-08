"use client"
import React, { useRef, useState } from 'react'
import UserIcon from '../UserIcon/UserIcon'
import './style.css'
import { useDispatch, useSelector } from 'react-redux'
import { addPost } from '@/redux/slices/postSlice'
import { addToast } from '@/redux/slices/toastSlice'
import { RootState } from '@/redux/store'
import UserProfileLink from '../Link/UserProfileLink'
import { disableBtn, enableBtn } from '@/lib/utils/client'


const CreatePostForm = () => {
    const currentUser = useSelector((state: RootState) => state.currentUser);
    const dispatch = useDispatch();
    const createPostBtnContainer = useRef<HTMLDivElement>(null);
    const createPostBtnRef = useRef<HTMLButtonElement>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [form, setForm] = React.useState<{title: string, content: string}>({
        title: '',
        content: ''
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            disableBtn(createPostBtnRef)
            const formData = new FormData(event.currentTarget);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/create`, { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                body: JSON.stringify({
                    title: formData.get('title'),
                    content: formData.get('content')
                })
            });
            if (!response.ok) {
                return;
            }
            const createdPost = await response.json();
            createdPost.user = currentUser;
            createdPost.isNew = true;
            dispatch(addPost(createdPost));
            dispatch(addToast({
                type: 'success',
                message: 'Post created successfully'
            }));
            setForm({title: '', content: ''});
            setIsFormOpen(false);
        } catch (error) {
            console.error(error);
            dispatch(addToast({
                type: 'error',
                message: 'Failed to add post !'
            }));
        } finally {
            enableBtn(createPostBtnRef);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setForm(prevForm => ({
            ...prevForm,
            title: newTitle.slice(0, 50),
        }));
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setForm(prevForm => ({
            ...prevForm,
            content: newContent.slice(0, 200),
        }));
    };
    
    return (
        <form id="create_post_form" onSubmit={handleSubmit} className={`create-post ${isFormOpen ? 'h-[475px]' : 'h-[105px]'} overflow-y-hidden relative`} action="/api/post/create" method="post" style={{transition: "all .3s linear"}}>
            <div className="flex gap-4 items-center mb-6 w-full cursor-pointer">
                <UserIcon userId={currentUser!.id} userAvatar={ currentUser!.avatar } />
                <div className="flex flex-col">
                    <UserProfileLink userId={currentUser!.id}>
                        <h4 className="font-bold hover:underline">Welcome! {currentUser && currentUser.username}</h4>
                    </UserProfileLink>
                    <h6 className="text-sm">Have something to share?</h6>
                </div>
            </div>
            <div className="pb-[60px]">
                <div className="flex flex-col w-full">
                    <div className="flex gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-signature">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 17c3.333 -3.333 5 -6 5 -8c0 -3 -1 -3 -2 -3s-2.032 1.085 -2 3c.034 2.048 1.658 4.877 2.5 6c1.5 2 2.5 2.5 3.5 1l2 -3c.333 2.667 1.333 4 3 4c.53 0 2.639 -2 3 -2c.517 0 1.517 .667 3 2" />
                        </svg>
                        <h6 className="font-bold">Title</h6>
                    </div>
                    <input value={form.title} onChange={(e) => handleTitleChange(e)} className="w-full" name="title" placeholder="Got something to say?" type="text" required/>
                    <span className='text-xs text-slate-500 self-end mt-1'>{form.title.length} / 50</span>
                </div>
                {/* <input type="hidden" name="userId" value={currentUser && currentUser.id} /> */}
                <div className="flex flex-col w-full gap-2 mt-2">
                    <div className="flex gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-article">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                            <path d="M7 8h10" />
                            <path d="M7 12h10" />
                            <path d="M7 16h10" />
                        </svg>
                        <h6 className="font-bold">Content</h6>
                    </div>
                    <textarea value={form.content} onChange={(e) => handleContentChange(e)} name="content" rows={5} required placeholder="Write something..."></textarea>
                    <span className='text-xs text-slate-500 self-end mt-1'>{form.content.length} / 200</span>
                </div>
            </div>
            <div className="flex ms-auto gap-5 mt-4 rounded-full p-3 items-center w-fit border-2 bg-green-200 border-green-400 absolute bottom-[20px] end-[20px]">
                <button id="show_create_post_btn" type="button" className={`flex gap-2 items-center ${isFormOpen && 'hidden'}`}
                    onClick={() => setIsFormOpen(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#269950" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-plus">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 5l0 14" />
                        <path d="M5 12l14 0" />
                    </svg>
                </button>
                <div id="create-post-btn-container" ref={createPostBtnContainer} className={`flex gap-5 ${isFormOpen ? '' : 'hidden'}`}>
                    <button ref={createPostBtnRef} type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-square-rounded-check">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M9 12l2 2l4 -4" />
                            <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
                        </svg>
                    </button>
                    <button disabled type="button" className="opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-photo-plus">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M15 8h.01" />
                            <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5" />
                            <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4" />
                            <path d="M14 14l1 -1c.67 -.644 1.45 -.824 2.182 -.54" />
                            <path d="M16 19h6" />
                            <path d="M19 16v6" />
                        </svg>
                    </button>
                    <button type="button" 
                    onClick={() => setIsFormOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M18 6l-12 12" />
                            <path d="M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </form>
    )
}

export default CreatePostForm