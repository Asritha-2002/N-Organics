import React from 'react'
import ShopHero from '../components/shop/ShopHero'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductsSection from '../components/shop/ProductsSection'

const Shop = () => {
  return (
    <div>
        <Navbar/>
        <ShopHero/>
        <ProductsSection/>
        <Footer/>
    </div>
  )
}

export default Shop