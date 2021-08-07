import { useContext } from "react"
import { DataContext } from "../Pages/Game"

import Card from "./Card"

export default function PlayField() {
	const { playedCards } = useContext(DataContext)

	return (
		<div className="w-1/4 h-2/5 bg-opacity-25 relative flex justify-center items-center bottom-16">
			<div className="absolute w-full h-1/2 flex justify-between items-center">
				<div className="transform rotate-6">{playedCards[1] ? <Card card={playedCards[1]} /> : null}</div>
				<div className="transform -rotate-6">{playedCards[3] ? <Card card={playedCards[3]} /> : null}</div>
			</div>
			<div className="absolute h-full w-1/4 flex flex-col justify-between items-center">
				<div className="relative top-8 transform rotate-6">{playedCards[2] ? <Card card={playedCards[2]} /> : null}</div>
				<div className="relative bottom-8 transform -rotate-6">{playedCards[0] ? <Card card={playedCards[0]} /> : null}</div>
			</div>
		</div>
	)
}
