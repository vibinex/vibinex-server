import React from 'react';
import Link from 'next/link';
// import {AiOutlineMenu, AiOUlineClose} from 'react-icons';
const Navbar = () => {
    return (
        <section className='fixed left-0 top-0 w-full z-10 ease-in duration-300 text-white '>
            <div className='max-w-[1240px] m-auto flex justify-between item-center p-4'>

                <div>
                    <Link href='/' />
                    <h1 className='font-bold text-3xl'>devProfile</h1>
                </div>
                <ul className='hidden sm:flex'>
                    <li className='p-4'>
                        <Link href='/'>Home</Link>
                    </li>
                    <li className='p-4'>
                        <Link href='/#whyUs'>Why Us?</Link>
                    </li>
                    <li className='p-4'>
                        <Link href='/steps'>Steps</Link>
                    </li>
                    <li className='p-4'>
                        <Link href='/contact'>Contact</Link>
                    </li>
                </ul>

                {/* For Phone */}
                <div className='sm:block hidden'>
                    <h3 className='text-[50px]'>∍</h3>
                </div>

                {/* Phone Menu */}
                <div >
                    <ul>
                        <li>
                            <Link href='/'>Home</Link>
                        </li>
                        <li>
                            <Link href='/#whyUs'>Why Us?</Link>
                        </li>
                        <li>
                            <Link href='/steps'>Steps</Link>
                        </li>
                        <li>
                            <Link href='/contact'>Contact</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default Navbar