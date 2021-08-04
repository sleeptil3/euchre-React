import { useContext, useState, useEffect } from "react"
import { DataContext } from "../Pages/Game"
import Card from "./Card"
import { v4 as uuid } from 'uuid';

export default function PlayerHand() {
	const { playerHand, matchStage } = useContext(DataContext)
	const [opacity, setOpacity] = useState("opacity-0")

	//  for animations (w-24 is nice tight hand, w-0 is stacked, and w-1/2 is laid flat)
	// PRE, DEAL, CALL, PICK, PLAY

	useEffect(() => {
		if (matchStage === 'PRE') setOpacity("opacity-0")
		else setOpacity("opacity-100")
	}, [matchStage])

	return (
		<div className={`${opacity} transition-all duration-700 w-24 grid grid-cols-5 grid-rows-1 justify-items-center absolute bottom-10 left-1/2 transform -translate-x-1/2`}>
			{
				playerHand.map(card => {
					return <Card card={card} key={uuid()} />
				})
			}
		</div>
	)
}

// sleep(1000).then(() => {
// 	setMatchStage("DEAL")
// 	setNewGame(true)
// });

async function sleep(ms) {
	return await new Promise(resolve => setTimeout(resolve, ms));
}