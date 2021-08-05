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
		<div className={`absolute top-0 bottom-0 left-0 right-0 z-10 transform transition-all duration-1000 backdrop-filter backdrop-blur-md flex flex-col space-y-5 justify-center items-center`}>
			<h1 className="text-white text-opacity-80 text-xl font-light">To Be Completed...soon (this stuff is hard)</h1>
			<h2 className="text-white text-opacity-80 text-lg font-extralight ">
				Check out all that glorious code (so far):
			</h2>
			<div>
				<a href="">Back End API</a>
				<a href="">Front End React</a>
			</div>
			<button
				onClick={handleClick}
				className="transform transition-transform duration-500 hover:scale-110 active:scale-100 cursor-pointer text-white font-thin text-opacity-90 border-2 bg-white bg-opacity-10 border-white border-opacity-80 h-16 w-28">
				I can't wait
			</button>
		</div>
	)
}