"use client"
import React, { useEffect, useState } from 'react'
import { userDetailsStore, propertyStore } from '@/store/userDetails'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/ui/Spinner';
import { instance } from '@/utils/axiosConfig';


export default function ViewProperty() {
  const router = useRouter()
  const getUser = userDetailsStore((state) => state.getUserDetails);
  const addProperty = propertyStore((state) => state.addPropertyDetails)
  const [userData, setUserData] = useState();
  const [propertData, setPropertyData] = useState<any>([]);

  useEffect(() => {
     setUserData(getUser());
  })

  useEffect(() => {
    async function getProperty() {
      const resData = await instance.get("/property", {
        params: {
          email:getUser()['email']
        },
      });
      const data = resData.data;
      setPropertyData(data.data[0].propertyDetails)
      if (getUser()['role'] === "Buyer") {
        router.replace('/dashboard')
    }
    }
    getProperty();
  }, [getUser,router])

  async function handleDelete(id: any) {
    const resData = await instance.delete("/property", {
      params: {
        id
      },
    })
    console.log(resData.data)
    window.location.reload()
  }
  async function handleEdit(property:any) {
    addProperty(property)
    router.push('/dashboard/updateproperty')
  }
  return (
   
          <>
          {
              getUser()['role'] === "Buyer" ? <Spinner /> :
      <section className='flex justify-center flex-col items-center gap-y-5 h-screen  w-full'>
        <h2 className='text-center'>List all property</h2>
        <div className='flex  min-h-[500px] h-fit py-10 px-10  '>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3">
                    BHK
                  </th>
                  <th scope="col" className="px-6 py-3">
                    totalRooms
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Rent
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Edits
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  propertData?.map((property:any, i:number) =>
                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={i}>
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {property.location}
                      </th>
                      <td className="px-6 py-4">
                        {property.BHK}
                      </td>
                      <td className="px-6 py-4">
                        {property.totalRooms}
                      </td>
                      <td className="px-6 py-4">
                        {property.rent}
                      </td>

                      <td className="px-6 py-4">
                        <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleEdit(property)}>
                          Edit
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleDelete(Number(property.id))}>Delete</a>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </section>
    }
</>
  )
}