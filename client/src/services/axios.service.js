import axios from 'axios'; 


const SERVER_URL = import.meta.env.VITE_LOCAL_SERVER_URL

const axiosConfig = {
    withCredentials:true, 
    headers: {
        'content-type':'application/json', 
    }
}


export const postData = async(url, body) => {
    try{
        const response = await axios.post(`${SERVER_URL}/${url}`, body, axiosConfig); 
        console.log(response.status); 
        return response; 
    } catch(error) {
        return error.response; 
    }
} 