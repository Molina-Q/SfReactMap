import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { SlArrowDown } from "react-icons/sl";
import { IoCaretForwardOutline } from "react-icons/io5";

export default function Home() {
	const scrollRef = useRef(null);
	const handleClick = () => {
		scrollRef.current.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<main className="wrap-home">
			<section id="home-welcome">
				<h2 className="primary-title">Welcome to our Map</h2>
				<p>Here you will learn how to use the app and learn more about each country military equipment from the 14th to the 20th century</p>

				<SlArrowDown onClick={handleClick} size="4em" className="home-arrow" />
			</section>

			<article id="home-colour">
				<h3 ref={scrollRef}>
					Click on the colored countries to learn more about the country's
					equipments
				</h3>
				{/* <p>learn more about their Weapons, Armours or tools</p> */}
				<p>
					An article will appear with different section containing information
					about the country
				</p>

				<figure className="home-figure-map">
					<img src="/img/map_screen.PNG" alt="map" />
				</figure>
				<p>You can then click on any of the highlighted sub-titles to go deeper!</p>
				<figure className="home-figure-article">
					<img src="/img/article_screen.PNG" alt="an article of the map" />
				</figure>

				<p>The Section will give you more details about the equipments!</p>

				<figure className="home-figure-section">
					<img src="/img/section_screen.PNG" alt="a section in an article" />
				</figure>
			</article>

			<article id="home-timeline">
				<h3>Click on the timeline</h3>
				<p>This will change the content of the Article and reflect the border of the country using the clicked year.</p>
				<figure className="home-figure-timeline">
					<img src="/img/timeline_screen.webp" alt="timeline" />
				</figure>
			</article>

			<section id="home-equip">
				<h4>The Equipment section</h4>
				<p>You can check the weapons, armours and tools present in the map !</p>

				<figure className="home-figure-section">
					<img src="/img/equip_screen.PNG" alt="equipment" />
				</figure>

				<Link to="/equipment" className="button-main">
					<span>
						Equipment <IoCaretForwardOutline />
					</span>
				</Link>
			</section>

			<section id="home-forum">
				<h4>The Forum</h4>
				<p>You can discuss about anything present on the site.</p>

				<p>Countries, Weapons or History !</p>

				<figure>
					<img src="" alt="forum" />
				</figure>

				<Link to="/forum" className="button-main">
					<span>Forum</span>
				</Link>
			</section>
		</main>
	);
}
