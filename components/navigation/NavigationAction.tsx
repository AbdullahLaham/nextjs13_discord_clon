import { Plus } from 'lucide-react'
import React from 'react'

const NavigationAction = () => {
  return (
    <div>
        <button className=''>
            <div className='flex mx-3 h-[40px] w-[40px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500     '>
                <Plus size={25} />
            </div>
        </button>
    </div>
  )
}

export default NavigationAction