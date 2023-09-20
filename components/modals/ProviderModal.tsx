'use client'

import React, { useEffect, useState } from 'react'
import CreateServerModal from './createServerModal'
import { useRouter } from 'next/navigation';
import InviteModal from './InviteModal';
import EditServerModal from '@/components/modals/editServerModal';
import ManageMembersModal from '@/components/modals/manageMembersModal';
import CreateChannelModal from '@/components/modals/createChannelModal';
import LeaveServerModal from '@/components/modals/leaveServerModal';
import DeleteServerModal from '@/components/modals/deleteServerModal';
import DeleteChannelModal from './deleteChannelModal';
import EditChannelModal from './editChannelModal';


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
        <CreateChannelModal />
        <LeaveServerModal />
        <DeleteServerModal />
        <DeleteChannelModal />
        <EditChannelModal />
    </>
  )
}

export default ProviderModal