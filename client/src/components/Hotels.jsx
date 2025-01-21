import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const { searchQuery } = useParams();

  useEffect(() => {
    const fetchHotels = async () => {
      if (!searchQuery) return;

      try {
        const apiKey = 'AIzaSyBpQWSZEN3fSnlfJjGa-lr56zjwFlx3mL8';
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+or+rooms+in+${searchQuery}&key=${apiKey}`
        );

        const fetchedHotels = response.data.results.map((place) => ({
          name: place.name,
          address: place.formatted_address || 'Address not available',
          rating: place.rating || 'Not rated',
          photo: place.photos?.[0]
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
            : null,
        }));

        setHotels(fetchedHotels);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    fetchHotels();
  }, [searchQuery]);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Hotels in {searchQuery}
      </h1>
      <div className="text-left grid sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
        {hotels.length > 0 ? (
          hotels.map((hotel, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-64 mx-auto"
              style={{ height: '400px' }} // Increased height
            >
              {hotel.photo && (
                <img
                  className="w-full h-48 object-cover"
                  src={hotel.photo}
                  alt={hotel.name}
                />
              )}
              <div className="p-4 flex flex-col  h-full">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {hotel.name}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {hotel.address}
                  </p>
                </div>
                <p className="text-green-600 text-sm font-bold">
                  Rating: {hotel.rating} ☆
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No hotels found for this location.
          </p>
        )}
      </div>
    </div>
  );
};

export default Hotels;
