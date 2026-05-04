import React from 'react'
import AboutHero from '../components/about/AboutHero'
import BrandStory from '../components/home/BrandStory'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import VisionMission from '../components/about/VisionMission'
import FounderProfile from '../components/about/FounderProfile'

const About = () => {
  return (
    <div>
        <Navbar/>
      <AboutHero/>
      <BrandStory/>
      <FounderProfile/>
      <VisionMission/>
      <Footer/>
    </div>
  )
}

export default About
