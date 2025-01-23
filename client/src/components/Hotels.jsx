import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { FaMapMarkerAlt, FaStar, FaBed, FaSpinner } from 'react-icons/fa';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery } = useParams();

  useEffect(() => {
    const fetchHotels = async () => {
      if (!searchQuery) return;
      setLoading(true);
      try {
        const apiKey = 'AIzaSyBpQWSZEN3fSnlfJjGa-lr56zjwFlx3mL8';
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+or+rooms+in+${searchQuery}&key=${apiKey}`
        );

        setHotels(response.data.results.map((place) => ({
          name: place.name,
          address: place.formatted_address || 'Address not available',
          rating: place.rating || 'Not rated',
          photo: place.photos?.[0]
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
            : null,
        })));
      } catch (error) {
        setError('Failed to fetch hotels');
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="text-4xl text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <p className="mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-blue-100 px-4 py-2 rounded-full mb-4">
            <FaBed className="text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">Accommodation</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hotels in {searchQuery}
          </h1>
          <p className="text-gray-600">Found {hotels.length} places to stay</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hotels.map((hotel, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative">
                <div className="h-48 bg-gray-200">
                  {hotel.photo ? (
                    <img
                      className="w-full h-full object-cover"
                      src={hotel.photo}
                      alt={hotel.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaBed className="text-4xl text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-semibold">{hotel.rating}</span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {hotel.name}
                </h2>
                <div className="flex items-start space-x-2">
                  <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-600 text-sm line-clamp-2">{hotel.address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hotels;
