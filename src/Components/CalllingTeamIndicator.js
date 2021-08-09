import { useContext } from "react"
import { DataContext } from "../Pages/Game"

export default function CallingTeamIndicator() {
	const { callingPlayer, yourSeat } = useContext(DataContext)

	return (
		<div className="absolute bottom-32 right-48 flex flex-col justify-center items-center py-2 px-2 border-2 border-white text-white opacity-60 rounded-lg">
			<h1 className="text-md text-center font-light">{yourSeat === callingPlayer || (callingPlayer + 2) % 4 === yourSeat ? "Your Team Called Trump" : "The Other Team Called Trump"}</h1>
		</div>
	)
}
