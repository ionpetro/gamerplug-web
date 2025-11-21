'use client'

import { ButtonHTMLAttributes, MouseEvent } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type BackButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function BackButton({ className, onClick, ...props }: BackButtonProps) {
  const router = useRouter()

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) {
      router.back()
    }
  }

  return (
    <button
      type="button"
      className={cn(className)}
      onClick={handleClick}
      {...props}
    />
  )
}

