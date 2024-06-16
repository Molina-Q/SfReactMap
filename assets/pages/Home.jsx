import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { SlArrowDown } from "react-icons/sl";
import { IoCaretForwardOutline } from "react-icons/io5";
import { Helmet } from "react-helmet-async";

export default function Home() {
	const scrollRef = useRef(null);
	const handleClick = () => {
		scrollRef.current.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<main className="wrap-home" id="wrapperMain">
			<Helmet>
				<title>The Armoury - Home</title>
				<meta
					name="description"
					content="Welcome to The Armoury, a website where you can learn about the military gear of different countries from the 14th to the 20th century."
				/>
			</Helmet>
			<h2 className="primary-title">
				Welcome to <strong className="primary-span">The Armoury</strong>
			</h2>

			<section id="home-welcome">
				<h3>Learn more about history</h3>

				<p>
					Here you will learn how to use the app and learn more about each
					country's <strong>military gear</strong> from the 14th to the 20th
					century
				</p>

				<p>
					You will find <strong>Weapons</strong>, <strong>Armours</strong> and
					different <strong>Tools</strong> they used back then!
				</p>

				<SlArrowDown onClick={handleClick} size="4em" className="home-arrow" />
			</section>

			<article id="home-colour">
				<h3 ref={scrollRef}>
					Click on the colored countries to learn more about the country's
					equipments
				</h3>

				<figure className="home-figure-map">
					<img src="/img/map_screen.PNG" alt="map" />
				</figure>

				<p>
					An article will appear with different section containing information
					about the country
				</p>
			</article>

			<section id="home-colour-section">
				<p>
					You can then click on any of the{" "}
					<span className="home-highlight">highlighted</span> sub-titles to go
					deeper!
				</p>
				<figure className="home-figure-article">
					<img
						src="/img/mobile_screen/article_phone.PNG"
						alt="an article of the map"
					/>
				</figure>
			</section>

			<section id="home-colour-section">
				<p>
					The <b>Section</b> will give you more details about the equipments!
				</p>

				<figure className="home-figure-section">
					<img src="/img/section_screen.PNG" alt="a section in an article" />
				</figure>
			</section>

			<article id="home-timeline">
				<h3>Click on the timeline</h3>

				<p>
					The borders of each country will reflect the ones they had during the
					clicked century.
				</p>
				<p>
					The content of every Articles will be updated following the same
					logic.
				</p>
				<figure className="home-figure-timeline">
					<img src="/img/timeline_screen.webp" alt="timeline" />
				</figure>
			</article>

			{/* <div className="home-grid"> */}
			<section id="home-equip">
				<h4>The Equipment section</h4>
				<p>You can check the weapons, armours and tools present in the map !</p>

				<figure className="home-figure-section">
					<img src="/img/equip_screen.PNG" alt="equipment" />
				</figure>

				<Link to="/equipment" className="button-main">
					<button>Equipment</button>
				</Link>
			</section>

			<section id="home-forum">
				<h4>The Forum</h4>
				<p>You can discuss about anything present on the site.</p>

				<p>Countries, Weapons or History !</p>

				<figure className="home-figure-section">
					<img src="/img/forum_screen.PNG" alt="forum" />
				</figure>

				<Link to="/forum" className="button-main">
					<button>Forum</button>
				</Link>
			</section>
		</main>
	);
}
