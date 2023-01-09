import React, { useReducer,useEffect } from 'react'
import Image from 'next/image'
import demo from '../public/howToRun.gif'
import Link from 'next/link'
import DropZone from '../components/DropZone'


const uploads = () => {

    const cardStyle = 'm-5 p-4 border-2 rounded-lg shadow-lg'
    
    // reducer function to handle state changes
    const reducer = (state, action) => {
        switch (action.type) {
            case "setDropZone":
                return { ...state, inDropZone: action.inDropZone };
            case "addFileToList":
                return { ...state, fileList: state.fileList.concat(action.files) };
            default:
                return state;
        }
    }

    // destructuring state and dispatch, initializing fileList to empty array
    const [data, dispatch] = useReducer(reducer, {
        inDropZone: false,
        fileList: [],
    });
    
    return (
        <div className='h-screen p-4'>

            <h1 className="sm:text-4xl text-3xl text-center font-semibold mt-10 mb-10 ">
             Getting started in just<span className="text-blue-500"> 3 </span>Steps
            </h1>
            <div className='flex justify-center'>
                {/* Writing down the steps */}
                <div className='sm:w-[60%]'>
                    <div className={cardStyle}>
                        <h2 className='font-semibold text-[20px] mb-3'>Download the CLI</h2>
                        <ul>
                            <li>➡️ Click <Link href={'/'}><span className='text-blue-500'>here</span> </Link>to download the supported versions of cli</li>
                            <li>➡️ Or visit our download page for installation</li>
                            <button id="button">Download</button>
                        </ul>
                    </div>

                    <div className={cardStyle}>
                        <h2 className='font-semibold text-[20px] mb-3'>Create your dev-contribution report completely offline</h2>
                        <Image src={demo} alt='demo gif' className='rounded-lg mb-4 h-[26rem]' />
                        <div>
                            <h4>➡️ run <span className='bg-gray-200 p-0.5 pl-1 pr-1 rounded-lg'>dev-profiler --find-repo</span> into devprofile cli</h4>
                            <h4 className='mb-3'>it will find all github rep and scans them</h4>
                            <h4>➡️ then run <span className='bg-gray-200  p-0.5 pl-1 pr-1 rounded-lg'>dev-profiler --find-repo</span> into devprofile cli</h4>
                            <h4>it will generate the report from scanned file</h4>
                        </div>
                    </div>

                    <div className={cardStyle}>
                        <h2 className='font-semibold text-[20px] mb-3'>Upload your report</h2>
                        <DropZone data={data} dispatch={dispatch} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default uploads