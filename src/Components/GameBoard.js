import { useContext } from 'react';
import { DataContext } from '../Pages/Game';
import GameLayer from "./GameLayer"
import PlayButton from './PlayButton';

export default function GameBoard() {
	const { matchStage, showEnd } = useContext(DataContext)

	return (
		<div className="bg-game-canvas bg-no-repeat bg-center h-canvas w-canvas relative z-0">
			{matchStage === "NEW" ? <PlayButton /> : <GameLayer />}
		</div>
	)
}