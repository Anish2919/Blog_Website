import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import {  getData, postData} from '../services/axios.service';
import { toastPromise } from '../services/tostify.service';
import { useNavigate, useParams } from 'react-router-dom';

const EditPostPage = () => {
     // USE FORM HOOK FROM REACT-HOOK-FORM 
    const {register, formState:{errors}, reset, handleSubmit, setValue} = useForm();  

    // FOR CONTENT - using react-quill 
    const [content, setContent] = useState('');  

    // for navigation 
    const navigate = useNavigate(); 

    // getting id from params 
    const {id} = useParams(); 

    useEffect(() => {
        getData(`user/post/${id}`).then(response => {
            if(response.status === 200) {
                const data = response.data; 
                setValue('title', data.title); 
                setValue('summary', data.summary); 
                setContent(data.content);  
            }
        })
    }, []); 

    const editPost = async (data) => {
        const {title, summary, file} = data; 
        const formData = new FormData();
        formData.append('title', title);
        formData.append('summary', summary);
        formData.append('file', file[0]);
        formData.append('content', content);
        formData.append('id', id); 
        

        const updatePostPromise = new Promise( async (resolve, reject) => {
            const response = await postData(`user/post/${id}`, formData, 'multi');  
            if(response.status === 200) {
                resolve(response.data.msg); 
            } else {
                reject(response.data.msg); 
            }
        }) 

        toastPromise('Updating! Please wait...', updatePostPromise)
            .then(() => {
                navigate('/'); 
            }); 


    }
  return (
<>
      <form encType="multipart/form-data" className='loginForm' onSubmit={handleSubmit(editPost)}>
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
                    required: false, 
                    validate:(value) => {
                        if(!value[0]) {return true}
                         // check if the selected file is an image. 
                        const acceptedFormat = ['image/jpeg', 'image/png', 'image/gif']; 
                        return acceptedFormat.includes(value[0]?.type) || 'Invalid file type! Please select an image file.'; 
                    }
                })} />
            {errors.file && (<span className='block px-3 font-semibold my-3 text-muted text-sm  text-red-500'>
                {errors.file.message}
            </span>)}
        </div>
        <div className="">
            <ReactQuill name='content' value={content} onChange={(value) => {
                setContent(value); 
            }} />
        </div>
        <button type='submit' className="btn my-3">Update Post</button>
      </form>
    </>
  );
}

export default EditPostPage;
