import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Map from "./components/Map";
import TrainDetails from "./components/TrainDetails";

const MyRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Map/>}/>
        <Route path="/train-details" element={<TrainDetails/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default MyRouter;