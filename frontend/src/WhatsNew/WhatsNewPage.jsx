import React, { useEffect, useState } from 'react';
import NewRestaurantList from './NewRestaurantList';
import WhatsNewBackend from '../apis/WhatsNewBackend';

const WhatsNewPage = () => {
    const [newRests, setNewRests] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        const getData = async () => {
            try {
                const response = await WhatsNewBackend.get("/", {
                    headers: {
                        token: token
                    }
                });
                setNewRests(response.data.data.newRestaurants);
                //console.log(newRests);
            } catch (err) {
                console.error(err.message);
            }
        };
        getData();
    }, []);

  return (
    <div>
        <div>
            <h1 className="text-warning text-center">What's New?</h1>
        </div>
        <div className="my-3 p-2">
            <NewRestaurantList newRestaurants={newRests} />
        </div>
    </div>
  )
}

export default WhatsNewPage;