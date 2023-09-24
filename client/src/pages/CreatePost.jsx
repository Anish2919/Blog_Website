import React, { useState } from 'react';
import { useForm } from 'react-hook-form';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import {  postData} from '../services/axios.service';
import { toastPromise } from '../services/tostify.service';

const CreatePost = () => {
    // USE FORM HOOK FROM REACT-HOOK-FORM 
    const {register, formState:{errors}, reset, handleSubmit} = useForm();  

    const [content, setContent] = useState(''); 

    // handle create button 
    const createPost = async (data) => {
        const {title, summary, file} = data; 
        const formData = new FormData();
        formData.append('title', title);
        formData.append('summary', summary);
        formData.append('file', file[0]);
        formData.append('content', content);

        const promise = new Promise(async (resolve, reject) => {
            const response = await postData('user/createpost', formData, 'multi'); 
            if(response.status===201) {
                resolve(response.data.msg); 
            } 
            if(response===400) {
                reject(response.data.msg); 
            } 
            reject('Something went wrong'); 
        }); 

        toastPromise('creating post... please wait', promise).then(() => {
            reset(); 
            setContent(''); 
        }); 
    }

  return (
    <div>
      <form enctype="multipart/form-data" className='loginForm' onSubmit={handleSubmit(createPost)}>
        <h1>Create new post</h1>
        <div className="" >
            <input type="text" placeholder='title' {...register('title', {required:'Title is required'})}  />
            {errors.title && (<span className='block px-3 font-semibold my-3 text-muted text-sm  text-red-500 '>{errors.title.message}</span>)}
        </div>
        <div className="">
            <input type="text" placeholder='summary' {...register('summary', {required:'Summary is requried!'})}  />
            {errors.summary && (<span className='block px-3 font-semibold my-3 text-muted text-sm  text-red-500 '>
                {errors.summary.message}
            </span>)}
        </div>
        <div className="">
            <input type="file" placeholder='Image File'
                {...register('file', {
                    required:'Image is required', 
                    validate:(value) => {
                        // check if the selected file is an image. 
                        const acceptedFormat = ['image/jpeg', 'image/png', 'image/gif']; 
                        return acceptedFormat.includes(value[0]?.type) || 'Invalid file type! Please select an image file.'; 
                    }
                })} />
                 {errors.image && (<span className='block px-3 font-semibold my-3 text-muted text-sm  text-red-500 '>
                {errors.image.message}
            </span>)}
        </div>
        <div className="">
            <ReactQuill name='content' value={content} onChange={(value) => {
                setContent(value); 
            }} />
        </div>
        <button type='submit' className="btn my-3">Create</button>
      </form>
    </div>
  );
}

export default CreatePost;
