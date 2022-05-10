import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Join = () => {
    const [name, setName] = useState('');
    const [rooms, setRooms] = useState('');

    return (
        <>
            <div className="my_container  d-f justify-center margin-t-100">
                <div className="main-form center">
                    <h2 className="heading">Join</h2>
                    <div className="input_field">
                        <input type="text" placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="input_field">
                        <input type="text" placeholder='Enter Room' value={rooms} onChange={(e) => setRooms(e.target.value)} />
                    </div>
                    <Link to={`/chat?name=${name}&rooms=${rooms}`} onClick={(e) => (!name || !rooms) ? e.preventDefault() : null}>
                        <button className='submit_btn' type='submit'>Sign In</button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Join