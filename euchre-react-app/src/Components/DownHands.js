import { useContext, useEffect } from "react"
import { DataContext } from "../Pages/Game"
import DownHand from "./DownHand"

export default function DownHands() {
	const { teammateHand, opponentHand1, opponentHand2 } = useContext(DataContext)

	return teammateHand.length > 0 ? (
		<div className="">
			<DownHand position={1} hand={opponentHand1} />
			<DownHand position={2} hand={teammateHand} />
			<DownHand position={3} hand={opponentHand2} />
		</div>
	)
		: null
}
