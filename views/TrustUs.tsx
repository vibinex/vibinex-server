import React from 'react'
import { BiCodeBlock, BiWindowOpen } from 'react-icons/bi'
import { BsShieldLock } from 'react-icons/bs'
const data = [
  { icon: <BiCodeBlock size={40} />, heading: 'Easy to setup', content: 'Get started with GitHub Actions/Bitbucket Pipes in less than 10 minutes' },
  { icon: <BsShieldLock size={40} />, heading: 'Data privacy at peak', content: 'Your code never leaves the machines you control' },
  { icon: <BiWindowOpen size={40} />, heading: 'Free & open source', content: '100% transparency means 100% trust' },
]

const WhyUs = () => {
  return (
    <div id='trust' className='w-full text-center py-12 bg-secondary-main'>
      <h2 className='font-bold text-[2rem]'>Stay calm and get <span className='text-[2rem] text-primary-main font-bold'>Vibinex</span></h2>
      <div className='w-[100%] mt-3 p-4'>
        {
          data.map((item) => {
            return (
              <div key={item.heading} className="flex sm:p-5 p-3 rounded-lg border-2 mt-7 sm:w-[50%]  w-[90%] m-auto border-primary-main">
                <div className=''>
                  {item.icon}
                </div>
                <div className='mx-auto'>
                  <h2 className='font-semibold text-[1.5rem]'>{item.heading}</h2>
                  <p className='w-[80%] m-auto'>{item.content}</p>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
export default WhyUs