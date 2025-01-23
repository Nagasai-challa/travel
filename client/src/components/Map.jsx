import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Autocomplete } from '@react-google-maps/api';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Utensils , Hotel, Church } from 'lucide-react';

const Map = () => {
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({
    lat: 40.749933,
    lng: -73.98633
  });
  const [photos, setPhotos] = useState([]);
  const [placeName, setPlaceName] = useState('');
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAcztM5n1gdyLc4T9rgQXGQm-CPZR4INfA',
    libraries: ['places']
  });

  const actionButtons = [
    {
      label: 'Restaurants',
      icon: Utensils ,
      path: '/get-restaurants'
    },
    {
      label: 'Hotels',
      icon: Hotel,
      path: '/get-hotels'
    },
    {
      label: 'Temples',
      icon: Church,
      path: '/get-temples'
    }
  ];

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };

      setPlaceName(place.name);
      setMarkerPosition(newLocation);
      map.panTo(newLocation);
      map.setZoom(15);

      // Get location photos
      const photoUrls = place.photos 
        ? place.photos.map(photo => photo.getUrl({ maxWidth: 300 })) 
        : [];
      setPhotos(photoUrls);
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Search Input */}
        <div className="mb-6 flex items-center">
          <MapPin className="mr-3 text-blue-500" />
          <Autocomplete
            onLoad={setAutocomplete}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Search destinations"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </Autocomplete>
        </div>

        {/* Map */}
        <div className="mb-6 rounded-lg overflow-hidden">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={markerPosition}
            zoom={13}
            onLoad={setMap}
          >
            <Marker position={markerPosition} />
          </GoogleMap>
        </div>

        {/* Photos */}
        {photos.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            {photos.slice(0, 4).map((url, index) => (
              <img 
                key={index} 
                src={url} 
                alt={`Location ${index + 1}`} 
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4">
          {actionButtons.map((button) => (
            <button
              key={button.label}
              onClick={() => navigate(`${button.path}/${placeName}`)}
              className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <button.icon className="mb-2 text-blue-500" size={32} />
              <span className="text-blue-700">{button.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;