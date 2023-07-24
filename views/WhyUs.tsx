import React from 'react'
import { GoSettings } from 'react-icons/go'
import { AiOutlineFileSearch, AiOutlineApartment } from 'react-icons/ai'
const data = [
  { icon: <AiOutlineApartment size={40} />, heading: 'Quality Control', content: 'Always stay informed if someone overwrites your code.' },
  { icon: <AiOutlineFileSearch size={40} />, heading: 'Know your code', content: 'You should review every PR. But do you? Now you can!' },
  { icon: <GoSettings size={40} />, heading: 'Reduce noise', content: 'Not everything needs your attention, focus on what matters the most.' },
]

const WhyUs = () => {
  return (
    <div id='whyus' className='w-full text-center py-12  bg-secondary-main'>
      <h2 className='font-bold text-[2rem]'>Why  <span className='text-[2rem] text-primary-main font-bold'>Vibinex?</span></h2>
      <div className='w-[100%] mt-3 p-4'>
        {
          data.map((item) => {
            return (
              <div key={item.heading} className="flex sm:p-5 p-3 rounded-lg border-2 mt-7 sm:w-[50%] w-[90%] m-auto border-primary-main">
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