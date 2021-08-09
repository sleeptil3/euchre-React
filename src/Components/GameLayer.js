import { useContext, useEffect } from 'react';
import DownHands from './DownHands';
import PlayerHand from './PlayerHand';
import Prompt from './Prompt';
import TrumpStack from './TrumpStack';
import PlayField from './PlayField';
import TrumpIndicator from '../Components/TrumpIndicator';
import CallingTeamIndicator from './CalllingTeamIndicator';
import MatchTricksCount from './MatchTricksCount';
import { DataContext } from '../Pages/Game';


export default function GameLayer() {
	const { matchStage, trump } = useContext(DataContext)

	return (
		<div className="relative z-10 h-full w-full text-opacity-80 text-white">
			<Prompt />
			<PlayerHand />
			<DownHands />
			<div className="h-full w-full flex justify-center items-center">
				{matchStage === "CALL" || matchStage === "PICK" || matchStage === "TRUMP" || matchStage === "DISCARD" ? <TrumpStack /> : null}
				{matchStage === "PLAY" && <PlayField />}
			</div>
			{matchStage === "READY" || matchStage === "PLAY" && <TrumpIndicator trump={trump} />}
			{matchStage === "PLAY" && <CallingTeamIndicator />}
			{matchStage === "PLAY" && <MatchTricksCount />}
		</div>
	)
}