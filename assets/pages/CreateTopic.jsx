import React, { useState } from 'react'

export default function CreateTopic() {
    const [formData, setformData] = useState({});

    const handleChange = (e) => {
        setFormState({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here
    };

    return (
        <form onSubmit={handleSubmit} className='form-create'>
            <div>
                <label>Title</label>
                <input
                    type="text"
                    name="title"
                    value={formState.title}
                    onChange={handleChange}
                    className="form-input-text"
                />
            </div>

            <div>
                <label>Equipment</label>
                <select
                    name="equipment"
                    value={formState.equipment}
                    onChange={handleChange}
                    className="form-input-select"
                >
                    {/* Map over your equipment options here */}
                </select>
            </div>

            <div>
                <label>Article</label>
                <select
                    name="article"
                    value={formState.article}
                    onChange={handleChange}
                    className="form-input-select"
                >
                    {/* Map over your article options here */}
                </select>
            </div>

            <div>
                <label>Message Author</label>
                <textarea
                    name="msgAuthor"
                    value={formState.msgAuthor}
                    onChange={handleChange}
                    className="form-input-text"
                />
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}
