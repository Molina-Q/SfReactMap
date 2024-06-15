import React from "react";
import { Link } from "react-router-dom";

export default function SingleImg({ item, className, clickEvent, isLink }) {
	// path to the picture of the item
	const pathImg = `/img/upload/${item.img}`;

	return (
		<figure
			key={item.id}
			className={className}
			onClick={() => clickEvent(item.id)}
		>
			<img src={pathImg} alt={item.name} />

			<figcaption>
				{isLink ? (
					<Link className="figcaption-item" to={`/equipment?item=${item.id}`}>
						{item.name}
					</Link>
				) : (
					<p className="figcaption-item">{item.name}</p>
				)}
			</figcaption>
		</figure>
	);
}