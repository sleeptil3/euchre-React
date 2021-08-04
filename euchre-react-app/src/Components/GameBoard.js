import { useContext } from 'react';
import { DataContext } from '../Pages/Game';
import Background from "./Background"
import GameLayer from "./GameLayer"
import PlayButton from './PlayButton';


// PRE, DEAL, CALL, PICK, PLAY

export default function GameBoard() {
	const { newGame, matchStage } = useContext(DataContext)

	return (
		<div className="relative mx-auto">
			<PlayButton />
			<GameLayer />
			<Background />
		</div>
	)
}