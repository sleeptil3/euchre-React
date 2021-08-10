import { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { srcArray, cacheImages } from './Data/data';
import Game from "./Pages/Game";
import Home from "./Pages/Home";


export default function App() {

	useEffect(() => {
		cacheImages(srcArray)
	}, [])

	return (
		<div className="w-screen min-h-screen">
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/game" component={Game} />
			</Switch>
		</div>
	);
}