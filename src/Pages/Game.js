import { useState, useEffect, createContext } from "react";
import { BASE_URI } from "../Data/data";
import GameBoard from "../Components/GameBoard";
import Header from "../Components/Header";
import { sleep } from "../Data/data";

export default function Game() {

	////////////////
	// GAME STATE //
	////////////////

	const [playerHand, setPlayerHand] = useState([]);
	const [teammateHand, setTeammateHand] = useState([]);
	const [opponentHand1, setOpponentHand1] = useState([]);
	const [opponentHand2, setOpponentHand2] = useState([]);
	const [upTrump, setUpTrump] = useState({})
	const [trump, setTrump] = useState({}); // {suit, left}
	const [callingTeam, setCallingTeam] = useState(null)
	const [teamScore, setTeamScore] = useState(0);
	const [opponentScore, setOpponentScore] = useState(0);
	const [matchStage, setMatchStage] = useState("NEW"); // NEW, DEAL, CALL, PICK, PLAY
	const [showPrompt, setShowPrompt] = useState(false)
	const [promptText, setPromptText] = useState({ title: "", question: "", choices: [] })
	const [currentPrompt, setCurrentPrompt] = useState(0)
	const [dealer, setDealer] = useState(0); // 0, 1, 2, 3
	const [currentPlayer, setCurrentPlayer] = useState(dealer + 1); // 0, 1, 2, 3, 4 (result)
	const [turnCount, setTurnCount] = useState(-1)
	const [yourSeat, setYourSeat] = useState(0)
	const nonPlayerHands = [opponentHand1, teammateHand, opponentHand2]

	const [showEnd, setShowEnd] = useState(false)

	const suits = {
		"h": {
			name: "Hearts",
			left: "d",
			select() {
				setTrump(this)
				setMatchStage("TRUMP")
				setTurnCount(turnCount + 1)
			}
		},
		"d": {
			name: "Diamonds",
			left: "h",
			select() {
				setTrump(this)
				setMatchStage("TRUMP")
				setTurnCount(turnCount + 1)
			}
		},
		"s": {
			name: "Spades",
			left: "c",
			select() {
				setTrump(this)
				setMatchStage("TRUMP")
				setTurnCount(turnCount + 1)
			}
		},
		"c": {
			name: "Clubs",
			left: "s",
			select() {
				setTrump(this)
				setMatchStage("TRUMP")
				setTurnCount(turnCount + 1)
			}
		}
	}



	////////////////
	// PROMPT MAP //
	////////////////

	const prompts = {
		trump1Round: {
			title: "Trump Selection Round 1",
			question: `It's ${currentPlayer === 2 ? "your teammate's" : "the other team's"} turn`,
			choices: []
		},
		trump1Turn: {
			title: "Trump Selection Round 1",
			question: "It's your turn: to order it up, click the Kitty or...",
			choices: [{ text: "Pass", action: () => pass() }]
		},
		trump2Round: {
			title: "Trump Selection Round 2",
			question: `It's ${currentPlayer === 2 ? "your teammate's" : "the other team's"} turn`,
			choices: []
		},
		trump2Turn: {
			title: "Trump Selection Round 2",
			question: "Choose a trump suit or pass:",
			choices: [{ text: suits.d.name, action: suits.d.select }, { text: suits.h.name, action: suits.h.select }, { text: suits.c.name, action: suits.c.select }, { text: suits.s.name, action: suits.s.select }, { text: "Pass", action: () => pass() }]
		},
		trump2TurnAlone: {
			title: "Feeling lucky?",
			question: "Would you like to go it alone?",
			choices: [{ text: "Yes", action: () => goAlone() }, { text: "No", action: suits.h.select }, { text: suits.c.name, action: suits.c.select }, { text: suits.s.name, action: suits.s.select }, { text: "Pass", action: () => pass() }]
		},
		trump2Stuck: {
			title: "Stuck to Dealer",
			question: "You must select Trump:",
			choices: [{ text: suits.d.name, action: suits.d.select }, { text: suits.h.name, action: suits.h.select }, { text: suits.c.name, action: suits.c.select }, { text: suits.s.name, action: suits.s.select }]
		},
		trump2StuckOther: {
			title: "Stuck to Dealer",
			question: "...dealer is making their decision",
			choices: []
		},
		trumpSelected: {
			title: "Trump Suit Chosen",
			question: `It is ${trump.name}`,
			choices: [{ text: "Begin Match", action: () => startMatch() }]
		},
		yourTurn: {
			title: "It's your turn",
			question: `Choose a card to play`,
			choices: []
		},
		othersTurn: {
			title: `${currentPlayer} is deciding`,
			question: "Please wait...",
			choices: []
		},
		matchResult: {
			title: "",
			question: ``,
			choices: []
		},
		gameOver: {
			title: "",
			question: ``,
			choices: []
		},
		// inTheBarn: {}
	}



	///////////////////////
	// General Functions //
	///////////////////////

	const pass = () => {
		setCurrentPlayer((currentPlayer + 1) % 4)
		setTurnCount(turnCount + 1)
	}

	const startMatch = () => {
		setCurrentPlayer((dealer + 1) % 4)
		setTurnCount(0)
		setMatchStage("PLAY")
	}

	const getDeck = async () => {
		try {
			const response = await fetch(BASE_URI + "deck")
			const data = await response.json()
			setPlayerHand([...data.deck.slice(0, 5)])
			setTeammateHand([...data.deck.slice(5, 10)])
			setOpponentHand1([...data.deck.slice(10, 15)])
			setOpponentHand2([...data.deck.slice(15, 20)])
			setUpTrump(data.deck[20])
		} catch (error) {
			console.error(error)
		}
	};

	const sortHand = (hand) => {
		const suitMap = groupBySuit(hand)
		let sortedHand = []
		for (const suit in suitMap) {
			suitMap[suit].sort((a, b) => a.value - b.value)
			suitMap[suit].forEach(card => sortedHand.push(card))
		}
		return sortedHand
	}

	const groupBySuit = (cards) => {
		return cards.reduce(function (acc, card) {
			let key = card.suit.right.name
			if (!acc[key]) {
				acc[key] = []
			}
			acc[key].push(card)
			return acc
		}, {})
	}

	const goAlone = () => {
		// Code
	}


	//////////////
	// AI LOGIC //
	//////////////

	const scoreHand = (hand, trump, left) => {
		// trump = "Hearts"
		// left = "Diamonds"
		let score = 0
		for (const card of hand) {
			score += card.value
			if (card.suit.right.name === trump) {
				score += 10
				if (card.faceValue === "J") {
					score += 30
				}
			}
			if (card.suit.right.name === left && card.faceValue === "J") {
				score += 20
			}
		}
		return score
	}

	const decideTrump = async (hand) => {
		console.log("decideTrump: start", currentPlayer)
		const suitMap = await groupBySuit(hand)
		const trump = upTrump.suit.right.name
		const left = upTrump.suit.left.name
		console.log("TRUMP:", trump)
		console.log(suitMap)
		switch (matchStage) {
			case "CALL": {
				sleep(2000).then(() => {
					if (trump in suitMap) {
						console.log("decideTrump: have trump suit in hand")
						const scoredHand = scoreHand(hand, trump, left)
						console.log(scoredHand)
					} else {
						console.log("decideTrump: pass")
					}
					console.log("decideTrump: end")
					pass()
				})
			}

			case "PICK": {

			}
			case "STUCK": {

			}
			default: console.log("decideTrump AI called on invalid match stage.")
		}
		// else {
		// }
	}

	const decidePlay = (hand, match) => {

	}

	const scoreMatch = (match) => {

	}


	////////////////
	// useEffects //
	////////////////

	// Game Setup
	useEffect(() => {
		console.log("Game Initialized: Getting Deck and setting up hands")
		getDeck()
		sortHand(playerHand)
	}, [dealer])

	// Game Logic
	useEffect(() => {
		switch (matchStage) {
			case "CALL": {
				console.log("Prompt Management Call Stage")
				if (turnCount > 3) {
					setMatchStage("PICK")
					setCurrentPlayer((dealer + 1) % 4)
					setTurnCount(0)
				} else {
					if (currentPlayer === yourSeat) {
						setPromptText(prompts.trump1Turn) // OPTION TO CALL IT UP
					} else {
						setPromptText(prompts.trump1Round) // AWAITING TURN TO CALL IT UP
						decideTrump(nonPlayerHands[currentPlayer - 1])
					}
				}
				break
			}
			case "PICK": {
				setShowEnd(true)
				break
				console.log("Prompt Management Pick Stage")
				if (turnCount > 3) {
					setMatchStage("STUCK")
					setCurrentPlayer((dealer + 1) % 4)
					setTurnCount(0)
				} else {
					currentPlayer === yourSeat ? setPromptText(prompts.trump2Turn) // AWAITING TURN TO DECLARE IT
						: setPromptText(prompts.trump2Round) // OPTION TO DECLARE IT
					setCurrentPlayer((dealer + 1) % 4)
					setTurnCount(turnCount + 1)
				}
				break
			}
			case "STUCK": {
				setShowEnd(true)
				break
				if (dealer === yourSeat) {
					setPromptText(prompts.trump2Stuck) // STUCK TO DEALER YOU
				} else {
					setPromptText(prompts.trump2StuckOther) // STUCK TO DEALER OTHER PLAYER
				}
				break
			}
			case "TRUMP": {
				setShowEnd(true)
				break
				console.log("Prompt Management TRUMP Stage")
				setPromptText(prompts.trumpSelected)
				break
			}
			case "PLAY": {
				console.log("Prompt Management Play Stage")
				break
			}
			case "RESULT": {
				console.log("Prompt Management RESULT Stage")
				break
			}
			case "GAMEOVER": {
				console.log("Prompt Management GAMEOVER Stage")
				break
			}
			default: console.log("Prompt Management Default Case")
		}
	}, [turnCount]);

	console.log("LOG: ", matchStage, currentPlayer, turnCount)

	////////////
	// RENDER //
	////////////

	return (
		<DataContext.Provider value={{ showEnd, pass, goAlone, yourSeat, turnCount, setTurnCount, callingTeam, setCallingTeam, upTrump, suits, opponentScore, setOpponentScore, currentPrompt, setCurrentPrompt, promptText, setPromptText, showPrompt, setShowPrompt, playerHand, setPlayerHand, teammateHand, setTeammateHand, opponentHand1, setOpponentHand1, opponentHand2, setOpponentHand2, trump, setTrump, teamScore, setTeamScore, matchStage, setMatchStage, dealer, setDealer, currentPlayer, setCurrentPlayer }}>
			<div className="h-screen bg-gray-800 flex flex-col justify-start items-center">
				<Header />
				<div className="h-full w-full flex justify-center items-center">
					<GameBoard />
				</div>
			</div>
		</DataContext.Provider>
	)
}

export const DataContext = createContext()