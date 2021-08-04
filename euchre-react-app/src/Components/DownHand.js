import { useState, useEffect } from "react";
import fiveDown from "../images/down5.png";
import fourDown from "../images/down4.png";
import threeDown from "../images/down3.png";
import twoDown from "../images/down2.png";
import oneDown from "../images/down1.png";

export default function DownHand({ position, hand }) {
	const [cardCount, setCardCount] = useState(0);
	const [image, setImage] = useState(0);
	const imports = [null, oneDown, twoDown, threeDown, fourDown, fiveDown];
	const styles = [
		null,
		"absolute left-28 top-40 transform rotate-90",
		"absolute top-3 left-1/2 transform -translate-x-1/2 rotate-180",
		"absolute right-28 top-40 transform -rotate-90",
	];

	useEffect(() => {
		setCardCount(hand.length);
		setImage(imports[cardCount]);
	}, [hand, cardCount]);

	return (
		<div className={styles[position]}>
			<img src={image} alt={`Face down stack of ${cardCount} cards`} />
		</div>
	)
}
