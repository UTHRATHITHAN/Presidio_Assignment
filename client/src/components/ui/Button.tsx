"use client"
import React from "react"
import { ClassNameValue } from 'tailwind-merge'
import { cn } from "@/utils/cn"

type Props = {
    type: "submit" | "button" | "reset"
    children?: React.ReactNode,
    className?: ClassNameValue,
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    disabled?: boolean
}

export default function Button({ type,children, className, onClick, ...props }: Props) {
    return (
        <button className={cn('h-16 w-48 rounded-[50px] text-white', className)} onClick={onClick} type={type} {...props}>
            {children}
        </button>
    )
}