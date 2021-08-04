import { useContext, useState } from 'react';
import { DataContext } from '../Pages/Game';

export default function PlayButton() {
	const { matchStage, setMatchStage, setNewGame } = useContext(DataContext)
	const [opacity, setOpacity] = useState("opacity-100")

	const handleClick = () => {
		setOpacity("opacity-0")
		sleep(1000).then(() => {
			setMatchStage("DEAL")
			setNewGame(true)
		});
	}

	return (
		<div className={`absolute z-10 transform transition-all ${opacity} duration-500 backdrop-filter backdrop-blur-md top-0 bottom-0 left-0 right-0 flex flex-col space-y-10 justify-center items-center`}>
			<h1 className="text-white text-opacity-80 text-lg font-light">Let's play some Euchre.</h1>
			<button className="transform transition-all hover:scale-110 cursor pointer">asdf</button>
			<button className="transform transition-all duration-500 hover:scale-110 active:scale-100 cursor-pointer text-white font-thin text-opacity-90 border-2 bg-white bg-opacity-10 border-white border-opacity-80 h-16 w-28">Okay</button>
		</div>
	)
}

// sleep(1000).then(() => {
// 	setMatchStage("DEAL")
// 	setNewGame(true)
// });

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}