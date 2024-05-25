"use client"
import React, { useEffect, useState } from 'react'
import { userDetailsStore, } from '@/store/userDetails'
import axios from 'axios';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import {instance} from '@/utils/axiosConfig'

export default function Navbar() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>();
  const getUser = userDetailsStore((state) => state.getUserDetails);

  useEffect(() => {
    setUserData(getUser());
  },[getUser])

  async function handleLogout() {
    const resData = await instance.get("/logout",{withCredentials:true})
    console.log(resData.data)
    router.replace("/login")
  }

  return (
    <nav className='absolute top-0 w-full h-12 flex items-center justify-between px-10 z-0'>
      <div className=''>
        <p className='text-lg'>Welcome {userData?.fname} <span className='text-xs text-zinc-600'>{"  "}{userData?.role}</span></p>
      </div>
      <div className='flex gap-x-5'>
        <Link href='/dashboard'>Dashboard</Link>
        <button onClick={() => handleLogout()}>Log Out</button>
      </div>
    </nav>
  )
}
