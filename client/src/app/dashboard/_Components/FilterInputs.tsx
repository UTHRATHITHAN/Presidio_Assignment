import React from 'react'

export default function FilterInputs({filter, setFilter, handleFilter,handleClearFilter}:any) {
  return (
    <div className='w-full mt-28 mb-10 h-20 py-12 bg-black flex justify-center items-center gap-x-5'>
    <input type="number" name='BHK' placeholder='BHK' className='h-8 rounded-md outline-none pl-4 text-black' value={filter.BHK || ""} onChange={(e) => setFilter({ ...filter, BHK: Number(e.target.value) })} />

    <input type="text" name='rent' placeholder='Rent less than' className='h-8 rounded-md outline-none pl-4 text-black' value={filter.rent || ""} onChange={(e) => setFilter({ ...filter, rent: Number(e.target.value) })} />

    <input type="text" name='location' placeholder='Location' className='h-8 rounded-md outline-none pl-4 text-black' value={filter.location} onChange={(e) => setFilter({ ...filter, location: e.target.value })} />

    <input type="text" name='totalRooms' placeholder='Total Rooms available' className='h-8 rounded-md outline-none pl-4 text-black' value={filter.totalRooms || ""} onChange={(e) => setFilter({ ...filter, totalRooms: Number(e.target.value) })} />

    <input type="text" name='likes' placeholder='Property with highest Likes' className='h-8 rounded-md outline-none pl-4 text-black' value={filter.likes || ""} onChange={(e) => setFilter({ ...filter, likes: Number(e.target.value) })} />

    <button className='h-10 bg-zinc-700 w-24 px-2 rounded-md outline-none pl-4 text-white' onClick={handleFilter}>Filter</button>
    <button className='h-10  bg-zinc-700  w-32 px-2 rounded-md outline-none pl-4 text-white' onClick={handleClearFilter}>Clear filter</button>
  </div>

  )
}
