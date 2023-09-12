'use client'

import { Plus } from 'lucide-react'
import React from 'react'
import ActionTooltip from '../ActionTooltip'

const NavigationAction = () => {

  return (
    <div>
       <ActionTooltip label='Add a Server' side='right' align='center' >
        <button className='group flex items-center'>
              <div className='flex mx-3 h-[40px] w-[40px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500     '>
                  <Plus className='group-hover:text-white transition-all text-emerald-500' size={25} />
              </div>
          </button>
       </ActionTooltip>
    </div>
  )
}

export default NavigationAction