import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const TrainDetails = () => {
  const [trainData, setTrainData] = useState(null);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [live, setLive] = useState("");
  const navigate=useNavigate();

  const API_KEY = "3c22ddc13deb16ad27f9f364e5f9b994";

  const fetchStationCode = async (stationName) => {
    try {
      const response = await fetch(
        `https://indianrailapi.com/api/v2/StationCodeOrName/apikey/${API_KEY}/SearchText/${stationName}/`
      );
      if (!response.ok) throw new Error('Failed to fetch station code');
      const data = await response.json();
      return data.Station[0]?.StationCode;
    } catch (error) {
      throw new Error(`Error fetching station code for ${stationName}: ${error.message}`);
    }
  };

  const fetchTrainData = async () => {
    setLoading(true);
    setError(null);
    try {
      const sourceCode = await fetchStationCode(source);
      if (!sourceCode) throw new Error('Source station code not found');

      const destCode = await fetchStationCode(destination);
      if (!destCode) throw new Error('Destination station code not found');

      const trainsResponse = await fetch(
        `https://indianrailapi.com/api/v2/AllTrainOnStation/apikey/${API_KEY}/StationCode/${sourceCode}/`
      );
      if (!trainsResponse.ok) throw new Error('Failed to fetch train data');
      
      const trainsData = await trainsResponse.json();
      setTrainData(trainsData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainData();
  }, []);


  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Train Details</h1>
        
        <div className="text-left mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium mb-2">Source Station</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Enter source station"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">Destination Station</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination station"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <button 
          onClick={fetchTrainData}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-4 rounded-lg text-lg font-semibold hover:bg-blue-600 disabled:bg-blue-300 transition duration-200"
        >
          {loading ? 'Searching for Trains...' : 'Search Trains'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-2 border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {trainData && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Available Trains</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainData.Trains?.map((train) => (
                <div key={train.TrainNo} className="p-6 shadow-xl border-2 rounded-xl hover:border-blue-500 transition duration-200 bg-white">
                  <div className="flex flex-col space-y-4">
                    <div className="border-b pb-4">
                      <h4 className="text-xl font-bold text-blue-600 mb-2">{train.TrainName}</h4>
                      <p className="text-lg font-semibold text-gray-700">Train No: {train.TrainNo}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Arrival:</span>
                        <span className="text-lg text-green-600 font-semibold">{train.ArrivalTime}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Departure:</span>
                        <span className="text-lg text-red-600 font-semibold">{train.DepartureTime}</span>
                      </div>
                    </div>

                    <button 
                      onClick={()=>navigate(`/live-status/${train.TrainNo}`)}
                      className="mt-4 w-full bg-blue-100 text-blue-600 p-3 rounded-lg font-medium hover:bg-blue-200 transition duration-200"
                    >
                      Get Live Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainDetails;