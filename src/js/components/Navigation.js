import React from "react";

export default () => (
	<nav className="navbar navbar-light bg-light" id="navigation-bar">
		<a id="nav-link" className="navbar-brand" href="https://www.hmwawuda.com/">
			<img src="./img/hm_logo.png" width="35.5" height="34.5" className="d-inline-block align-top" alt="Hammerton Mwawuda Logo" loading="lazy" />
			Coronavirus Statistics
		</a>
		<ul className="nav nav-tabs">
			<li className="nav-item">
				<a className="nav-link" href="#more-info">More Information</a>
			</li>
			<li className="nav-item">
				<a className="nav-link" href="#explore">Explore</a>
			</li>
			<li className="nav-item">
				<a className="nav-link" href="#kenya">Kenya</a>
			</li>
		</ul>
	</nav>
);