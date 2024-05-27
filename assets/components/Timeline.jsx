import React, { useEffect, useState } from "react";

/**
 * the timeline at the bottom of the map
 * @param {string} defaultYear
 * @param {callback} returnChecked
 * @returns
 */
const Timeline = ({ defaultYear = "1900", returnChecked }) => {
	const defaultChecked = defaultYear;
	const [checkedRadio, setCheckedRadio] = useState(defaultYear);

	const periods = ["1400", "1500", "1600", "1700", "1800", "1900"];

	// called when a new radio is clicked
	const handleChange = (e) => {
		setCheckedRadio(e.target.value);
		returnChecked(e.target.value);
	};

	return (
		<>
			{periods.map((period) => (
				<div key={period}>
					<input
						type="radio"
						name="timelineYear"
						value={period}
						id={period}
						onChange={handleChange}
						defaultChecked={period === defaultChecked}
					/>
					<label htmlFor={period}>{period}</label>
				</div>
			))}
		</>
	);
};

export default Timeline;
