

export const BASE_URI = "https://euchre-api.herokuapp.com/api/"
// export const BASE_URI = "http://localhost:3033/api/"

export function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// sleep(1500).then(() => setMatchStage("DEAL"));


export const spinner = <svg
	className="animate-spin"
	width="82"
	height="84"
	viewBox="0 0 82 84"
	fill="none"
	xmlns="http://www.w3.org/2000/svg">
	<path
		opacity="0.5"
		fillRule="evenodd"
		clipRule="evenodd"
		d="M40.9527 70.842C44.7172 70.842 48.445 70.0875 51.923 68.6215C55.401 67.1556 58.5612 65.0069 61.2232 62.2982C63.8851 59.5895 65.9967 56.3738 67.4374 52.8347C68.878 49.2956 69.6195 45.5024 69.6195 41.6718C69.6195 37.8411 68.878 34.0479 67.4374 30.5088C65.9967 26.9697 63.8851 23.754 61.2232 21.0453C58.5612 18.3366 55.401 16.1879 51.923 14.722C48.445 13.256 44.7172 12.5015 40.9527 12.5015C33.3497 12.5015 26.0582 15.5748 20.6821 21.0453C15.306 26.5158 12.2858 33.9353 12.2858 41.6718C12.2858 49.4082 15.306 56.8277 20.6821 62.2982C26.0582 67.7687 33.3497 70.842 40.9527 70.842V70.842ZM40.9527 83.3435C63.5708 83.3435 81.9053 64.6871 81.9053 41.6718C81.9053 18.6564 63.5708 0 40.9527 0C18.3345 0 0 18.6564 0 41.6718C0 64.6871 18.3345 83.3435 40.9527 83.3435Z"
		fill="black"
		fillOpacity="0.65"
	/>
	<path
		d="M40.9526 83.3435C63.5708 83.3435 81.9053 64.6871 81.9053 41.6718H69.6195C69.6195 49.4082 66.5992 56.8277 61.2232 62.2982C55.8471 67.7687 48.5556 70.842 40.9526 70.842V83.3435Z"
		fill="black"
		fillOpacity="0.65"
	/>
	<path
		d="M0 41.6718C0 18.6564 18.3345 0 40.9527 0V12.5015C33.3497 12.5015 26.0582 15.5748 20.6821 21.0453C15.306 26.5158 12.2858 33.9353 12.2858 41.6718H0Z"
		fill="black"
		fillOpacity="0.65"
	/>
</svg>

// class Card {
// 	static gameValues = {
// 		"9": 1,
// 		"10": 2,
// 		"J": 3,
// 		"Q": 4,
// 		"K": 5,
// 		"A": 6
// 	}
// 	constructor(faceValue, suitCode) {
// 		this.faceValue = faceValue
// 		this.suit = suits[suitCode]
// 		this.value = this.gameValues[faceValue]
// 	}
// }

// class Deck {
// 	static faceValues = ["9", "10", "J", "Q", "K", "A"]
// 	deck = []

// 	generateDeck() {
// 		for (const suit in this.suits) {
// 			for (const faceValue of this.faceValues) {
// 				this.deck.push(new Card(faceValue, suit))
// 			}
// 		}
// 	}
// }