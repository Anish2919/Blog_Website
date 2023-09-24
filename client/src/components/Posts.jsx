import React from 'react';
import {Link} from 'react-router-dom'; 
import {formatISO9075} from 'date-fns'; 

const Posts = ({post}) => {
  console.log(post.createdAt); 
  return (
        <div className="post border-2 p-3 rounded-md ">
          <div className="image  border border-red-300:">
            <Link to={`post/${post._id}`}>
              <img className='bordershadow-md w-full h-48 hover:shadow-lg object-cover' src={`http://localhost:5500/${post.cover}`} alt="Image_Name" />
            </Link>
          </div>
          <div className="texts">
            <Link to={`post/${post._id}`}>
              <h2 className='font-bold text-3xl'>{ post.title }</h2>
            </Link>
            <p className="info">
              <a href="" className='author'>{ post.author.username }</a>
              <time>{ formatISO9075(new Date(post.createdAt)) }</time>
            </p>
            <p className='summary'>{ post.summary }</p>
          </div>
        </div>
  );
}

export default Posts;
