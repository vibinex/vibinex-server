import React from 'react'
import Card from '../components/Card'
import Image from 'next/image'

import laptop  from '../../public/images/laptopLady.png'

const data = [
  { heading: 'Coding History', content: 'We create different charts to represent your work experience over time. These are great tools to track your progress and see how fast you are learning!' },
  { heading: 'Language Overview', content: 'Skill boxes help illustrate how experienced you are, which programming languages you prefer, and they say more about your habits and preferences overall.' },
  { heading: 'Technology Overview', content: 'The programming language is just one side of the story. We also check and display your favorite technologies, so you can better identify your strengths.' },
  { heading: 'More And More Sources', content: 'We are grabbing your data from different sources. GitHub, StackOverflow, GitLab, HackerRank and more. We’re constantly expanding the number of integrations to make your profile as accurate as possible.    ' },
]

const WhyUs = () => {

  return (
    <div id='whyus' className='w-full h-[120%] mb-12 p-2 text-center'>
      <h2 className='font-bold text-[2rem]'>Why  <span className='text-[2rem] text-blue-500 font-bold'>devProfile ? </span></h2>
      <p className='m-5 text-gray-500 text-[20px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis quidem consequuntur quis cumque exercitationem culpa, itaque sit magnam, ullam odio facere expedita! Earum, soluta eveniet expedita labore quas officia dolorum, fuga nulla at consequuntur voluptate veritatis vel corporis. Incidunt, quidem officia quo cupiditate error, et dignissimos odio aspernatur, perspiciatis pariatur beatae corporis. Sapiente cum nulla autem, doloremque assumenda optio eveniet corrupti fugiat asperiores aliquid sint numquam iure necessitatibus mollitia neque consectetur explicabo in suscipit voluptate placeat fugit nihil tempora! Tenetur possimus earum cumque reprehenderit odit doloribus velit accusamus maxime voluptas, recusandae hic temporibus praesentium debitis unde beatae assumenda voluptatem dolore?</p>

      <div className='grid grid-cols-2 gap-2'>
          {data.map((item, index) => {
            return <Card key={index} heading={item.heading} content={item.content} />
          })
          }  
      </div>  
    </div>
  )
}

export default WhyUs