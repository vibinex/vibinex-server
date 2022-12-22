import React from "react";

const Introduction =()=>{
    return (
        <div className='flex items-center justify-center h-screen mb-12 bg-fixed bg-center bg-cover introImage'>
            {/*Overlay*/}
            <div  className='absolute top-0 right-0 bottom-0 left-0 bg-black/70 z-[2]' />
            <section className='p-5 text-white z-[2] ml-[-30rem]'>
              <h1 className='text-[80px] font-bold'>Become the Ultimate</h1>
              {/* <h1 className='text-[80px] font-bold mt-[-20px]'>Ultimate</h1>  */}
              <h1 className='text-[80px] text-blue-500 font-bold mt-[-20px]'>Developer</h1>

            <article className='text-[30px] mt-6 mb-6 text-gray-300'>
              <p>{`Don't Build Resumes build your`}</p>
              <p><span>devProfile </span>for flexing your dev journey</p>
            </article>

              <button className='bg-blue-500  p-5 pl-20 pr-20 rounded-lg font-bold text-[25px] mt-5'>Build devProfile</button>
            </section>
            
        </div>
    )
}

export default Introduction