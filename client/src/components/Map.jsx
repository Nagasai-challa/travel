import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Autocomplete } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 40.749933,
  lng: -73.98633
};

const Map = () => {
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(center);
  const [photos, setPhotos] = useState([]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBpQWSZEN3fSnlfJjGa-lr56zjwFlx3mL8',
    libraries: ['places']
  });

  const onLoad = map => setMap(map);
  const onUnmount = () => setMap(null);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setMarkerPosition(location);
        map.panTo(location);
        map.setZoom(17);

        if (place.photos) {
          const photoUrls = place.photos.map(photo => 
            photo.getUrl({ maxWidth: 400 })
          );
          setPhotos(photoUrls);
        }
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
        onLoad={setAutocomplete}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Search locations"
          className="w-full p-2 border rounded"
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker position={markerPosition} />
      </GoogleMap>

      <div className="flex flex-wrap gap-2">
        {photos.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Location ${index + 1}`}
            className="w-24 h-24 object-cover rounded"
          />
        ))}
      </div>
      <a href="/test.html" target="_blank" rel="noopener noreferrer">
        Open Example HTML
      </a>
    </div>
  );
};

export default Map;