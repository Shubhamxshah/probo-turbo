import React from 'react'
import PhoneVideo from './phone'
import SelectTab from './selectTab'


const SecondHero = () => {
  return (
      <div className='hidden md:flex bg-black/90 h-3/5 pl-40  mt-2'>
        <SelectTab />
        <div className='pr-96 pt-6 pb-6'>
        <div className='pr-20'>
          <PhoneVideo />
        </div>
      </div>
      </div>
  )
}

export default SecondHero

