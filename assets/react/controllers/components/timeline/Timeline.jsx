import React, { useRef, useEffect, useState } from "react";

/**
 * the timeline at the bottom of the map
 * @param {string} defaultYear 
 * @returns 
 */
const Radio = ({ defaultYear = '1900', returnChecked }) => {
    const checkedDefault = defaultYear ;
    // console.log(defaultYear.defaultYear)


    const [CheckedRadio, setCheckedRadio] = useState(checkedDefault);

    const periods = ['1400', '1500', '1600', '1700', '1800', '1900'];
    
    // called when a new radio is clicked 
    const handleChange = e => {
        setCheckedRadio(e.target.value);

        returnChecked(e.target.value);
    }
    
    console.log('Current checked radio', CheckedRadio);

    /**
    * Function that loops on all of the periods sent in params and return a collection of radio inputs
    */
    function Radiobox() {
        const elements = []; // array that will have every input radio of the timeline

        for (let period of periods) {

            // push each country's geometry in the array, and use their names as key
            elements.push(<div key={period}>
                <input 
                    type="radio" 
                    name="timelineYear"  
                    value={period} 
                    id={period} 
                    onChange={handleChange} 
                    defaultChecked={period === CheckedRadio ? true : false}
                />
                <label htmlFor={period}>{period}</label>
              </div>
            );

        }

        return elements;
    };

    return (
        <Radiobox />
    );
}   

export default Radio;