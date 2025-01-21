import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const GetLiveStatus = () => {
  const { trainNo } = useParams();
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}${month}${day}`;

  const [stationData, setStationdata] = useState(null);
  const [currentStation, setCurrentStation] = useState('');

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await fetch(
          `https://indian-railway-irctc.p.rapidapi.com/api/trains/v1/train/status?departure_date=${formattedDate}&isH5=true&client=web&train_number=${trainNo}`,
          {
            headers: {
              'x-rapidapi-key': '2efb2634b8msh5075af0e1cd964ap17db04jsn7ebd61dd5771',
              'x-rapidapi-host': 'indian-railway-irctc.p.rapidapi.com',
            },
          }
        );
        const data = await response.json();
        setCurrentStation(data.body.train_status_message);
        setStationdata(data.body.stations);
      } catch (error) {
        console.error('Error fetching train data:', error);
      }
    };
    getStatus();
  }, [formattedDate, trainNo]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Train Number: {trainNo}
      </h1>
      {stationData ? (
        <>
          <h2 className="text-2xl font-semibold text-center text-green-700 mb-8">
            Current Location: {currentStation.replace(/<[^>]*>/g, '')}
          </h2>
          <div className="flex flex-col items-center justify-center gap-6">
            {stationData.map((station, index) => (
              <div
                key={index}
                className="p-10 space-y-5  text-left border-2 border-gray-300 bg-white shadow-lg rounded-xl w-96"
              >
                <h3 className="text-center text-xl font-bold text-gray-900 mb-4">
                  {station.stationName}
                </h3>
                <p className="text-lg text-gray-700 mb-2">
                  <span className="font-bold">Platform No:</span>{' '}
                  {station.expected_platform || 'N/A'}
                </p>
                <p className="text-lg mb-2">
                  <span className="font-bold">Arrival Time:</span>{' '}
                  <span className="text-green-600">
                    {station.actual_arrival_time || 'N/A'}
                  </span>
                </p>
                <p className="text-lg">
                  <span className="font-bold">Departure Time:</span>{' '}
                  <span className="text-red-600">
                    {station.actual_departure_time || 'N/A'}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <h2 className="text-center text-xl text-gray-700">Loading...</h2>
      )}
    </div>
  );
};

export default GetLiveStatus;
