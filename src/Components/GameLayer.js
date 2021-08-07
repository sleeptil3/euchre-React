import { useContext } from 'react';
import DownHands from './DownHands';
import PlayerHand from './PlayerHand';
import Prompt from './Prompt';
import TrumpStack from './TrumpStack';
import { DataContext } from '../Pages/Game';


export default function GameLayer() {
	const { matchStage } = useContext(DataContext)

	return (
		<div className="relative z-10 h-full w-full text-opacity-80 text-white">
			<Prompt />
			<PlayerHand />
			<DownHands />
			<div className="h-full w-full flex justify-center items-center">
				{matchStage === "CALL" || matchStage === "PICK" ? <TrumpStack /> : null}
			</div>
		</div>
	)
}