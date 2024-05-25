import React from 'react'

export default function Pagination({pages,currentpage,setCurrentPage,handlePreviousButton,handleNextButton}:any) {
  return (
    <div className='w-full h-10 justify-center items-center mt-8 text-white flex gap-x-3'>
    <button className={`text-white border border-zinc-900 rounded-md px-4 py-2 flex justify-center items-center`} onClick={handlePreviousButton}>Prev</button>
    {
      pages.map((page:any, i:number) => {
        return <button className={`${page === currentpage ? 'bg-zinc-900' : ""} text-white border border-zinc-900 rounded-md px-4 py-2 flex justify-center items-center`} key={i} onClick={() => setCurrentPage(page)}>{page}</button>
      })
    }
    <button className={`text-white border border-zinc-900 rounded-md px-4 py-2 flex justify-center items-center`} onClick={handleNextButton}>Next</button>
  </div>
  )
}
