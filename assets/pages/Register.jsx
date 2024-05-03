import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/UI/Alert";
import Loading from "../components/UI/animation/Loading";

export default function Register() {
	const [user, setUser] = useState({}); // Initialize user state
	const [dataMessage, setDataMessage] = useState(null); // Initialize dataMessage state
    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

		setDataMessage(null);

        fetch('/api/register', { // Replace with your Symfony endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        .then(response => response.json())
        .then(data => {
            // Handle response data...
			setDataMessage(data)
        })
        .catch((error) => {
            setDataMessage(error)
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields here, e.g.: */}
			<label htmlFor="username">Username</label>
            <input type="text" name="username" onChange={handleChange} />

			<label htmlFor="email">Email</label>
            <input type="email" name="email" onChange={handleChange} />

			<label htmlFor="password">Password</label>
            <input type="password" name="password" onChange={handleChange} />
            {/* Add other fields as necessary */}
            <button onClick={handleSubmit} >
				Register
			</button>
			{dataMessage && <p>{dataMessage}</p>}
        </form>
    );
}
