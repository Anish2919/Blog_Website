import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteData, getData } from '../services/axios.service';
import PageNotFound from './PageNotFound';
import {formatISO9075} from 'date-fns'; 
import { UserContext } from '../context/UserState';

import EditIcon from '../assets/edit.svg'; 
import DeleteIcon from '../assets/delete.svg'; 
import { toast, ToastContainer } from 'react-toastify';
import { errorToast, successToast } from '../services/tostify.service';

const PostPage = () => {
  const {id} = useParams();
  const [postInfo, setPostInfo] = useState(null); 

  // getting userInfo state using useContext 
  const {userInfo} = useContext(UserContext); 

  // navigate 
  const navigate = useNavigate(); 
  
  useEffect(() => {
    getData(`user/post/${id}`).then(response => {
       if(response.status===200) {
        setPostInfo(response.data); 
       }
    })
  }, []); 

  // delete post 
  async function deletePost(postId) {
    const response = await deleteData(`user/post/${postId}`); 
    if(response.status === 200) {
      await successToast(response.data.msg); 
      navigate('/'); 
      return; 
    }  
    errorToast(response.data.msg); 
    return; 
  }

  // confirmation toast 
  const ConfirmationToast = ({postId}) => {
    return (
      <div className='h-fit text-xl '>
        <p className='mb-4 text-2xl'>Do you want to perform this task?</p>
        <button className='mx-3 px-2 bg-red-400 rounded-md text-white'
          onClick={() => {
            // Handle "Yes" action here
            // Perform the task
            console.log(postId); 
            deletePost(postId); 
            toast.dismiss(); // Close the toast
          }}
        >
          Yes
        </button>
        <button
          onClick={() => {
            toast.dismiss(); // Close the toast
          }}
        >
          No
        </button>
      </div>
    );
  };

  // show confirmation toast function 
  function showConfirmationToast(postId) {
    toast.info(<ConfirmationToast postId={postId} />, {
      position: 'top-center',
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      draggable: false,
      pauseOnHover: true,
      progress: undefined,
      closeButton: false,
    });
  };
  
  
  return (
    <>
      {/* showing post when available, otherwise, show loading text */}
      {!postInfo ? (
        <h3 className='text-3xl font-semibold'>Loading..</h3>
      ) : (
        <>
          <div className="post-page w-[80%] mx-auto">
            {/* Post Header */}
            <h1 className='text-center px-3 py-2 capitalize'>{postInfo.title} 
              <br/>
              <span className=' text-sm font-normal text-slate-400'>{formatISO9075(new Date(postInfo.createdAt))}</span>
              <br/> 
              <span className=' text-sm mx-3 font-semibold'> By {postInfo.author.username}</span>   
            </h1>

            

            {/* Showing edit button, if the user owns the post */}
            {userInfo.id === postInfo.author._id && (
              <>
                <div className='flex justify-between'>
                  <Link to={`/post/edit/${postInfo._id}`} className="w-fit bg-slate-950 text-white rounded-md px-3 py-2  mx-auto my-3 ">
                    <img className='inline me-3 h-6' src={EditIcon} alt="edit post" />
                    Edit this post
                  </Link>
                  <button onClick={() => showConfirmationToast(postInfo._id)}  className='w-fit bg-red-500 hover:bg-red-400 text-white rounded-md px-3 py-2 mx-auto my-3 '>
                    <img className='inline me-2 h-5' src={DeleteIcon} alt="delete post" />
                    Delete
                  </button>
                </div>
              </>   
                
            )}


            {/* post image */}
            <div className="image w-full h-[300px] overflow-hidden shadow-md rounded-md">
              <img className='w-full h-full object-cover object-center' src={`http://localhost:5500/${postInfo.cover}`} alt="Image" />
            </div> 
            {/* post content */}
            <div className='post_content'>
              <p className='py-2 px-2 text-sm md:text-xl mt-4' dangerouslySetInnerHTML={{__html:postInfo.content}}></p>
            </div>
          </div>
        </>
      )}
    </>
  );



}



export default PostPage;
