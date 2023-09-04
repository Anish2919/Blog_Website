import React, { useContext, useRef, useState } from 'react';
import {useForm} from 'react-hook-form'; 
import { postData } from '../services/axios.service';
import {Navigate} from 'react-router-dom'; 
import { successToast, warningToast } from '../services/tostify.service';
import { UserContext } from '../context/UserState';

const Login = () => {
    const [userData, setUserData] = useState({username:'', password:''}); 
    const [showPassword, setShowPassword] = useState(false); 
    const [redirect, setRedirect] = useState(false);  

    // config (useContext); 
    const {userInfo, setUserInfo} = useContext(UserContext); 

    const iconRef = useRef(); 

    // useForm 
    const {register, handleSubmit, watch, formState:{errors}, reset} = useForm(); 

    // show password button
    const handlePasswordShow = (e) => {
        setShowPassword(!showPassword); 
        const seletedIcon = iconRef.current; 
        seletedIcon.name==='eye-outline' ? seletedIcon.name='eye-off-outline' : seletedIcon.name='eye-outline'; 
      }

    // on clicking login button
    const login = async(data) => {
      const response = await postData('user/signin', data); 
      if(response && response.status===200) {
        const {username, id, msg} = response.data; 
        // success toast 
        successToast(msg);  
        // SET USER INFO USING useContext
        setUserInfo({id, username}); 
        setRedirect(true);
      } else if(response && response.status===400) {
        setRedirect(false); 
        warningToast(response.data.msg); 
      }
    }

    if(redirect) {
      return <Navigate to='/'></Navigate>
    }
    
  return (
    <div>
        <form action='' className='login' onSubmit={handleSubmit(login)}>
            <h1 >Login</h1>

            {/* INPUT USERNAME */}
            <input className='' type="text" autoComplete='username' placeholder='username' name='username' {...register('username', {required:'Username is required.', minLength:{value:4, message:'Username must be at least 4 chars long.'}})}/>
            {/* error message for password */}
            {errors.username && (<span className='block px-3 font-semibold my-3 text-muted text-sm  text-red-500 '>{errors.username.message}</span>)}
            
            {/* INPUT PASSWORD */}
            <input className='' type={showPassword ? 'text' : 'password'} autoComplete='current-password' placeholder='password' name='password' 
            {...register('password', {required:'Password is required!', pattern:{
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, 
                message: 'Password must include at least one Uppercase, Lowercase, number and character'
            }})} />
            {/* error message for password */}
            {errors.password && (<span className='block px-3 font-semibold my-3 text-muted text-sm  text-red-500 '>{errors.password.message}</span>)}

            {/* show password button */}
            <div className='border px-3 py-1 my-1 flex gap-2 hover:cursor-pointer bg-gray-200 rounded-md hover:bg-gray-100'  onClick={handlePasswordShow}>
              <div className="icon px-2 py-1 ">
                <ion-icon ref={iconRef} name="eye-outline"></ion-icon>
              </div>
              <p className='font-bold text-lg capitalize'>show password</p>
            </div>

            {/* login button */}
            <button className='btn' type='submit'>Login</button>
        </form>
    </div>
  );

// //   fetch login 
// async function postLoginCredentials(url, data){  
//   try{
//     const response = await fetch(url, {
//       method:'POST', 
//       headers: {
//         'content-type':'application/json', 
//       }, 
//       body: JSON.stringify(data)
//     }); 
//   } catch(err) {
//     alert(err); 
//   }
// }

}

export default Login;
