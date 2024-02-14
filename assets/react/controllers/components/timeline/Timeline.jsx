import React, { useRef, useEffect, useState } from "react";

/**
 * the timeline at the bottom of the map
 * @param {string} defaultYear 
 * @param {callback} returnChecked 
 * @returns 
 */
const Timeline = ({ defaultYear = '1900', returnChecked }) => {


    const [defaultChecked, setDefaultChecked] = useState(defaultYear);
    const [checkedRadio, setCheckedRadio] = useState(defaultYear);

    // useEffect(() => {
    //     setCheckedRadio(defaultChecked);
    // }, []);

    const periods = ['1400', '1500', '1600', '1700', '1800', '1900'];
    
    // // called when a new radio is clicked 
    const handleChange = e => {
        // set it with the value of the clicked radio
        setCheckedRadio(e.target.value);
        // returnChecked(e.target.value);
    }
    
    // callback used by parent sfReactMap to get the value of the clicked radio
    useEffect(() => {
        returnChecked(checkedRadio); 
    }, [checkedRadio])

    /**
    * Function that loops on all of the periods sent in params and return a collection of radio inputs
    */
    // deleted the original function because it was creating a bug that reseted the component after a click(and was completely unnecessary)
    // Note for the future : never create a component inside a component !!!
    
    const elements = []; // array that will have every input radio of the timeline

    for (let period of periods) {

        // push each country's geometry in the array, and use their names as key
        elements.push(
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
        );

    }

    return elements;
  
}   

export default Timeline;