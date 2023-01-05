import React from 'react'
import Image from 'next/image'
import devProfile from '../public/devprofile1.png'

const Steps = () => {
  return (
    <div id='steps' className='h-[120%] mb-12'>
         <h2 className='font-bold text-[2rem] text-center'>Just <span className='sm:text-[60px] text-[40px] text-blue-500'>3</span> steps</h2>
        
        <div className='flex justify-center p-10'>

            <div>
                <div>
                    <h3>Create your account</h3>
                    <button>Sign In with LinkedIn</button>
                </div>
 
                <div>
                    <h3>Download devProfiler</h3>
                    <p>Download dev-profiler executable and run it on your local machine. It will find your local git repositories and generate a report of your contributions completely offline.</p>
                </div>

                <div>
                    <h3>Get your devProfile</h3>
                    <p>Upload the generated report on our website to see and share insights from your work that truly reflect the kind of developer you are.</p>
                </div>
            
            </div>

            <div>
                <Image src={devProfile} className="border-2 drop-shadow-md rounded-md" alt='devProfile image'/>



            </div>

        </div>
        
    </div>
  )
}

export default Steps