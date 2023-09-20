import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';
import React from 'react'
import InitialModal from '@/components/modals/InitialModal';

const SetupPage = async () => {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  return (
    <></>
    // <InitialModal />
  )
}

export default SetupPage;




// import { Button } from '@/components/ui/button'
// import { cn } from '@/lib/utils';
// import Image from 'next/image'
// import { UserButton } from "@clerk/nextjs";
// import { ModeToggle } from '@/components/mode-toggle';
// const state = true;
// export default function Home() {
//   return (
//    <>
//     <UserButton afterSignOutUrl="/"/>
//     <ModeToggle />
//    </>
//   )
// }
