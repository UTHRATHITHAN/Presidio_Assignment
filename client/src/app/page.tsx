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
      if (data.status === "success"){  
        router.push('/dashboard')
    }
      else {
         router.push('/')
      }
    }
    fetch()
  })

  return (
    <>
      <nav className="absolute w-full top-0 h-14 flex px-10 justify-between items-center">
        <p className="text-2xl">Rentify</p>
        <div className="flex gap-x-5">
          <Link href="/login">  <span>Login</span></Link>
          <Link href="/register">  <span>Register</span></Link>
        </div>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-xl">Home Page</h1>
        <div>
        </div>
      </main>
    </>
  );
}
