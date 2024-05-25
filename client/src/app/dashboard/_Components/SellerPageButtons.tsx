import Link from 'next/link'
import React from 'react'

export default function SellerPageButtons() {
  return (
    <div className='grid place-content-center h-screen gap-y-5'>
              <Link href="/dashboard/addproperty">
                <button className='h-12 text-center bg-white text-black rounded-md px-5 w-full' >Post a Property</button>
              </Link>

              <Link href='/dashboard/viewproperty'  >
                <button className='h-12 text-center  bg-white text-black rounded-md px-5 w-full' >View Posted Property</button>
              </Link>
            </div>
  )
}
