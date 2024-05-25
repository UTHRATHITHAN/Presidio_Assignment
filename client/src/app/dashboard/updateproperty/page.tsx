"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation'
import { userDetailsStore } from '@/store/userDetails'
import { propertyStore } from '@/store/userDetails'
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { instance } from '@/utils/axiosConfig';

export default function AddProperty() {
    const router = useRouter()
    const getUser = userDetailsStore((state) => state.getUserDetails);
    const getproperty = propertyStore((state) => state.getPropertyDetails);


    const FormSchema = z.object({
        BHK: z.number({
            required_error: "BHK is required",
            invalid_type_error: "BHK is required and must be a number",

        }).gt(0, { message: "The BHK must be greater than 0" })
            .lte(10, { message: "The BHK must be less than 10" }),
        location: z.string({
            required_error: "Location is required",

        }).min(3, { message: "The location must be 3 characters or more" })
            .max(20, { message: "The Last name must be 20 characters or less" })
            .regex(
                /^[a-zA-Z0-9_]+$/,
                "The location must contain only letters, numbers and underscore (_)"
            ),
        totalRooms: z.number({
            required_error: "Total Rooms is required",
            invalid_type_error: "Total Rooms is required and must be a number",

        }).gte(0, { message: "The Total Rooms must be greater than 0" })
            .lte(10, { message: "The  Total Rooms must be less than 10" }),

        rent: z.number({
            required_error: "Rent is required",
            invalid_type_error: "Rent is required and must be a number",

        }).gte(1000, { message: "The Rent must be greater than 1000" })
            .lte(50000, { message: "The Rent must be less than 50000" }),

    });

    type FormInput = z.infer<typeof FormSchema>;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInput>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            BHK: getproperty()['BHK'],
            location: getproperty()['location'],
            totalRooms: getproperty()['totalRooms'],
            rent: getproperty()['rent']
        },
    });

    useEffect(() => {
        async function fetch() {
            if (getUser()['role'] === "Buyer") {
                router.replace('/dashboard')
            }
        }
        fetch()
    })

    async function submitForm(formData:any) {
        console.log(formData)
        const resData = await instance.patch("/property", { ...formData, id: getproperty()['id'], userEmail: getproperty()['email'] });
        console.log(resData.data)
        const data = resData.data
        if (data.status === "success"){
            toast.success(`🦄 ${data.message}` , {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
                });
                setTimeout(() => {
                    router.replace('/dashboard/viewproperty')
    
                },3000)
          }else{
            toast.error(`🦄 ${data.message}`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
                });
          }
    }

    return (
        <main>
            <section className='text-white grid h-screen place-content-center  gap-y-5' >
            <ToastContainer/>
                <h2 className='text-center'>Update Property</h2>
                <form onSubmit={handleSubmit(submitForm)} className='gap-y-5 flex flex-col w-[300px]'>
                    <div className=''>
                        <input id="BHK" type='number'  {...register('BHK', {
                            valueAsNumber: true,
                        })} placeholder='Enter your BHK ' className='text-black rounded-md h-10 pl-3 w-full' />
                        {errors?.BHK?.message && <p className='text-sm text-red-500'>{errors.BHK.message}</p>}
                    </div>
                    <div>
                        <input id="location" type='text' {...register('location')} placeholder='Enter your Location' className='text-black  rounded-md h-10 pl-3 w-full' />
                        {errors?.location?.message && <p className='text-sm text-red-500'>{errors.location.message}</p>}
                    </div>
                    <div>
                        <input id="totalRooms" type="number" {...register('totalRooms', {
                            valueAsNumber: true,
                        })} placeholder='Enter your totalRooms' className='text-black  rounded-md h-10 pl-3 w-full' />
                        {errors?.totalRooms?.message && <p className='text-sm text-red-500'>{errors.totalRooms.message}</p>}
                    </div>
                    <div>
                        <input id="rent" type="number" {...register('rent', {
                            valueAsNumber: true,
                        })} placeholder='Enter your Rent' className='text-black w-full rounded-md h-10 pl-3' />
                        {errors?.rent?.message && <p className='text-sm text-red-500'>{errors.rent.message}</p>}
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </section>
        </main>

    )
}
