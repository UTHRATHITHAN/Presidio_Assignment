import React from 'react'

export default function CurrentPosts({ filterArray, currentPosts, handleSellerDetails, handleLikes, getUser, cardID, sellerDetails }:any) {
  return (
    <div className='h-[500px]  grid grid-cols-4 place-items-center place-content-start gap-y-14' >
      {
        (filterArray?.length === 0) ? <h1 className='text-white text-center text-lg pl-44'>No property to show</h1>
          : <>
            {
              currentPosts?.map((property:any, i:number) =>
                <div className='min-h-[150px] w-[250px] bg-zinc-900 text-white rounded-md flex justify-center items-start pl-5 py-5 flex-col ' key={i}>
                  <p><strong>Place</strong>: {property.location}</p>
                  <p><strong>BHK</strong>: {property.BHK}</p>
                  <p><strong>Total Rooms</strong>: {property.totalRooms}</p>
                  <p><strong>Rent</strong>: {property.rent}</p>
                  <div className='flex w-full  justify-between pr-5 mt-2 h-16'>
                    <button className=' border-2 border-white p-2 rounded-md mt-2' onClick={() => handleSellerDetails(property, i)}>Im Interested</button>

                    <div className='flex flex-col items-center justify-around'>
                      <span>{property.like.length}</span>
                      <button onClick={() => handleLikes(property, i, property.like)} className={`${property.like.includes(getUser()['email']) ? "bg-emerald-400 text-white rounded-md p-1 " : "p-1 bg-transparent text-white"}`} >
                        {property.like.includes(getUser()['email']) ? "Liked" : "Like"}
                      </button>
                    </div>
                  </div>

                  {
                    cardID === i ? <div className={`${sellerDetails ? "block mt-5 transition-all duration-1000 ease-in" : "hidden"}`}>
                      <p><strong>Name</strong>: {property.user.fname + " " + property.user.fname}</p>
                      <p><strong>Email</strong>: {property.user.email}</p>
                      <p><strong>MobileNO</strong>: {property.user.mobileNo}</p>
                      <p><strong>Rent</strong>: {property.rent}</p>
                    </div> : <></>
                  }
                </div>
              )
            }
          </>
      }
    </div>
  )
}
