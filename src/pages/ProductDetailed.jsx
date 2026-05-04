import React from 'react'
import Productdetail from '../components/shop/Productdetail'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductsSection from "../components/shop/ProductsSection"
import RelatedProducts from '../components/shop/RelatedProducts'

const ProductDetailed = () => {
  return (
    <div>
        <Navbar/>
        <Productdetail/>
        <RelatedProducts/>
        
        <Footer/>
        
    </div>
  )
}

export default ProductDetailed