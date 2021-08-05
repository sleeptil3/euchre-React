import DownHands from './DownHands';
import PlayerHand from './PlayerHand';
import Prompt from './Prompt';
import TrumpStack from './TrumpStack';


export default function GameLayer() {

	return (
		<div className="relative z-10 h-full w-full text-opacity-80 text-white">
			<Prompt />
			<PlayerHand />
			<DownHands />
			<div className="h-full w-full flex justify-center items-center">
				<TrumpStack />
			</div>
		</div>
	)
}