"use client"
import React from 'react'
import axios from 'axios';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import {instance} from '@/utils/axiosConfig'

export default function Register() {
    const router = useRouter()
    const FormSchema = z.object({
        fname: z.string().min(3, { message: "The First name must be 3 characters or more" })
            .max(15, { message: "The First name must be 15 characters or less" })
            .regex(
                /^[a-zA-Z0-9_]+$/,
                "The First name must contain only letters, numbers and underscore (_)"
            ),
        lname: z.string().min(1, { message: "The Last name must be 1 characters or more" })
            .max(15, { message: "The Last name must be 15 characters or less" })
            .regex(
                /^[a-zA-Z0-9_]+$/,
                "The Last name must contain only letters, numbers and underscore (_)"
            ),
        email: z.string().regex(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, "Enter a valid Email address"),
        mobileNo: z.number({
            required_error: "Mobile Number is required",
            invalid_type_error: "MobileNo is required and must be a number",
        }),
        role: z.string().min(1, { message: "Role is required" })
    });

    type FormInput = z.infer<typeof FormSchema>;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInput>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            fname: '',
            lname: '',
            email: '',
            mobileNo: undefined,
            role: ""
        },
    });

    async function submitForm(formData: any) {
        console.log('submit');
        const data = await instance.post("/register", formData);
        console.log(data.data)
        console.log(data.data.status)
        const obj = data.data
        if (obj.status === "success") {
            toast.success(`🦄 ${obj.message}`, {
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
                router.push('/login')

            }, 2000
            )
        }
        else {
            toast.error(`🦄 ${obj.message}`, {
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
            <nav className="absolute w-full top-0 h-14 flex px-10 justify-between items-center">
                <p>Rentify</p>
                <div className="flex gap-x-5">
                    <Link href="/">  <span>Home</span></Link>
                    <Link href="/login">  <span>Login</span></Link>
                </div>
            </nav>
            <section className='text-white grid h-screen place-content-center  gap-y-5' >
                <ToastContainer/>
                <h2 className='text-center'>Register page</h2>

                <form onSubmit={handleSubmit(submitForm)} className='gap-y-5 flex flex-col w-[300px]'>
                    <div className=''>
                        <input id="fname" type='text' {...register('fname')} placeholder='Enter your first name' className='text-black rounded-md h-10 pl-3 w-full' />
                        {errors?.fname?.message && <p className='text-sm text-red-500'>{errors.fname.message}</p>}
                    </div>

                    <div>
                        <input id="lname" type='text' {...register('lname')} placeholder='Enter your Last name' className='text-black  rounded-md h-10 pl-3 w-full' />
                        {errors?.lname?.message && <p className='text-sm text-red-500'>{errors.lname.message}</p>}
                    </div>

                    <div>
                        <input id="email" type="email" {...register('email')} placeholder='Enter your Email' className='text-black  rounded-md h-10 pl-3 w-full' />
                        {errors?.email?.message && <p className='text-sm text-red-500'>{errors.email.message}</p>}
                    </div>

                    <div>
                        <input id="mobileNo" type="number" {...register('mobileNo', {
                            valueAsNumber: true,
                        })} placeholder='Enter your Mobile Number' className='text-black w-full rounded-md h-10 pl-3' />
                        {errors?.mobileNo?.message && <p className='text-sm text-red-500'>{errors.mobileNo.message}</p>}
                    </div>

                    <div className='flex justify-between items-center flex-col'>
                        <div className='flex justify-between w-full items-center '>
                            <label htmlFor="role">Choose role</label>
                            <select id="role"  {...register('role', { required: true })} className='w-6/12 rounded-md h-10 pl-3 text-black'>
                                <option value="" disabled>Select Option</option>
                                <option value="Seller">Seller</option>
                                <option value="Buyer">Buyer</option>
                            </select>
                        </div>
                        {errors?.role?.message && <p className='text-start  w-full text-sm text-red-500'>{errors.role.message}</p>}
                    </div>
                    <div className='flex w-full justify-center items-center'>
                     <Button type="submit" className="bg-zinc-800 flex justify-center items-center w-5/12 h-12 rounded-lg">Submit</Button>
                     </div>
                </form>
            </section>
        </main>
    )
}
