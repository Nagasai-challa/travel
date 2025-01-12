import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Map from "./components/Map";
import TrainDetails from "./components/TrainDetails";
import GetLiveStatus from './components/GetLiveStatus';

const MyRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Map/>}/>
        <Route path="/train-details" element={<TrainDetails/>}/>
        <Route path="/live-status/:trainNo" element={<GetLiveStatus/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default MyRouter;