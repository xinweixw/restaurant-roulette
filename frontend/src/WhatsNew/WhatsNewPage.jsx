import React, { useEffect, useState } from 'react';
import NewRestaurantList from './NewRestaurantList';
import WhatsNewBackend from '../apis/WhatsNewBackend';
import Loading from '../assets/Loading';
import "./WhatsNewPage.css";

const WhatsNewPage = () => {
    const [newRests, setNewRests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        const getData = async () => {
            try {
                setLoading(true);
                const response = await WhatsNewBackend.get("/", {
                    headers: {
                        token: token
                    }
                });
                setNewRests(response.data.data.newRestaurants);
                //console.log(newRests);
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    if (loading) {
        return <Loading />;
    }

  return (
    <div className="whatsnew-container">
        <div>
            <h1>What's New?</h1>
        </div>
        <div>
            <NewRestaurantList newRestaurants={newRests} />
        </div>
    </div>
  )
}

export default WhatsNewPage;