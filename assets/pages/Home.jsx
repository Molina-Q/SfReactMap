import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
	return (
		<>
			<section id="home-welcome">
				<h2 class="primary-title">Welcome to our map</h2>
				<p>Learn how to use it</p>

				<Link to="/map" class="button-main">
					<span>Get to the map</span>
				</Link>
			</section>

			<article id="home-colour">
				<h3>Click on the colored countries</h3>
				<p>learn more about their Weapons, Armours or tools</p>

				<figure>
					<img src="" alt="" />
				</figure>
			</article>

			<article id="home-timeline">
				<h3>Click on the timeline</h3>
				<p>change the borders and the content of each country's article</p>
				<figure>
					<img src="" alt="" />
				</figure>
			</article>

			<section id="home-equip">
				<h4>The Equipment section</h4>
				<p>want to check the weapons, armours or tools present in the map ?</p>

				<figure>
					<img src="" alt="" />
				</figure>

                <Link to={'/equipment'} class="button-main">
					<span>Equipment</span>
                </Link>
			</section>

			<section id="home-forum">
				<h4>The forum</h4>
				<p>
					you can discuss about anything present on the site, country, weapon or
					history !
				</p>

				<figure>
					<img src="" alt="" />
				</figure>

				<Link to="/forum" class="button-main">
                    <span>Forum</span>
                </Link>
			</section>
		</>
	);
}
