import { Route, Switch } from 'react-router-dom';
import Game from "./Pages/Game";
import Home from "./Pages/Home";


export default function App() {
	return (
		<div className="w-screen min-h-screen">
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/game" component={Game} />
			</Switch>
		</div>
	);
}