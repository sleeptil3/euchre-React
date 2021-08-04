import DownHands from './DownHands';
import PlayerHand from './PlayerHand';
import Prompt from './Prompt';
import { useContext, useState, useEffect } from 'react';
import { DataContext } from '../Pages/Game';
import { prompts } from '../Data/data';

/*
setNewGame, playerHand, setPlayerHand, teammateHand, setTeammateHand, opponentHand1, setOpponentHand1, opponentHand2, setOpponentHand2, trump, setTrump, teamScore, setTeamScore, matchStage, setMatchStage, dealer, setDealer, turn, setTurn
*/

export default function GameLayer() {
	const { matchStage, turn, promptText, setPromptText } = useContext(DataContext)

	useEffect(() => {
		if (matchStage === "TRUMP") {
			// setPromptText(prompts[...]) // "Trump was called. The player to the left of the dealer goes first. Good luck!" ("Begin Match" - triggers PLAY stage)
		}
		else if (matchStage === "CALL") {
			turn === 0 && setPromptText(prompts[0]) // AWAITING TURN TO CALL IT UP
			turn === 4 && setPromptText(prompts[1]) // OPTION TO CALL IT UP
		} else if (matchStage === "DECLARE") {
			turn === 0 && setPromptText(prompts[2]) // AWAITING TURN TO DECLARE IT
			turn === 4 && setPromptText(prompts[3]) // OPTION TO DECLARE IT
			turn === 4 && setPromptText(prompts[3]) // STUCK TO DEALER
		} else if (matchStage === "PLAY") {

		}
		else if (matchStage === "GAMEOVER") {
			// setPromptText(prompts[x])
		}
	}, [turn])

	// NEED TO USE THE PROMPT REPLIES, CARD SELECTION, OR THE AI PLAYS TO ADVANCE THE TURN



	return (
		<div className="absolute z-10 top-0 bottom-0 left-0 right-0 h-full w-full text-opacity-80 text-white">
			<Prompt promptText={promptText} />
			<PlayerHand />
			<DownHands />
		</div>
	)
}
