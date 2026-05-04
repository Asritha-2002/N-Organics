import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import ContactHero from '../components/contact/ContactHero'
import ContactContent from '../components/contact/ContactContent'

const Contact = () => {
  return (
    <div>
        <Navbar/>
        <ContactHero/>
        <ContactContent/>
      <Footer/>
    </div>
  )
}

export default Contact
