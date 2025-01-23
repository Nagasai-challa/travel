import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { FaMapMarkerAlt, FaStar, FaUtensils } from 'react-icons/fa';

const Restraunts = () => {
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
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+${searchQuery}&key=${apiKey}`
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
        setError('Failed to fetch restaurants. Please try again later.');
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <FaUtensils className="text-4xl text-gray-400 mb-2" />
          <p className="text-gray-500">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FaMapMarkerAlt className="text-red-500 text-2xl mr-2" />
            <h1 className="text-4xl font-bold text-gray-800">
              Restaurants in {searchQuery}
            </h1>
          </div>
          <p className="text-gray-600">
            Found {hotels.length} restaurants in your area
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {hotels.length > 0 ? (
            hotels.map((hotel, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative">
                  {hotel.photo ? (
                    <div className="relative h-48">
                      <img
                        className="w-full h-full object-cover"
                        src={hotel.photo}
                        alt={hotel.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <FaUtensils className="text-4xl text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2">
                    <div className="bg-white/90 px-2 py-1 rounded-lg flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-semibold">{hotel.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {hotel.name}
                  </h2>
                  <div className="flex items-start text-gray-600">
                    <FaMapMarkerAlt className="mt-1 mr-2 flex-shrink-0" />
                    <p className="text-sm line-clamp-2">{hotel.address}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <FaUtensils className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No restaurants found in this location.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restraunts;
