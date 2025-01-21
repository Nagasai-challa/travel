import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Autocomplete } from '@react-google-maps/api';
import { Link, useNavigate } from 'react-router';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 40.749933,
  lng: -73.98633,
};

const Map = () => {
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [photos, setPhotos] = useState([]);
  const [placeName, setPlaceName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBpQWSZEN3fSnlfJjGa-lr56zjwFlx3mL8', // Replace with your actual API key
    libraries: ['places'],
  });

  useEffect(() => {
    // Restore location from localStorage on mount
    const savedPlaceName = localStorage.getItem('placeName');
    const savedMarkerPosition = JSON.parse(localStorage.getItem('markerPosition'));
    
    if (savedPlaceName && savedMarkerPosition) {
      setPlaceName(savedPlaceName);
      setMarkerPosition(savedMarkerPosition);
      setSearchQuery(savedPlaceName);
    }
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const newPlace = autocomplete.getPlace();
      const newPlaceName = newPlace.name || '';
      setPlaceName(newPlaceName);
      setSearchQuery(newPlaceName);

      if (newPlace.geometry) {
        const location = {
          lat: newPlace.geometry.location.lat(),
          lng: newPlace.geometry.location.lng(),
        };
        setMarkerPosition(location);
        map.panTo(location);
        map.setZoom(17);

        // Save to localStorage
        localStorage.setItem('placeName', newPlaceName);
        localStorage.setItem('markerPosition', JSON.stringify(location));
      }

      if (newPlace.photos) {
        const photoUrls = newPlace.photos.map((photo) =>
          photo.getUrl({ maxWidth: 400 })
        );
        setPhotos(photoUrls);
      }
    }
  };

  if (loadError) {
    return (
      <div className="w-full p-4 bg-red-100 text-red-700 rounded">
        Error loading Google Maps
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="w-full h-96 bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Autocomplete
        onLoad={(autocomplete) => setAutocomplete(autocomplete)}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Search locations"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={13}
        onLoad={setMap}
      >
        <Marker position={markerPosition} />
      </GoogleMap>

      <div className="flex flex-wrap gap-4 justify-center items-center">
        {photos.length > 0 ? (
          photos.slice(0, 8).map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Location ${index + 1}`}
              className="w-52 h-52 object-cover rounded"
            />
          ))
        ) : (
          <p>No photos available for this location.</p>
        )}
      </div>

      <br />
      <div className="flex flex-wrap gap-20 items-center justify-center">
        <button
          className="text-center h-28 w-48 shadow-lg p-5 rounded-lg border-2"
          onClick={() => navigate(`/get-restaurants/${searchQuery}`)}
        >
          Restaurants
        </button>
        <button
          className="text-center h-28 w-48 shadow-lg p-5 rounded-lg border-2"
          onClick={() => navigate(`/get-hotels/${searchQuery}`)}
        >
          Hotels
        </button>
        <button
          className="text-center h-28 w-48 shadow-lg p-5 rounded-lg border-2"
          onClick={() => navigate(`/get-temples/${searchQuery}`)}
        >
          Temples
        </button>
        <Link to={'/train-details'}>
          <button className="text-center h-28 w-48 shadow-lg p-5 rounded-lg border-2">
            Train Booking Details
          </button>
        </Link>
        <button className="text-center h-28 w-48 shadow-lg p-5 rounded-lg border-2"
        onClick={()=>{navigate("/get-flight-details")}}>
          Flight Bookings
        </button>
        <button className="text-center h-28 w-48 shadow-lg p-5 rounded-lg border-2">
          Room Bookings
        </button>
      </div>
    </div>
  );
};

export default Map;
