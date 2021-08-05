import { useContext, useState, useEffect } from "react"
import { DataContext } from "../Pages/Game"
import Card from "./Card"
import { v4 as uuid } from 'uuid';

export default function PlayerHand() {
	const { playerHand, yourSeat, currentPlayer } = useContext(DataContext)
	const [enableSelection, setEnableSelection] = useState("pointer-events-none")

	useEffect(() => {
		currentPlayer === yourSeat ? setEnableSelection("pointer-events-auto") : setEnableSelection("pointer-events-none")
	}, [currentPlayer])

	return (
		<div className={`${enableSelection} transition-transform duration-700 w-24 grid grid-cols-5 grid-rows-1 justify-items-center absolute bottom-10 left-1/2 transform -translate-x-1/2`}>
			{
				playerHand.map(card => {
					return <Card card={card} key={uuid()} />
				})
			}
		</div>
	)
}

	//  for animations (w-24 is nice tight hand, w-0 is stacked, and w-1/2 is laid flat)