import React, { useState, useEffect } from 'react';

const TrainDetails = () => {
  const [trainData, setTrainData] = useState(null);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY="3c22ddc13deb16ad27f9f364e5f9b994";

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
      // Get source station code
      const sourceCode = await fetchStationCode(source);
      if (!sourceCode) throw new Error('Source station code not found');

      // Get destination station code
      const destCode = await fetchStationCode(destination);
      if (!destCode) throw new Error('Destination station code not found');

      // Get trains from source station
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
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Train Details</h1>
        
        <div className="text-left mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Source</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Enter source station"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination station"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button 
          onClick={fetchTrainData}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Searching...' : 'Search Trains'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {trainData && (
          <div className="mt-4">
            <h3 className=" text-lg font-semibold mb-2">Available Trains</h3>
            <div className=" text-left flex flex-wrap items-center justify-center gap-4 space-y-2">
              {trainData.Trains?.map((train) => (
                <div key={train.TrainNo} className="p-8 shadow-lg border-2 rounded">
                  <p className="font-medium">{train.TrainName}</p>
                  <p className="text-sm">Train No: {train.TrainNo}</p>
                  <p className="text-sm">Arrival: {train.ArrivalTime}</p>
                  <p className="text-sm">Departure: {train.DepartureTime}</p>
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