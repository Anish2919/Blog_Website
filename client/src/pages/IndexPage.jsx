import React, { useEffect, useState } from 'react';
import Posts from '../components/Posts';
import { getData } from '../services/axios.service';

const IndexPage = () => {
  const [posts, setPosts] = useState([]); 

  const fetchData = async() => {
    const response = await getData('user/post');
    if(response.status===200) {
      setPosts(response.data.posts); 
    } else if(response.status===500) {
      console.log(response.data.msg)
    } else {
      console.log(response.msg); 
    }
  }

  useEffect(() => {
    fetchData(); 
  }, []); 
    
  return (
    <div>
        {posts.length > 0 && posts.map(post => (
          <Posts key={post._id} post={post} />
        ))}
    </div>
  );
}

export default IndexPage;
