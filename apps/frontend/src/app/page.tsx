import { LandingComp } from '@/components/landingComp'
import React from 'react'
import LandingNavbar from '@/components/LandingNavbar'
import Landingheader from '@/components/LandingHeader'
import SecondHero from '@/components/SecondHero'
const Landing = () => {
  return (
    <div>
    <LandingNavbar />
    <Landingheader />
    <SecondHero />
    <LandingComp />
    </div>
  )
}

export default Landing
