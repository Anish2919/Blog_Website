import { useState } from "react";

const withUserData = (OriginalComponent, formType) => {
    function newComponent(props) {
        const [userData, setUserData] = useState({formType:formType}); 

        const inputOnChange = e => {
            setUserData(prev => ({...prev, [e.target.name]:e.target.value})); 
        }

        const clearStateData = () => {
            setUserData({}); 
        }

        const handleSubmit = e => {
            e.preventDefault(); 
            if((userData.username & userData.username!=='') || (!userData.password & userData.password==='')) {
                alert('Please fill up the complete form'); 8
            }
            if(formType==='Register') { 
                console.log('Register Data: ', userData); 
                clearStateData(); 
            } else {
                console.log('Login Data: ', userData); 
                clearStateData(); 
            }
        }
        
        return (
            <OriginalComponent 
                name="LogRocket" 
                handleSubmit={handleSubmit}/> 
        )
    }

    return newComponent; 
}

export default withUserData; 