import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router'
import Navbar from './Component/Navbar'
import Home from './Component/Home'
import Signup from './Component/Signup'
import Signin from './Component/Signin'
import WeatherPrediction from './Component/WeatherPrediction'
import CropPrediction from './Component/CropPrediction'
import FertiliserPrediction from './Component/FertiliserPrediction'
import PlantDisease from './Component/PlantDisease'
import PestPrediction from './Component/PestPrediction'
import Profile from './Component/Profile'
import Footer from './Component/Footer'
import Aboutus from './Component/Aboutus'

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/weather' element={<WeatherPrediction/>}/>
        <Route path='/crop' element={<CropPrediction/>}/>
        <Route path='/fertiliser' element={<FertiliserPrediction/>}/>
        <Route path='/plant' element={<PlantDisease/>}/>
        <Route path='/pest' element={<PestPrediction/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/aboutus' element={<Aboutus/>}/>
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  )
}

export default App