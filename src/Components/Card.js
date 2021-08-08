import { useContext } from "react"
import { DataContext } from "../Pages/Game"
import { blankCard } from "../Data/data"

export default function Card({ card }) {
	const { yourSeat, upTrump, handlePlayerChoice, handleDiscard, matchStage } = useContext(DataContext)
	const cardCode = "" + card.suit.code + card.faceValue.toLowerCase()

	const handleClick = () => {
		matchStage === "DISCARD" ? handleDiscard(yourSeat, card) : handlePlayerChoice(yourSeat, card)
	}

	return (
		<div className={`${card === blankCard && "opacity-0"} transform transition-transform relative w-24 delay-75 duration-400 ${card === upTrump && matchStage === "DISCARD" ? "left-32" : "hover:-translate-y-5"}`}>
			<img onClick={handleClick} className={`${card === upTrump && matchStage === "DISCARD" ? "pointer-events-none" : "cursor-pointer "} transition-opacity opacity-100 filter shadow-2xl`} src={`./cards/${cardCode}.png`} alt={`${card.faceValue} of ${card.suit.name}`} />
		</div>
	)
}