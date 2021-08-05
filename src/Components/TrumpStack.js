import { useContext, useState, useEffect } from "react"
import { DataContext } from "../Pages/Game"
import TrumpCard from "./TrumpCard"
import downDeck from "../images/deck.png"

export default function TrumpStack() {
	const { trump, upTrump } = useContext(DataContext)

	if (!trump.suit) {
		return (
			<div>
				{upTrump.faceValue !== undefined && <TrumpCard />}
				<img className="relative top-2 transform -translate-y-full" src={downDeck} alt="face down unused trump cards" />
			</div>
		)
	} else {
		return null
	}
}