
import { useContext, useEffect, useState } from "react"
import { DataContext } from "../Pages/Game"
import { sleep } from "../Data/data"

export default function Card() {
	const { trumpCardPosition, setTrumpCardPosition, trumpCardOpacity, setTrumpCardOpacity, suits, matchStage, turnCount, yourSeat, upTrump, currentPlayer } = useContext(DataContext)
	const [cardCode, setCardCode] = useState("")
	const [enableSelection, setEnableSelection] = useState("pointer-events-none")

	const handleClick = () => {
		console.log(`You ordered up ${upTrump.faceValue} of ${upTrump.suit.name} as trump`)
		suits[upTrump.suit.code].select()
	}

	useEffect(() => {
		setCardCode("" + upTrump.suit.code + upTrump.faceValue.toLowerCase())
	}, [upTrump])

	useEffect(() => {
		if (matchStage === "CALL") {
			setTrumpCardOpacity("opacity-100")
			currentPlayer === yourSeat ? setEnableSelection("pointer-events-auto") : setEnableSelection("pointer-events-none")
		} else {
			sleep(500).then(() => setTrumpCardOpacity("opacity-0"))
		}
	}, [turnCount])

	return (
		<div onClick={handleClick} className={`${enableSelection} ${trumpCardPosition} transform transition-transform relative z-20 cursor-pointer w-24 delay-75 duration-500 hover:-translate-y-5`}>
			<img className={`transition-opacity ${trumpCardOpacity} duration-1000 filter drop-shadow-2xl shadow-2xl`} src={`./cards/${cardCode}.png`} alt={`${upTrump.faceValue} of ${upTrump.suit.name}`} />
		</div>
	)
}