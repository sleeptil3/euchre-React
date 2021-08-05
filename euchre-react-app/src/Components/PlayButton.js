import { useContext, useState } from 'react';
import { DataContext } from '../Pages/Game';
import { sleep } from '../Data/data';

export default function PlayButton() {
	const { matchStage, setMatchStage, setNewGame } = useContext(DataContext)
	const [opacity, setOpacity] = useState("opacity-100")

	const handleClick = () => {
		setOpacity("opacity-0")
		sleep(1500).then(() => setMatchStage("DEAL"));
	};

	return (
		<div className={`absolute top-0 bottom-0 left-0 right-0 z-10 transform transition-all duration-1000 ${opacity} backdrop-filter backdrop-blur-md flex flex-col space-y-5 justify-center items-center`}>
			<h1 className="text-white text-opacity-80 text-xl font-light">Let's play some Euchre.</h1>
			<button
				onClick={handleClick}
				className="transform transition-transform duration-500 hover:scale-110 active:scale-100 cursor-pointer text-white font-thin text-opacity-90 border-2 bg-white bg-opacity-10 border-white border-opacity-80 h-16 w-28">
				Okay
			</button>
		</div>
	)
}