import React from 'react';

const Register = () => {
  return (
    <div>
       <form action='' className='register'>
            <h1>Register</h1>
            <input  autoComplete='username' type="text" placeholder='username' name='username' />
            <input autoComplete='password' type="password" placeholder='password' name='password' />
            {/* <ion-icon name="eye-off"></ion-icon> */}
            <button>Register</button>
        </form>
    </div>
  );
}

export default Register;
