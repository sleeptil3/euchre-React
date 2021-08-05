import { useState, useEffect, createContext } from "react";
import { BASE_URI } from "../Data/data";
import GameBoard from "../Components/GameBoard";
import Header from "../Components/Header";
import { sleep } from "../Data/data";

export default function Game() {
	// State
	const [deck, setDeck] = useState([]);
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
	const [turnCount, setTurnCount] = useState(0)
	const [yourSeat, setYourSeat] = useState(0)
	const nonPlayerHands = [opponentHand1, teammateHand, opponentHand2]
	const suits = {
		"h": {
			name: "Hearts",
			left: "d",
			select() {
				setTrump(this)
				setMatchStage("TRUMP")
			}
		},
		"d": {
			name: "Diamonds",
			left: "h",
			select() {
				setTrump(this)
				setMatchStage("TRUMP")
			}
		},
		"s": {
			name: "Spades",
			left: "c",
			select() {
				setTrump(this)
				setMatchStage("TRUMP")
			}
		},
		"c": {
			name: "Clubs",
			left: "s",
			select() {
				setTrump(this)
				setMatchStage("TRUMP")
			}
		}
	}
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
			title: "Trump Suit Chosen",
			question: `It is ${trump.name}`,
			choices: [{ text: "Begin Match", action: () => startMatch() }]
		},
		gameOver: {
			title: "Trump Suit Chosen",
			question: `It is ${trump.name}`,
			choices: [{ text: "Begin Match", action: () => startMatch() }]
		},
		// inTheBarn: {

		// }
	}

	// Functions

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
			setDeck([...data.deck])
		} catch (error) {
			console.error(error)
		}
	};

	const dealCards = () => {
		setPlayerHand(sortHand([...deck.slice(0, 5)]))
		setTeammateHand([...deck.slice(5, 10)])
		setOpponentHand1([...deck.slice(10, 15)])
		setOpponentHand2([...deck.slice(15, 20)])
		setUpTrump(deck[20])
		setMatchStage("CALL")
	}

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
			let key = card.suit.name
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

	// AI & Scoring
	const decideCallUp = (hand) => {
		const suitMap = groupBySuit(hand)
		console.log(suitMap)
		if (upTrump.suit.name in suitMap) {
			console.log("in suitmap")
		}
		// else {
		sleep(4000).then(() => {
			setCurrentPlayer((currentPlayer + 1) % 4)
			setTurnCount(turnCount + 1)
		})
		// }
	}

	const decideTrumpSelect = (hand) => {
		// If STUCK, no pass
	}

	const decidePlay = (hand, match) => {

	}

	const scoreMatch = (match) => {

	}


	// Effects

	// Prompt Management
	useEffect(() => {
		switch (matchStage) {
			case "CALL": {
				console.log("Prompt Management Call Stage")
				currentPlayer === yourSeat ? setPromptText(prompts.trump1Turn) // OPTION TO CALL IT UP
					: setPromptText(prompts.trump1Round) // AWAITING TURN TO CALL IT UP
				break
			}
			case "PICK": {
				console.log("Prompt Management Pick Stage")
				currentPlayer === yourSeat ? setPromptText(prompts.trump2Turn) // AWAITING TURN TO DECLARE IT
					: setPromptText(prompts.trump2Round) // OPTION TO DECLARE IT
				break
			}
			case "STUCK": {
				dealer === yourSeat ? setPromptText(prompts.trump2Stuck) // STUCK TO DEALER YOU
					: setPromptText(prompts.trump2StuckOther) // STUCK TO DEALER OTHER PLAYER
				break
			}
			case "TRUMP": {
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
	}, [matchStage, currentPlayer]);

	// Turn Count Resetter
	useEffect(() => {
		switch (matchStage) {
			case "CALL": {
				console.log("Turn Management Call Stage")
				if (turnCount > 3) {
					setTurnCount(0)
					setMatchStage("PICK") // Resets counter to 0 after a full go around the table and sets stage to PICK
				}
				break
			}
			case "PICK": {
				console.log("Turn Management Pick Stage")
				if (turnCount > 3) {
					setTurnCount(0)
					setMatchStage("STUCK")
				}
				break
			}
			case "STUCK": {
				console.log("Turn Management STUCK Stage")
				setTurnCount(0)
				break
			}
			case "TRUMP": {
				console.log("Turn Management TRUMP Stage")
				setTurnCount(0)
				break
			}
			case "RESULT": {
				console.log("Turn Management RESULT Stage")
				setTurnCount(0)
				break
			}
			case "GAMEOVER": {
				console.log("Turn Management GAMEOVER Stage")
				setTurnCount(0)
				break
			}
			default: console.log("Turn Management Default Case")
		}
	}, [turnCount])

	// Handle AI

	useEffect(() => {
		if (currentPlayer !== yourSeat) {
			console.log("AI Debug: currentPlayer, turnCount, yourSeat", currentPlayer, turnCount, yourSeat)
			switch (matchStage) {
				case "CALL": {
					console.log(`AI Call Stage for ${currentPlayer}`)
					decideCallUp(nonPlayerHands[currentPlayer - 1])
					break
				}
				case "PICK": console.log("PICK STAGE"); break;
				case "STUCK": console.log("STUCK STAGE"); break;
				case "PLAY": console.log("PLAY STAGE"); break;
				default: console.log("Turn does not require AI")
			}
		}
	}, [currentPlayer, matchStage])

	// Handle matchStage Changes
	useEffect(() => {
		switch (matchStage) {
			case "NEW": console.log("NEW STAGE"); getDeck(); break;
			case "DEAL": console.log("DEAL STAGE"); dealCards(); break;
			case "PICK": console.log("PICK STAGE"); break;
			case "TRUMP": console.log("TRUMP STAGE"); break;
			case "STUCK": console.log("STUCK STAGE"); break;
			case "PLAY": console.log("PLAY STAGE"); break;
			case "RESULT": console.log("RESULT STAGE"); break;
			case "GAMEOVER": console.log("GAMEOVER STAGE"); break;
			default: console.log("MatchStage Action not needed")
		}
	}, [matchStage]);

	return (
		<DataContext.Provider value={{ goAlone, yourSeat, turnCount, setTurnCount, callingTeam, setCallingTeam, upTrump, suits, opponentScore, setOpponentScore, currentPrompt, setCurrentPrompt, promptText, setPromptText, showPrompt, setShowPrompt, playerHand, setPlayerHand, teammateHand, setTeammateHand, opponentHand1, setOpponentHand1, opponentHand2, setOpponentHand2, trump, setTrump, teamScore, setTeamScore, matchStage, setMatchStage, dealer, setDealer, currentPlayer, setCurrentPlayer }}>
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