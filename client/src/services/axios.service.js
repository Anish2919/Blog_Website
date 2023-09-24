import axios from 'axios'; 


const SERVER_URL = import.meta.env.VITE_LOCAL_SERVER_URL

const axiosConfig = {
    withCredentials:true, 
    headers: {
        'content-type':'application/json', 
    }
}

const axiosConfigMulti = {
    withCredentials:true, 
    headers: {
        'content-type':'multipart/form-data',
    }
}


export const postData = async(url, body, multi='') => {
    try{
        const config = (multi==='') ? axiosConfig : axiosConfigMulti; 
        const response = await axios.post(`${SERVER_URL}/${url}`, body, config); 
        return response; 
    } catch(error) {
        if(error.response) {
            return error.response; 
        } else {
            return {msg:'Something went wrong!'}
        }
    }
} 

export const getData = async(url) => {
    try{
        const response = await axios.get(`${SERVER_URL}/${url}`, axiosConfig); 
        return response; 
    } catch(err) {
        return err.response; 
    }
} 
