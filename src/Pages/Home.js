import { Link } from "react-router-dom";
import Header from "../Components/Header";

export default function Home() {
	return (
		<div className="h-screen bg-gray-800 flex flex-col justify-start items-center">
			<Header />
			<div className="text-gray-50 text-8xl animate-pulse h-full w-full flex justify-center items-center">
				<Link className="hover:text-blue-500" to="/game">
					Play Game
				</Link>
			</div>
		</div>
	);
}
