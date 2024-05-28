"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'
import {userDetailsStore} from '@/store/userDetails'
import {instance} from '@/utils/axiosConfig'

export default function Home() {
  const router = useRouter()
  const addUser = userDetailsStore((state) => state.addUserDetails);
 
  useEffect(() => {
    async function fetch() {
      const resData = await instance.get("/", {
        withCredentials: true
      });
      const data = resData.data;
      addUser(data.data)
      if (data.status !== "failure")  router.push('/dashboard')
    
      
    }
    fetch()
  })

  return (
    <>
      <nav className="absolute w-full top-0 h-14 flex px-10 justify-start items-center">
        <p className="text-2xl">Rentify</p>
        <div className="flex gap-x-5">
          <Link href="/login">  <span>Login</span></Link>
          <Link href="/register">  <span>Register</span></Link>
        </div>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-xl">Home Page</h1>
     <div className="flex justify-center flex-col items-start pl-20 h-[300px] w-[400px] text-white bg-black rounded-lg">
<p><strong>Name</strong> : Uthrathithan M</p>
<ul>
<p><strong>Github Link</strong></p>
<li><strong>&nbsp; &nbsp; Client repository</strong>: <a href="https://github.com/UTHRATHITHAN/Presidio_Assignment">Repo Link</a></li>
<li><strong>&nbsp; &nbsp; Backend repository</strong>:  <a href="https://github.com/UTHRATHITHAN/Presidio_Backend_Assignment">Repo Link</a> </li>
</ul>
<p><strong>Linkedin</strong> : <a href="www.linkedin.com/in/uthrathithan">Link for Linkedin profile</a> </p>
<p><strong>Mail</strong> : m.uthrathithan@gmail.com</p>
</div>
      </main>
    </>
  );
}
