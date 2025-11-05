import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
       <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-16 my-10 mt-40 text-sm'>
            {/*---left side--- */}
            <div>
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam facilis vero quae nobis animi adipisci, magnam nesciunt sequi assumenda hic cupiditate optio, ex reprehenderit provident, numquam obcaecati deleniti incidunt atque.</p>
            </div>
            {/*----middle---- */}
            <div>
                <p className='text-xl font-medium mb-5'>Compony</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            {/*---right--- */}
            <div>
                <p className='text-xl font-medium mb-5'>Get in Touch</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+91 987-654-3210</li>
                    <li>doctors@gmail.com</li>
                </ul>
            </div>

       </div>
       {/*--copyright*/}
       <div>
        <hr />
        <p className='p-5 text-small text-center'>Copyright 2025@ -All Right Reserved</p>
       </div>
    </div>
  )
}

export default Footer
