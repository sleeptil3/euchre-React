import { useState, useLayoutEffect, useContext } from "react";
import { DataContext } from "../Pages/Game";
import fiveDown from "../images/down5.png";
import fourDown from "../images/down4.png";
import threeDown from "../images/down3.png";
import twoDown from "../images/down2.png";
import oneDown from "../images/down1.png";
import noneDown from "../images/down0.png";
import { spinner, dealerIcon } from "../Data/data";

export default function DownHand({ position, handLength }) {
	const [image, setImage] = useState(0);
	const { currentPlayer, turnCount, matchStage, dealer } = useContext(DataContext)
	const imageURLS = [noneDown, oneDown, twoDown, threeDown, fourDown, fiveDown, fiveDown];
	const styles = [
		"hidden",
		"absolute left-28 top-40 transform rotate-90 flex justify-center items-center",
		"absolute top-3 left-1/2 transform -translate-x-1/2 rotate-180 flex justify-center items-center",
		"absolute right-28 top-40 transform -rotate-90 flex justify-center items-center",
		"absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center"
	];

	useLayoutEffect(() => {
		setImage(imageURLS[handLength]);
	}, [handLength]);

	return (
		<div className={styles[position]}>
			{position === dealer && dealerIcon}
			<img src={image} alt={`Face down stack of ${handLength} cards`} />
			{(currentPlayer === position && turnCount !== 4 && (matchStage === "PLAY" || matchStage === "CALL" || matchStage === "PICK")) && <div className="flex justify-center items-center absolute top-0 left-0 right-0 bottom-0">{spinner}</div>}
		</div>
	)
}