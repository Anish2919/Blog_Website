import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserState';
import { getData } from '../../services/axios.service';
import { errorToast, successToast } from '../../services/tostify.service';



const Header = () => {
  const {userInfo, setUserInfo} = useContext(UserContext);  

  const navigate = useNavigate(); 

  async function fetchData(url) {
    const response = await getData(url); 
    return response; 
  }

  useEffect(() => {
    fetchData('user/profile')
      .then(response => {
        if(response.status === 200)  {
          const {msg, username, id} = response.data; 
          setUserInfo({id, username})
          successToast(msg); 
        } else {
          throw new Error('Unauthorized access.')  
        }
      }).catch(error => {
        setUserInfo({}); 
      }) 
  }, []);

  async function logout() {
    fetchData('user/logout')
      .then(response => {
        if(response.status===200) {
          navigate('/login'); 
          successToast('successfully logged out');
          setUserInfo({});   
        } else {
          throw new Error(response.msg); 
        }
      })
      .catch(error => {
        console.log('error from logout: ', error); 
      })
  }
  
  const userName = userInfo?.username; 

  return (
    <header>
        <Link to='/' className='logo'>MyBlog</Link>
        <nav>
          {userName && (
            <>
              <Link to='/create'>Create new post</Link>
              <a className=' bg-slate-300 px-3 rounded-lg hover:cursor-pointer' onClick={logout}>Logout</a>
            </>
          )}

          {!userName && (
            <>
              <Link to='/login' href="">Login</Link>
              <Link to={'/register'} href="">Register</Link>
            </>
          )}
        </nav>
    </header>
  );
}

export default Header;
