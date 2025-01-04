import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlaceSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hotels, setHotels] = useState([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const apiKey = 'AIzaSyBpQWSZEN3fSnlfJjGa-lr56zjwFlx3mL8'; 
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+${searchQuery}&key=${apiKey}`
        );
        

        console.log('Response:', response.data);

        const fetchedHotels = response.data.results.map((place) => ({
          name: place.name,
          address: place.formatted_address || 'Address not available',
          rating: place.rating || 'Not rated',
          photos: place.photos?.map((photo) => ({
            url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
          })) || [],
        }));

        setHotels(fetchedHotels);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    if (searchQuery) {
      fetchHotels();
    }
  }, [searchQuery]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a place (e.g., Guntur)"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <ul>
        {hotels.map((hotel) => (
          <li key={hotel.name}>
            <h3>{hotel.name}</h3>
            <p>Address: {hotel.address}</p>
            <p>Rating: {hotel.rating}</p>
            <div>
              {hotel.photos.length > 0 && (
                <img src={hotel.photos[0].url} alt={`${hotel.name} photo`} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaceSearch;