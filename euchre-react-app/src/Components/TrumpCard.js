
import { useContext, useEffect, useState } from "react"
import { DataContext } from "../Pages/Game"

export default function Card() {
	const { upTrump, setTrump, currentPlayer, setMatchStage, setCurrentPlayer, dealer, setCallingTeam } = useContext(DataContext)
	const [cardCode, setCardCode] = useState("")
	const [enableSelection, setEnableSelection] = useState("pointer-events-none")

	const handleClick = () => {
		console.log(`Player${currentPlayer} ordered up ${upTrump.faceValue} of ${upTrump.suit.name} as trump`)
		setTrump(upTrump)
		setCallingTeam(currentPlayer)
		setCurrentPlayer(dealer + 1)
		setMatchStage("TRUMP")
	}

	useEffect(() => {
		setCardCode("" + upTrump.suit.name[0].toLowerCase() + upTrump.faceValue.toLowerCase())
	}, [upTrump])

	useEffect(() => {
		currentPlayer === 0 ? setEnableSelection("pointer-events-auto") : setEnableSelection("pointer-events-none")
	}, [upTrump])

	return (
		<div onClick={handleClick} className={`${enableSelection} relative z-20 cursor-pointer w-24 transform transition-transform delay-75 duration-400 hover:-translate-y-5`}>
			<img className="transition-opacity opacity-100 filter drop-shadow-2xl shadow-2xl" src={`./cards/${cardCode}.png`} alt={`${upTrump.faceValue} of ${upTrump.suit.name}`} />
		</div>
	)
}