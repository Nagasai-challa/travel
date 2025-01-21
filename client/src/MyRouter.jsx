import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Map from "./components/Map";
import TrainDetails from "./components/TrainDetails";
import GetLiveStatus from './components/GetLiveStatus';
import Hotels from './components/Hotels';
import Tempuls from './components/Tempuls';
import Restraunts from './components/Restraunts';


const MyRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Map/>}/>
        <Route path="/train-details" element={<TrainDetails/>}/>
        <Route path="/live-status/:trainNo" element={<GetLiveStatus/>}/>
        <Route path="/get-hotels/:searchQuery" element={<Hotels/>} />
        <Route path="/get-temples/:searchQuery" element={<Tempuls/>} />
        <Route path="/get-restaurants/:searchQuery" element={<Restraunts/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default MyRouter;