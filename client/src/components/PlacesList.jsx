import React, { useState } from 'react';
import { Star } from 'lucide-react';

const PlacesList = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  
  // Sample data structure for places
  const places = [
    {
      id: "ChIJ3fpK-1qXyzsRhGzfB4TqiQ8",
      name: "Sample Restaurant",
      rating: 4.5,
      reviews: 120,
      type: "Restaurant",
      priceLevel: 2,
      hours: [
        { days: "Mon-Fri", hours: "9:00 AM - 10:00 PM" },
        { days: "Sat-Sun", hours: "10:00 AM - 11:00 PM" }
      ]
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const renderPriceLevel = (level) => {
    return "$".repeat(level);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-semibold">Nearby Places</h1>
        </div>
        
        <div className="divide-y">
          {places.map(place => (
            <div 
              key={place.id} 
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedPlace(place.id === selectedPlace ? null : place.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{place.name}</h2>
                  <div className="flex items-center mt-1">
                    <div className="flex">{renderStars(place.rating)}</div>
                    <span className="ml-2 text-sm text-gray-600">
                      {place.rating} ({place.reviews} reviews)
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {place.type} • {renderPriceLevel(place.priceLevel)}
                  </div>
                </div>
              </div>
              
              {selectedPlace === place.id && (
                <div className="mt-4 space-y-2">
                  {place.hours.map((schedule, idx) => (
                    <div key={idx} className="text-sm text-gray-600">
                      <span className="inline-block w-24">{schedule.days}:</span>
                      <span>{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacesList;