"use client"
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "@/components/ui/Spinner";
import {instance} from '@/utils/axiosConfig'

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        async function fetch() {
            try {
                const resData = await instance.get("/", {
                    withCredentials: true
                });
                const data = resData.data;
                if (data.status === "failure") {
                    router.push('/login')
                }
                else {
                    setLoading(false)
                }
            } catch (error) {
                setLoading(false)
            }
        }
        fetch()
    })

    return (
        <html lang="en">
            <body suppressHydrationWarning={true}>
                <>
                    {
                        loading ?
                            <Spinner />
                            : <>
                                <Navbar />
                                {children}
                            </>
                    }
                </>
            </body>
        </html>
    );
}
