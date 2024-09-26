import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { io } from "socket.io-client";

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
        setData(response.data.data);
    };
    useEffect(() => {
        const socket = io('http://localhost:4000'); // Backend URL
        console.log("AAAAA");
        socket.on('update', () => {
            if (token) {
                fetchOrders();
            }
        });

        if (token) {
            fetchOrders();
        }

        return () => {
            socket.disconnect();
        };
    }, [token]);

    const [showStatus, setShowStatus] = useState(false);

    const toggleStatus = () => {
        setShowStatus(!showStatus);
    };

  return (
    <div className='my-orders'>
        <h2 className='myordersp'>My Orders</h2>
        <div className="container">
            {data.map((order,index)=>{
                return (
                    <div key={index} className='my-orders-order'>
                        <img src={assets.parcel_icon} alt="" />
                        <p>{order.items.map((item,index)=>{
                            if (index === order.items.length-1) {
                                return item.name+" x "+item.quantity
                            }
                            else{
                                return item.name+" x "+item.quantity+","
                            }
                        })}</p>
                        <p>${order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        {showStatus?
                                                <button onClick={toggleStatus} style={{backgroundColor: '#34e773'}}>
                                                    <div><p><span>&#x25cf;</span> <b>{order.status}</b></p></div>
                                                </button>
                                                :<button onClick={toggleStatus}>Track Order</button>
                        }
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default MyOrders