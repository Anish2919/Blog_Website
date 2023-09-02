const onchangeInputs = (e, setState) => {
    setState(prev => ({...prev, [e.target.name]: e.target.value})); 
}


export default onchangeInputs; 