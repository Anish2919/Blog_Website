import { toast } from 'react-toastify';

const toastConfig = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 1,
    theme: "colored",
    }; 

export const successToast = (message) => {
    toast.success(message, toastConfig); 
}

export const errorToast = (message) => {
    toast.error(message, toastConfig); 
} 

export const warningToast = (message) => {
    toast.warning(message, toastConfig); 
}

export const promiseToast = async (waiting_message, promise) => {
    await toast.promise(promise, {
        pending: {
          render() {
            return waiting_message; 
          }
        }, 
        success: {
          render({data}) {
           return data; 
          }
        }, 
        error: {
          render({data}) {
            // when the promise reject, data will contains the error
            // return <MyErrorComponent message={data.msg} /> 
            return data; 
          }
        }
      }); 
}