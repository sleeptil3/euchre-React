import { useState, useEffect, useLayoutEffect, createContext } from "react";
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
	const [callingPlayer, setCallingPlayer] = useState(null)
	const [teamScore, setTeamScore] = useState(0);
	const [opponentScore, setOpponentScore] = useState(0);
	const [matchStage, setMatchStage] = useState("NEW"); // NEW, DEAL, CALL, PICK, PLAY
	const [showPrompt, setShowPrompt] = useState(false)
	const [promptText, setPromptText] = useState({ title: "", question: "", choices: [] })
	const [currentPrompt, setCurrentPrompt] = useState(0)
	const [playedCards, setPlayedCards] = useState({
		0: null,
		1: null,
		2: null,
		3: null
	})
	const [dealer, setDealer] = useState(0); // 0, 1, 2, 3
	const [currentPlayer, setCurrentPlayer] = useState(dealer + 1); // 0, 1, 2, 3, 4 (result)
	const [turnCount, setTurnCount] = useState(-1)
	const [yourSeat, setYourSeat] = useState(0)
	const [trumpCardOpacity, setTrumpCardOpacity] = useState("opacity-0")
	const [trumpCardPosition, setTrumpCardPosition] = useState("translate-y-0")

	const nonPlayerHands = [opponentHand1, teammateHand, opponentHand2]

	const suits = {
		"h": {
			name: "Hearts",
			code: "h",
			left: { code: "d", name: "Diamonds" },
			select() {
				handleCallUp(this)
			}
		},
		"d": {
			name: "Diamonds",
			code: "d",
			left: { code: "h", name: "Hearts" },
			select() {
				handleCallUp(this)
			}
		},
		"s": {
			name: "Spades",
			code: "s",
			left: { code: "c", name: "Clubs" },
			select() {
				handleCallUp(this)
			}
		},
		"c": {
			name: "Clubs",
			code: "c",
			left: { code: "s", name: "Spades" },
			select() {
				handleCallUp(this)
			}
		}
	}



	////////////////
	// PROMPT MAP //
	////////////////

	const prompts = {
		trump1Round: {
			title: "Trump Selection Round 1",
			question: `${currentPlayer % 2 === 0 ? "Your Teammate is making their decision" : `Player ${currentPlayer} is making their decision`}n`,
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
		ready: {
			title: `Ready to Play`,
			question: `${callingPlayer % 2 === 0 ? `Your team called ${trump.name}` : `The other team called ${trump.name}`}.`,
			choices: [{ text: "Begin Match", action: () => startMatch() }]
		},
		discard: {
			title: `${callingPlayer % 2 === 0 ? "Your Team Called Trump" : "The Other Team Called Trump"}`,
			question: `Choose a card to discard`,
			choices: []
		},
		yourTurn: {
			title: "It's your turn",
			question: `Choose a card to play`,
			choices: []
		},
		othersTurn: {
			title: `${currentPlayer % 2 === 0 ? "It's your teammate's turn" : `It's Player ${currentPlayer}'s turn`}`,
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
			setPlayerHand(sortHand([...data.deck.slice(0, 5)]))
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
			let key = card.suit.name
			if (!acc[key]) {
				acc[key] = []
			}
			acc[key].push(card)
			return acc
		}, {})
	}

	const handleCallUp = async (trump) => {
		setTrump(trump)
		setTrumpCardPosition("translate-y-20")
		setCallingPlayer(currentPlayer)
		setCurrentPlayer(dealer)
		dealer === yourSeat ? setMatchStage("DISCARD") : setMatchStage("READY")
		setTurnCount(turnCount + 1)
		if (matchStage === "CALL") {
			sleep(1000).then(() => {
				switch (dealer) {
					case 0: {
						setPlayerHand([...playerHand, upTrump])
						break
					}
					case 1: { setOpponentHand1([...opponentHand1, upTrump]); break; }
					case 2: { setTeammateHand([...teammateHand, upTrump]); break; }
					case 3: { setOpponentHand2([...opponentHand2, upTrump]); break; }
				}
			})
		}
	}

	const goAlone = () => {
		// Code
	}

	const scoreHand = (hand, trump, left) => {
		let score = 0
		for (const card of hand) {
			score += card.value
			if (card.suit.name === trump) {
				score += 10
				if (card.faceValue === "J") {
					score += 30
				}
			}
			if (card.suit.name === left && card.faceValue === "J") {
				score += 20
			}
		}
		return score
	}

	const findHighestOffSuit = (suitMap, trump) => {

	}

	const findIsTeammate = (currentPlayer, dealer) => {
		if ((currentPlayer + 2) % 4 === dealer) return true
		else return false
	}

	const handlePlayerChoice = (player, card) => {
		// get player hand based on player
		// run discard on hand based on choice
		// set the played card to the chosen card
		console.log("handlePlayerChoice", player, card)
		setPlayedCards({ ...playedCards, [player]: opponentHand1[0] })
		setCurrentPlayer((currentPlayer + 1) % 4)
		setTurnCount(turnCount + 1)
	}

	const handleDiscard = (player, card) => {
		console.log("handleDiscard", player, card)
		let hand = []
		switch (dealer) {
			case 0: {
				hand = [...playerHand]
				swap(hand, hand.indexOf(card), 5)
				hand.length = 5
				setPlayerHand(sortHand([...hand]))
				break
			}
			case 1: {
				hand = [...opponentHand1]
				swap(hand, hand.indexOf(card), 5)
				hand.length = 5
				setOpponentHand1([...hand])
				break
			}
			case 2: {
				hand = [...teammateHand]
				swap(hand, hand.indexOf(card), 5)
				hand.length = 5
				setTeammateHand([...hand])
				break
			}
			case 3: {
				hand = [...opponentHand2]
				swap(hand, hand.indexOf(card), 5)
				hand.length = 5
				setOpponentHand2([...hand])
				break
			}
		}
		matchStage !== "PLAY" && setMatchStage("READY")
		setTurnCount(turnCount + 1)
		function swap(arr, idx1, idx2) {
			[arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]]
		}
	}



	//////////////
	// AI LOGIC //
	//////////////

	const scoreHandByTrump = (hand, suitMap, trump) => {
		if (trump in suitMap) {
			console.log(`decideTrump(CALL): Player ${currentPlayer} trump suit in hand`)
			const left = upTrump.suit.left.name
			const handScore = scoreHand(hand, trump, left)
			let enhancedScore = handScore
			const dealerIsTeammate = findIsTeammate(currentPlayer, dealer)
			if (dealerIsTeammate) {
				enhancedScore += upTrump.value + 10
				if (upTrump.faceValue === "J") enhancedScore += 30
			} else {
				enhancedScore -= upTrump.value + 10
				if (upTrump.faceValue === "J") enhancedScore -= 30
			}
			return enhancedScore
		} else return 0
	}

	const decideTrump = (hand) => {
		const suitMap = groupBySuit(hand)

		switch (matchStage) {
			case "CALL": {
				sleep(1000).then(() => {
					const trump = upTrump.suit.name
					const result = scoreHandByTrump(hand, suitMap, trump)
					result > 50 ? suits[upTrump.suit.code].select() : pass()
				})
				break
			}
			case "PICK": {
				console.log("decideTrump (PICK): PLAYER: ", currentPlayer)
				sleep(1000).then(() => {
					const heartsScore = [scoreHandByTrump(hand, suitMap, "Hearts"), 'h']
					const diamondsScore = [scoreHandByTrump(hand, suitMap, "Diamonds"), 'd']
					const clubsScore = [scoreHandByTrump(hand, suitMap, "Clubs"), 'c']
					const spadesScore = [scoreHandByTrump(hand, suitMap, "Spades"), 's']
					/*
					FIND WAY TO GRAB THE MAX SCORE AND DECIDE TO MAKE IT TRUMP OR NOT
					*/

				})

				break
			}

			case "STUCK": {

			}
			default: console.log("decideTrump AI called on invalid match stage.")
		}
	}

	const decidePlay = () => {
		// get player hand based on player
		// run discard on hand based on choice
		// set the played card to the chosen card

		sleep(1000).then(() => {
			setPlayedCards({ ...playedCards, [currentPlayer]: opponentHand1[0] })
			setCurrentPlayer((currentPlayer + 1) % 4)
			setTurnCount(turnCount + 1)
		})

	}

	const scoreMatch = (match) => {

	}


	////////////////
	// useEffects //
	////////////////

	// Game Setup
	useLayoutEffect(() => {
		console.log("Game Initialized: Getting Deck and setting up hands")
		getDeck()
	}, [dealer])

	// Game Logic
	useLayoutEffect(() => {
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
				console.log("Prompt Management Pick Stage")
				if (turnCount > 3) {
					setTrumpCardOpacity("opacity-0")
					sleep(1000).then(() => {
						setMatchStage("STUCK")
						setCurrentPlayer((dealer + 1) % 4)
						setTurnCount(0)
					})
				} else {
					if (currentPlayer === yourSeat) {
						setPromptText(prompts.trump2Turn) // AWAITING TURN TO DECLARE IT
					} else {
						setPromptText(prompts.trump2Round) // OPTION TO DECLARE IT
						decideTrump(nonPlayerHands[currentPlayer - 1])
					}
					break
				}
			}
			case "STUCK": {
				if (dealer === yourSeat) {
					setPromptText(prompts.trump2Stuck) // STUCK TO DEALER YOU
				} else {
					setPromptText(prompts.trump2StuckOther) // STUCK TO DEALER OTHER PLAYER
				}
				break
			}
			case "READY": {
				console.log("Prompt Management READY Stage")
				setPromptText(prompts.ready)
				break
			}
			case "DISCARD": {
				console.log("Prompt Management DISCARD Stage")
				setPromptText(prompts.discard)
				break
			}
			case "PLAY": {
				console.log("Prompt Management Play Stage")
				if (currentPlayer === yourSeat) {
					setPromptText(prompts.yourTurn)
				} else {
					setPromptText(prompts.othersTurn)
					decidePlay()
				}
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

	console.log("LOG: (stage, cp, tc, pH, tH, oH1, oH2, uT, trump", matchStage, currentPlayer, turnCount, playerHand, teammateHand, opponentHand1, opponentHand2, upTrump, trump)

	////////////
	// RENDER //
	////////////

	return (
		<DataContext.Provider value={{ playedCards, setPlayedCards, handlePlayerChoice, handleDiscard, trumpCardPosition, setTrumpCardPosition, trumpCardOpacity, setTrumpCardOpacity, pass, goAlone, yourSeat, turnCount, setTurnCount, callingPlayer, setCallingPlayer, upTrump, suits, opponentScore, setOpponentScore, currentPrompt, setCurrentPrompt, promptText, setPromptText, showPrompt, setShowPrompt, playerHand, setPlayerHand, teammateHand, setTeammateHand, opponentHand1, setOpponentHand1, opponentHand2, setOpponentHand2, trump, setTrump, teamScore, setTeamScore, matchStage, setMatchStage, dealer, setDealer, currentPlayer, setCurrentPlayer }}>
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