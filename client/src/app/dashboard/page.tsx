"use client"
import React, { useEffect, useState } from 'react'
import { userDetailsStore } from '@/store/userDetails'
import { propertyDetailsStore } from '@/store/propertyDetails'
import SellerPageButtons from './_Components/SellerPageButtons'
import axios from 'axios'
import Navbar from './Navbar'
import { LoginInfoStore } from '@/store/login'
import Pagination from './_Components/Pagination'
import CurrentPosts from './_Components/CurrentPosts'
import FilterInputs from './_Components/FilterInputs'
import { instance } from '@/utils/axiosConfig'

export default function Dashboard() {
  const getUser = userDetailsStore((state) => state.getUserDetails);
  const addAllProperties = propertyDetailsStore((state) => state.addPropertyDetails)


  const [userData, setUserData] = useState<any>();
  // Stores all properties
  const [allProperty, setAllProperty] = useState<any>()
  // Duplicate state for properties
  const [DupAllproperty, setDupAllProperty] = useState<any>();
  // For Storing seller details
  const [sellerDetails, setSellerDetails] = useState(false);
  const [cardID, setCardID] = useState<any>(null)
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [LikedEmail, setLikedEmail] = useState<any>([])
  const [filterArray, setFilterArray] = useState<any>()

  // Pagination
  const [currentpage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);
  let pages = []
  const lastPostIndex = currentpage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = DupAllproperty?.slice(firstPostIndex, lastPostIndex)


  for (let i = 1; i <= Math.ceil(DupAllproperty?.length / postsPerPage); i++) {
    pages.push(i)
  }
  const getLoading = LoginInfoStore((state) => state.getLoading)

  const [filter, setFilter] = useState({
    BHK: 0,
    location: "",
    rent: 0,
    totalRooms: 0,
    likes: 0
  })


  useEffect(() => {
    setUserData(getUser());
    async function fetch() {
      const resData = await instance.get("/allproperties")
      console.log(resData.data.data)
      setAllProperty(resData.data.data)
      addAllProperties(resData.data.data)
      setDupAllProperty(resData.data.data)
      setLikedEmail(resData.data.data)
    }
    fetch()
  }, [addAllProperties,getUser])

  async function handleLikes(property:any, index:number, likeArray:any) {
    setIsLiked(!isLiked)
    //referrence
    // console.log(property.like.includes(getUser()['email']))
    if (likeArray.includes(getUser()['email'])) {
      console.log("remove")
      const removeLike = await instance.patch("/like", {
        id: property.id,
        email: getUser()['email'],
        purpose: "RemoveLike"
      })
      console.log(removeLike.data)
      // if(removeLike.data) setForLoadingLike(!forLaodingLike)
      if (removeLike.data) window.location.reload()
    } else {
      const addLike = await instance.patch("/like", {
        id: property.id,
        email: getUser()['email'],
        purpose: "AddLike"
      })
      console.log(addLike.data)
      // if(addLike.data) setForLoadingLike(!forLaodingLike)
      if (addLike.data) window.location.reload()
    }
  }

  async function handleSellerDetails(property:any, id: React.SetStateAction<null>) {
    setSellerDetails(!sellerDetails);
    setCardID(id)
    const BuyerData = getUser();
    const sellerData = property;
    const postData = {
      BuyerData,
      sellerData
    }
    await instance.post("/sendBuyer", postData)
     await instance.post("/sendSeller", postData)
  

  }

  function handleFilter() {
    console.log(filter)
    const filteredData = allProperty?.filter((property:any, i:number) => {
      if (property.BHK <= filter.BHK ||
        property.rent <= filter.rent ||
        property.totalRooms <= filter.totalRooms ||
        property?.location?.toLowerCase().includes(filter?.location.toLowerCase()) || filter.likes < property.like.length) return property
    }
    )
    if (filteredData[0]) setDupAllProperty(filteredData)
    else setDupAllProperty([])
  }

  function handleClearFilter() {
    setFilter({
      BHK: 0,
      location: "",
      rent: 0,
      totalRooms: 0,
      likes: 0
    })
    setDupAllProperty(allProperty)
  }

  function handlePreviousButton() {
    setCurrentPage((prev) => {
      if (prev === 1) return 1
      else {
        return prev - 1
      }
    })
  }

  function handleNextButton() {
    setCurrentPage((prev) => {
      if (prev < Math.floor(allProperty?.length / postsPerPage + 1)) return prev + 1
      else return prev
    })
  }

  return (
    <main>
      <Navbar />
      <section>
        {
          userData?.role === "Buyer" ?
            <>
              <FilterInputs filter={filter} setFilter={setFilter} handleFilter={handleFilter} handleClearFilter={handleClearFilter} />
              <CurrentPosts
                cardID={cardID}
                currentPosts={currentPosts}
                filterArray={filterArray}
                getUser={getUser}
                handleLikes={handleLikes}
                handleSellerDetails={handleSellerDetails}
                sellerDetails={sellerDetails}

              />
              <Pagination pages={pages} currentpage={currentpage} setCurrentPage={setCurrentPage} handlePreviousButton={handlePreviousButton} handleNextButton={handleNextButton} />
            </>
            :
            <SellerPageButtons />
        }
      </section>
    </main>
  )
}
