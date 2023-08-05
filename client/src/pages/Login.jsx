import React, { useRef } from 'react';

const Login = () => {
    const passwordInputRef = useRef(''); 
    const handleShowButton = () => {
        const selectedInput = passwordInputRef.current; 
        
        if(selectedInput.type==='password') {
            selectedInput.type = 'text'; 
        } else {
            selectedInput.type = 'password'; 
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault(); 
    }
  return (
    <div>
        <form action='' className='login'>
            <h1 >Login</h1>
            <input className='' type="text" autoComplete='username' placeholder='username' name='username' />
            <input className='' type="password" autoComplete='current-password' placeholder='password' name='password' />
            {/* <ion-icon name="eye-off"></ion-icon> */}
            <button>Login</button>
        </form>
    </div>
  );
}

export default Login;
