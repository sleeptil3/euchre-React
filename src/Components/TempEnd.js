import { useContext, useState } from 'react';
import { DataContext } from '../Pages/Game';
import { sleep } from '../Data/data';

export default function TempEnd() {
	const { setMatchStage, setTurnCount } = useContext(DataContext)

	const handleClick = () => {
		sleep(500).then(() => {
			setMatchStage("NEW")
			setTurnCount(-1)
		});
	};

	return (
		<div className={`absolute top-0 bottom-0 left-0 right-0 z-10 transform transition-all duration-1000 backdrop-filter backdrop-blur-md flex flex-col space-y-2 justify-center items-center`}>
			<h1 className="text-white text-opacity-80 text-2xl font-light">To Be Completed...soon</h1>
			<div className="text-white flex space-x-5 text-opacity-80 text-lg font-extralight pb-10">
				<h2>
					Check out all that glorious code (so far):
				</h2>
				<a className="font-light hover:underline" href="https://github.com/sleeptil3/euchre-api" target="_blank" rel="noopener noreferrer">Back End API</a>
				<a className="font-light hover:underline" href="https://github.com/sleeptil3/euchre-React" target="_blank" rel="noopener noreferrer">Front End React</a>
			</div>
			<button
				onClick={handleClick}
				className="transform transition-transform duration-500 hover:scale-110 active:scale-100 cursor-pointer text-white font-thin text-opacity-90 border-2 bg-white bg-opacity-10 border-white border-opacity-80 h-10 w-28">
				I can't wait
			</button>
		</div>
	)
}