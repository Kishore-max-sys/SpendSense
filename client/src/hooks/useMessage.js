import {useCallback, useState} from "react";

function useMessage(){
        const [error,setError]=useState("");
        const [success,setSuccess]=useState("");
        const showError=useCallback((message) =>{
                setError(message);
                setTimeout(() =>{
                        setError("");
                },5000);
        },[]);
        const showSuccess=useCallback((message) =>{
                setSuccess(message);
                setTimeout(() =>{
                        setSuccess("");
                },5000);
        },[]);
        return {
                error,
                success,
                showError,
                showSuccess
        }
}

export default useMessage;