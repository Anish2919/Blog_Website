import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getData } from '../services/axios.service';
import PageNotFound from './PageNotFound';
import {formatISO9075} from 'date-fns'; 

const PostPage = () => {
  const {id} = useParams();
  const [postInfo, setPostInfo] = useState(null); 
  
  useEffect(() => {
    getData(`user/post/${id}`).then(response => {
       if(response.status===200) {
        setPostInfo(response.data); 
       }
    })
  }, []); 

  
  return (
    <>
      {!postInfo ? (
        <h3 className='text-3xl font-semibold'>Loading..</h3>
      ) : (
        <>
          <div className="post-page w-[80%] mx-auto">
            <h1 className='text-center px-3 py-2 capitalize'>{postInfo.title} 
              <br/>
              <span className=' text-sm font-normal text-slate-400'>{formatISO9075(new Date(postInfo.createdAt))}</span>
              <br/> 
              <span className=' text-xl mx-3 font-semibold '> By {postInfo.author.username}</span>   
            </h1>
            <div className="image w-full h-[300px] overflow-hidden shadow-md rounded-md">
              <img className='w-full h-full object-cover object-center' src={`http://localhost:5500/${postInfo.cover}`} alt="Image" />
            </div> 
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
