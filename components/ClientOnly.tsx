"use client"

import React, { useEffect, useState } from 'react'
interface ClientOnlyProps {
    children: React.ReactNode,
}
const ClientOnly = ({children}: ClientOnlyProps) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, []);
    if (!isMounted) return null
  return (
    <div className='h-full'>
        {children}
    </div>
  )
}

export default ClientOnly