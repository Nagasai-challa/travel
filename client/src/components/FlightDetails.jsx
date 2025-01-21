import React from 'react'
import { useEffect } from 'react';
const FlightDetails = () => {
    useEffect(()=>{
        const getStatus = async () => {
            try {
              const response = await fetch(
                `https://timetable-lookup.p.rapidapi.com/airports/LHR/routes/BA/`,
                {
                  headers: {
                    'x-rapidapi-key': '2efb2634b8msh5075af0e1cd964ap17db04jsn7ebd61dd5771',
                    'x-rapidapi-host': 'timetable-lookup.p.rapidapi.com',
                  },
                }
              );
              const data = await response.json();
              console.log(data.body);
            } catch (error) {
              console.error('Error fetching train data:', error);
            }
        };
    
        getStatus();
    },[])
  return (
    <div>
            <h1>Flight Details</h1>
    </div>
  )
}

export default FlightDetails
