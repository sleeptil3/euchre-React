export const suits = {
	"h": { name: "Hearts", left: "d" },
	"d": { name: "Diamonds", left: "h" },
	"s": { name: "Spades", left: "c" },
	"c": { name: "Clubs", left: "s" }
}

export const BASE_URI = "https://euchre-api.herokuapp.com/api/"

export const prompts = [
	{
		title: "Trump Selection",
		question: "It's not your turn.",
		answers: []
	},
	{
		title: "Your turn",
		question: "Call it up?",
		answers: ["YES", "NO"]
	},
	{
		title: "Trump Selection Round 2",
		question: "It's not your turn.",
		answers: []
	},
	{
		title: "Would you like to select trump?",
		question: "Choose a suit if so. Pass if not.",
		answers: ["Diamonds", "Hearts", "Clubs", "Spades", "...Pass"]
	},
	{
		title: "Stuck to Dealer",
		question: "You must select Trump:",
		answers: ["Diamonds", "Hearts", "Clubs", "Spades"]
	},
]


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