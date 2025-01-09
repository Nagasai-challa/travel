import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Autocomplete } from '@react-google-maps/api';
import axios from 'axios';
import { Link } from 'react-router';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 40.749933,
  lng: -73.98633,
};

const Map = () => {
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(center);
  const [photos, setPhotos] = useState([]);
  const [placeName, setPlaceName] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [hotels, setHotels] = useState([]);
  const [rooms,setRooms] = useState([]);
  const [whichComponent, setWhichComponent] = useState('');
  const [tempuls, setTempuls] = useState([]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBpQWSZEN3fSnlfJjGa-lr56zjwFlx3mL8', // Replace with your actual API key
    libraries: ['places'],
  });

  const onLoad = (map) => setMap(map);
  const onUnmount = () => setMap(null);

  // Fetch hotels when searchQuery changes
  useEffect(() => {
    const fetchHotels = async () => {
      if (!searchQuery) return; // Don't fetch if there's no search query

      try {
        const apiKey = 'AIzaSyBpQWSZEN3fSnlfJjGa-lr56zjwFlx3mL8'; 
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+${searchQuery}&key=${apiKey}`
        );

        const response2 = await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+or+rooms+in+${searchQuery}&key=${apiKey}`
        );

        const tempulResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=temples+in+${searchQuery}&key=${apiKey}`
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

        const roomDetails = response2.data.results.map((place) => ({
          name: place.name,
          address: place.formatted_address || 'Address not available',
          rating: place.rating || 'Not rated',
          photos: place.photos?.map((photo) => ({
            url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
          })) || [],
        }));

        console.log("tempul Response :"+tempulResponse.data);

        const tempulDetails = tempulResponse.data.results.map((place) => ({
          name: place.name,
          address: place.formatted_address || 'Address not available',
          rating: place.rating || 'Not rated',
          photos: place.photos?.map((photo) => ({
            url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
          })) || [],
        }));

        setRooms(roomDetails);
        setTempuls(tempulDetails);
        console.log('Room Details:', roomDetails);
        console.log('Tempuls Details:', tempulDetails);
        setHotels(roomDetails);
        console.log('Room Details:', roomDetails);

        setHotels(fetchedHotels);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    fetchHotels();
  }, [searchQuery]); // Add searchQuery to dependency array

  const onPlaceChanged = () => {
    if (autocomplete) {
      const newPlace = autocomplete.getPlace();
      setPlaceName(newPlace.name || "");
      console.log('New place:', newPlace.name); // Log the new place name
      if (newPlace.geometry) {
        const location = {
          lat: newPlace.geometry.location.lat(),
          lng: newPlace.geometry.location.lng(),
        };
        setMarkerPosition(location);
        map.panTo(location);
        map.setZoom(17);
      }

      if (newPlace.photos) {
        const photoUrls = newPlace.photos.map(photo =>
          photo.getUrl({ maxWidth: 400 })
        );
        setPhotos(photoUrls);
      }

      // Update search query based on the selected place
      setSearchQuery(newPlace.name || ""); // Set search query for fetching hotels
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

  const hotelsComponent=()=>{
      return(
        <div className='flex flex-wrap gap-6 items-center justify-center'>
            {hotels.length > 0 ? (
              hotels.slice(0,6).map((hotel, index) => (
                  <div className='flex flex-col border-2 h-[800px] w-60'>
                        {hotel.photos.length > 0 && (
                          <img className="object-cover rounded h-1/2"
                          src={hotel.photos[0].url} alt={hotel.name} />
                        )}
                        <div className='h-1/4 flex flex-col p-5 text-left space-y-4'>
                          <h2 className="text-lg font-semibold">{hotel.name}</h2>
                          <p>{hotel.address}</p>
                          <p className='text-green-600 font-bold'>Rating: {hotel.rating} ☆</p>
                        </div>
                  </div>
              ))
            ) : (
              <p>No Restraunts found for this location.</p>
            )}
        </div>
      )
  }

  const roomsComponent=()=>{
      return(
          <div className='flex flex-wrap gap-6 items-center justify-center'>
            {rooms.length > 0 ? (
              rooms.slice(0,6).map((hotel, index) => (
                <div key={index} 
                className="flex flex-col border-2 w-60">
                  {hotel.photos.length > 0 && (
                      <img className="object-cover rounded"
                      src={hotel.photos[0].url} alt={hotel.name} />
                    )}
                  <div className='flex flex-col p-5 text-left space-y-4'>
                    <h2 className="text-lg font-semibold">{hotel.name}</h2>
                    <p>{hotel.address}</p>
                    <p className='text-green-600 font-bold'>Rating: {hotel.rating} ☆</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No hotels found for this location.</p>
            )}
          </div>
      )
  }
  const templeComponent=()=>{
      return(
          <div className='flex flex-wrap gap-6 items-center justify-center'>
            {tempuls.length > 0 ? (
              tempuls.slice(0,6).map((hotel, index) => (
                <div key={index} 
                className="flex flex-col border-2 w-60">
                  {hotel.photos.length > 0 && (
                      <img className="object-cover rounded"
                      src={hotel.photos[0].url} alt={hotel.name} />
                    )}
                  <div className='flex flex-col p-5 text-left space-y-4'>
                    <h2 className="text-lg font-semibold">{hotel.name}</h2>
                    <p>{hotel.address}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No Temples found for this location.</p>
            )}
          </div>
      )
  }

  const getActiveComponent=()=>{
      {
        if(whichComponent==='hotels'){ 
            return hotelsComponent(); 
        }else if(whichComponent==='rooms'){
            return roomsComponent();
        }else if(whichComponent==='tempuls'){
            return templeComponent();
        }
      }
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
          className="w-full p-2 border rounded"
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
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
      <br/>
      <div className='flex flex-wrap gap-20 items-center justify-center'>
          <button className='text-center h-28 w-48 shadow-lg p-5 rounded-lg border-2'
          onClick={()=>setWhichComponent('hotels')}>
              Restraunts
          </button>
          <button className='text-center h-28 w-48 shadow-lg p-5 rounded-lg border-2'
          onClick={()=>setWhichComponent('rooms')}>
              Hotels
          </button>
          <button className='text-center h-28 w-48 shadow-lg p-5 rounded-lg border-2'
          onClick={()=>{
            setWhichComponent('tempuls');
          }}
          >
              Tempuls
          </button>
          <Link to={"/train-details"}>
            <button className='text-center h-28 w-48 shadow-lg p-5 rounded-lg border-2'
            >
                Traing Booking Details
            </button>
          </Link>
          <button className='text-center h-28 w-48 shadow-lg p-5 rounded-lg border-2'
          onClick={()=>setWhichComponent('rooms')}>
              Flight Bookings
          </button>
          <button className='text-center h-28 w-48 shadow-lg p-5 rounded-lg border-2'
          >
              Room Bookings
          </button>
      </div>
      

      {
          getActiveComponent()
      }
      
    </div>
  );
};

export default Map;
