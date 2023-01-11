import React, { useReducer, useEffect, useState } from 'react'
import Image from 'next/image'
import demo from '../public/howToRun.gif'
import Link from 'next/link'
import DropZone from '../components/DropZone'
import wowMan from '../public/wowMan v1.png'

const upload = () => {

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
    const [os, setOs] = useState('Mobile Device')

    // detecting client os 
    useEffect(() => {
        let os = navigator.userAgent;
        console.log(navigator.userAgent.search)
        let finalOs = "";
        if (os.search('Windows') !== -1) {
            finalOs = "Windows";
        }
        else if (os.search('Mac') !== -1) {
            finalOs = "MacOS";
        }
        else if (os.search('X11') !== -1 && !(os.search('Linux') !== -1)) {
            finalOs = "UNIX";
        }
        else if (os.search('Linux') !== -1 && os.search('X11') !== -1) {
            finalOs = "Linux"
        }
        setOs(finalOs)
    }, [])

    return (
        <div className='h-screen p-4'>
            <div className='sm:hidden block w-[90%] m-auto mt-[25%]'>
                <Image src={wowMan} alt='Standing Man Image' className='w-[50%] m-auto' />
                <div className='p-3 border rounded-lg'>
                    <h2 className='font-semibold text-[1.2rem] mb-2'>Not Supported in Mobile Devices</h2>
                    <p>
                        devProfile is not available for mobile devices. You can see the complete list of executables here.
                    </p>
                    <Link href={'/download'}>
                        <h2 className='font-bold bg-primary-main text-center p-2 text-primary-light rounded-lg mt-3'>
                            Download
                        </h2>
                    </Link>
                </div>
            </div>
            <div className='sm:block hidden md:w-[80%] lg:w-[60%] m-auto'>
                <h1 className="sm:text-4xl text-3xl text-center font-semibold mt-10 mb-10 ">
                    Getting started in just<span className="text-blue-500"> 3 </span>Steps
                </h1>
                <div className='flex justify-center'>
                    {/* Writing down the steps */}
                    <div>
                        <div className={cardStyle}>
                            <h2 className='font-semibold text-[20px] mb-3'>Download the CLI</h2>
                            <ul>
                                <li>➡️ Click <Link href={'/'}><span className='text-blue-500'>here</span> </Link>to download the supported versions of cli</li>
                                <li>for your <span className='font-semibold'>{os} </span>operating system</li>
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
        </div>
    )
}

export default upload