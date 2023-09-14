'use client'

import React, { useEffect, useState } from 'react'
import CreateServerModal from './createServerModal'
import { useRouter } from 'next/navigation';
import InviteModal from './InviteModal';
import EditServerModal from '@/components/modals/editServerModal';
import ManageMembersModal from '@/components/modals/manageMembersModal';

const ProviderModal = () => {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true)
    }, []);

    if (!isMounted) return null;

  return (
    <>
        <InviteModal />
        <CreateServerModal />
        <EditServerModal />
        <ManageMembersModal />
    </>
  )
}

export default ProviderModal