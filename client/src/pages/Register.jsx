import React, { useRef, useState } from 'react';
import onchangeInputs from '../pure functions/onchangeInput';
// import { successToast } from '../services/tostify.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { promiseToast, successToast } from '../services/tostify.service';

import {useNavigate} from 'react-router-dom'; 

const Register = (props) => {
  const [userData, setUserData] = useState({username:'', password:''});
  const [showPassword, setShowPassword] = useState(false); 

  const navigate = useNavigate(); 

  const iconRef = useRef(); 

  // hide and show password 
  const handlePasswordShow = (e) => {
    setShowPassword(!showPassword); 
    const seletedIcon = iconRef.current; 
    seletedIcon.name==='eye-outline' ? seletedIcon.name='eye-off-outline' : seletedIcon.name='eye-outline'; 
  }
 
  const onChangingInput = (e) => {
    onchangeInputs(e, setUserData); 
  }

  // handle submit button 
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log({...userData});  

    const promise = new Promise( async (resolve, reject) => {
      try{
        const res = await fetch('http://localhost:5500/user/signup', {
          method:'POST', 
          body: JSON.stringify({...userData}), 
          headers: {'Content-Type':'Application/json'}
        }); 
  
        // if the response is not ok 
        if(!res.ok) {
          if(res) {
            const responseMsg = await res.json(); 
            reject(responseMsg.msg); 
          }
        }
        // Reading response + converting responise to json. 
        const resData = await res.json();
        resolve(resData.msg); 
      } catch(err) {
        reject('Something went wrong'); 
      }
    })

    const newPromise = new Promise( async (resolve, reject) => {
      try{
        await promiseToast('Registering... please wait!', promise)
        resolve(); 
      } catch(error) {
        reject(); 
      }
    }); 
    
    newPromise.then(() => {
      setTimeout(() => {
        navigate('/login'); 
      } , 2000); 
    }); 
  }

  return (
    <div>
       <form onSubmit={handleSubmit} className='register'>
            <h1>Register</h1>
            <input value={userData.username}  autoComplete='username' type="text" placeholder='username' name='username' onChange={onChangingInput}/>
            <input value={userData.password} autoComplete='password' type={showPassword ? 'text' : 'password'} placeholder='password' name='password' onChange={onChangingInput} />
            {/* <ion-icon name="eye-off"></ion-icon> */}
            <div className='border px-3 py-1 my-1 flex gap-2 hover:cursor-pointer bg-gray-200 rounded-md hover:bg-gray-100'  onClick={handlePasswordShow}>
              <div className="icon px-2 py-1 ">
                <ion-icon ref={iconRef} name="eye-outline"></ion-icon>
              </div>
              <p className='font-bold text-lg capitalize'>show password</p>
            </div>
            <button className='btn' type='submit'>Register</button>
        </form>
    </div>
  );
}

export default Register;
