import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { requestForToken, onMessageListener } from './utils/firebase';

const Notification = () => {
    const [notification, setNotification] = useState({ title: '', body: '' });
    const notify = () => toast(<ToastDisplay />);
    function ToastDisplay () {
        return (
            <div
                style={{
                    // background: '#FFFFFF',
                    // boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
                    // borderRadius: 20,
                    padding: 10,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                <div className='ml-3'>
                    <p>
                        <b>{notification?.title}</b>
                    </p>
                    <p>{notification?.body}</p>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (notification?.title) {
            notify();
        }
    }, [notification]);

    requestForToken();

    onMessageListener()
        .then(payload => {
            setNotification({ title: payload?.notification?.title, body: payload?.notification?.body });
        })
        .catch(err => console.log('failed: ', err));

    return <Toaster />;
};

export default Notification;
