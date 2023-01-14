import React from 'react'
import { BiCodeBlock, BiWindowOpen } from 'react-icons/bi'
import { BsShieldLock } from 'react-icons/bs'

const data = [
  { icon: <BiCodeBlock size={40} />, heading: 'Builds profile directly from code', content: 'Insights directly from the code, so that you do not need to write and explain about your profession everytime.' },
  { icon: <BsShieldLock size={40} />, heading: 'Data privacy at peak', content: 'We make no network calls to ensure the secrecy of all your private repos. ' },
  { icon: <BiWindowOpen size={40} />, heading: 'Free & open source', content: 'What we promise we deliever. Check it by yourself. Feel free to add suggestions or contribuitons.' },
]

const WhyUs = () => {
  return (
    <div id='whyus' className='w-full  text-center'>
      <h2 className='font-bold text-[2rem]'>Why  <span className='text-[2rem] text-primary-main font-bold'>devProfile ? </span></h2>
      <div className='w-[100%] mt-3 p-4'>
        {
          data.map((item, index) => {
            return (
              <div key={index} className="flex sm:p-5  p-3 rounded-lg border-2 mt-7 sm:w-[50%]  w-[90%] m-auto  border-primary-main">
                <div className= ''>
                  {item.icon}
                </div>
                <div>
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