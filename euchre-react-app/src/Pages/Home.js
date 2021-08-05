import { Link } from 'react-router-dom';

export default function Home() {
	return (
		<div className="text-black text-xl flex flex-row justify-center items-center h-screen">
			<Link to="/game">Play Game</Link>
		</div>
	)
}
