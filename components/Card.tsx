import React from 'react'
import { PropsWithChildren } from "react";

const Card = (props: PropsWithChildren<{
	heading: string,
	content?: string,
}>) => {
  return (
    <div className='text-secondary-dark w-[50%]'>
        <div className='p-3 m-5 mt-10 border-2 border-secondary-light rounded'>
            <h2 className='text-[1.2rem] m-2 font-bold'>{props.heading}</h2>
            <p>{props.content}</p>
        </div>

    </div>
  )
}

export default Card