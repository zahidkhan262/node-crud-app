import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import queryString from 'query-string';

let socket;
const Chat = ({ location }) => {

    const [name, setName] = useState('');
    const [rooms, setRooms] = useState('');
    const END_POINT = 'localhost:5000';


    useEffect(() => {
        const { name, rooms } = queryString.parse(location);

        socket = io(END_POINT)
        setName(name)
        setRooms(rooms)
        console.log(socket);

    }, [END_POINT, location]);

    return (
        <>
        </>
    )
}

export default Chat