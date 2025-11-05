import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome to Prescripto. We are here to help you with any questions or concerns you may have regarding our healthcare platform. Whether you need assistance with appointments, have feedback, or require support, our team is ready to assist you.</p>
          <p>At Prescripto, we value your time and strive to provide prompt and efficient responses. Feel free to reach out to us through any of the channels below. We look forward to hearing from you and helping you with your healthcare needs.</p>
          <b className='text-gray-800'>Get in Touch</b>
          <p>Our dedicated support team is available to answer your queries and provide guidance. Contact us today to experience seamless healthcare management.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>OUR <span className='text-gray-700 font-semibold'>CONTACT INFORMATION</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] text-gray-600'>
          <b>EMAIL:</b>
          <p>support@prescripto.com</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] text-gray-600'>
          <b>PHONE:</b>
          <p>+1-800-123-4567</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] text-gray-600'>
          <b>ADDRESS:</b>
          <p>123 Healthcare St<br />Medical City, USA</p>
        </div>
      </div>
    </div>
  )
}

export default Contact
