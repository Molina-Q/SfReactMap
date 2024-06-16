import React from "react";
import { Link } from "react-router-dom";

export default function ProfileAdmin() {
    const style = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: "1rem"
    };

    const btnStyle = {
        padding: "1rem",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1.2rem",
    };
    

	return (
		<div style={style}>
			<Link to="/article/create" >
				<button style={btnStyle}>Create an Article</button>
			</Link>
			<Link to="/section/create">
				<button style={btnStyle}>Create a Section</button>
			</Link>
            <Link to="/equipment/create">
				<button style={btnStyle}>Create an Equipment</button>
			</Link>
		</div>
	);
}
