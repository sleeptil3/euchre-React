import { Route, Switch, useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Game from "./Pages/Game";
import Home from "./Pages/Home";


export default function App() {
	return (
		<Switch>
			<div className="w-screen">
				<Route exact path="/" componenet={Game} />
				<Route path="/game" component={Game} />
			</div>
		</Switch>
	);
}