"use client";
import { useCallback,useState } from "react";

export function usePlayerProgress(key:string,enabled:boolean){const [resumeAt]=useState(()=>{if(!enabled||typeof window==="undefined")return 0;try{return Number(localStorage.getItem(key))||0}catch{return 0}});const save=useCallback((seconds:number)=>{if(!enabled||seconds<1)return;try{localStorage.setItem(key,String(Math.floor(seconds)))}catch{}},[enabled,key]);const clear=useCallback(()=>{if(!enabled)return;try{localStorage.removeItem(key)}catch{}},[enabled,key]);return {resumeAt,save,clear}}
