import useAuth from "./useAuth";
import {useEffect,useState} from "react";
import api from "../api/axios";

function useVerifyUser(){
        const {token,logout}=useAuth();
        const [isLoading,setIsLoading]=useState(true);
        const [isVerified,setIsVerified]=useState(false);
        useEffect(() =>{
                const verify=async() =>{
                        if(!token){
                                setIsLoading(false);
                                setIsVerified(false);
                                return;
                        }
                        try{
                                await api.get("/users/me");
                                setIsVerified(true);
                        }catch{
                                logout();
                                setIsVerified(false);
                        }finally{
                                setIsLoading(false);
                        }
                }
                verify();
        },[token,logout]);
        return {isLoading,isVerified};
}

export default useVerifyUser;