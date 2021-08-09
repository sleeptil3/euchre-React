import { useState, useEffect, useLayoutEffect, createContext } from "react";
import GameBoard from "../Components/GameBoard";
import Header from "../Components/Header";
import { sleep, blankCard, BASE_URI } from "../Data/data";
import { whiteSpinner } from "../Data/data";

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
		0: blankCard,
		1: blankCard,
		2: blankCard,
		3: blankCard
	})
	const [matchTricks, setMatchTricks] = useState({
		callingTeam: 0,
		opposingTeam: 0
	})
	const [currentMatchScore, setCurrentTrickScore] = useState({})
	const [dealer, setDealer] = useState(0); // 0, 1, 2, 3
	const [currentPlayer, setCurrentPlayer] = useState(dealer + 1); // 0, 1, 2, 3, 4 (result)
	const [turnCount, setTurnCount] = useState(-1)
	const [yourSeat, setYourSeat] = useState(0)
	const [trumpCardOpacity, setTrumpCardOpacity] = useState("opacity-0")
	const [trumpCardPosition, setTrumpCardPosition] = useState("translate-y-0")
	const [matchSuit, setMatchSuit] = useState(null)
	const nonPlayerHands = [opponentHand1, teammateHand, opponentHand2]

	const suits = {
		"h": {
			name: "Hearts",
			code: "h",
			left: { code: "d", name: "Diamonds" },
			select() {
				handleCallUp(suits.h)
			}
		},
		"d": {
			name: "Diamonds",
			code: "d",
			left: { code: "h", name: "Hearts" },
			select() {
				handleCallUp(suits.d)
			}
		},
		"s": {
			name: "Spades",
			code: "s",
			left: { code: "c", name: "Clubs" },
			select() {
				handleCallUp(suits.s)
			}
		},
		"c": {
			name: "Clubs",
			code: "c",
			left: { code: "s", name: "Spades" },
			select() {
				handleCallUp(suits.c)
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
		trickResultWin: {
			title: "Trick Results",
			question: "Your Team Won The Trick",
			choices: [{ text: "Continue", action: () => handleTrickEnd() }]
		},
		trickResultLose: {
			title: "Trick Results",
			question: "The Other Team Won The Trick",
			choices: [{ text: "Continue", action: () => handleTrickEnd() }]
		},

		matchResult: {
			title: "Match Complete",
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
		return cards.reduce((acc, card) => {
			let key = card.suit.name
			if (!acc[key]) {
				acc[key] = []
			}
			acc[key].push(card)
			return acc
		}, {})
	}

	const handleCallUp = (trump) => {
		console.log(trump)
		setTrump(trump)
		matchStage === "CALL" && setTrumpCardPosition("translate-y-20")
		setCallingPlayer(currentPlayer)
		setCurrentPlayer(dealer)
		dealer === yourSeat && matchStage === "CALL" ? setMatchStage("DISCARD") : setMatchStage("READY")
		if (matchStage === "CALL") {
			switch (dealer) {
				case 0: {
					setPlayerHand([...playerHand, upTrump])
					break
				}
				case 1: { setOpponentHand1([...opponentHand1, upTrump]); break; }
				case 2: { setTeammateHand([...teammateHand, upTrump]); break; }
				case 3: { setOpponentHand2([...opponentHand2, upTrump]); break; }
			}
		}
		setTurnCount(turnCount + 1)
	}

	const goAlone = () => {
		// Code
	}

	const scoreHand = (hand, trumpCode, leftSuitCode) => {
		let score = 0
		for (const card of hand) {
			score += getCardScore(card, trumpCode, leftSuitCode)
		}
		return score
	}

	const getCardScore = (card, trumpCode, leftSuitCode) => {
		let score = card.value
		if (card.suit.code === trumpCode) {
			score += 10
			if (card.faceValue === "J") {
				score += 30
			}
		}
		if (card.suit.code === leftSuitCode && card.faceValue === "J") {
			score += 20
		}
		return score
	}


	const findHighestOffSuit = (suitMap, trump) => {

	}

	const findIsTeammate = (player1, player2) => {
		if ((player1 + 2) % 4 === player2) return true
		else return false
	}

	const handlePlayerChoice = (player, card) => {
		console.log("handlePlayerChoice", player, card)
		setPlayedCards({ ...playedCards, [player]: card })
		setCurrentPlayer((currentPlayer + 1) % 4)
		handleDiscard(player, card)
	}

	const handleDiscard = (player, card) => {
		console.log("handleDiscard", player, card)
		const hand = getPlayerHand(player)
		switch (player) {
			case 0: {
				hand.splice(hand.indexOf(card), 1)
				setPlayerHand(sortHand([...hand]))
				break
			}
			case 1: {
				hand.splice(hand.indexOf(card), 1)
				setOpponentHand1([...hand])
				break
			}
			case 2: {
				hand.splice(hand.indexOf(card), 1)
				setTeammateHand([...hand])
				break
			}
			case 3: {
				hand.splice(hand.indexOf(card), 1)
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

	const getPlayerHand = (player) => {
		switch (player) {
			case 0: return [...playerHand]
			case 1: return [...opponentHand1]
			case 2: return [...teammateHand]
			case 3: return [...opponentHand2]
		}
	}

	const scoreTrick = () => {
		let highScore = 0
		let winner
		const plays = [playedCards[0], playedCards[1], playedCards[2], playedCards[3]]
		console.log("score match", plays)
		plays.forEach((play, idx) => {
			if (play !== blankCard) {
				const cardScore = getCardScore(play, trump.code, trump.left.code)
				if (cardScore > highScore) {
					highScore = cardScore
					winner = idx
				}
			}
		})
		console.log("score match results", winner, highScore)
		return { winner, highScore }
	}

	const handleTrickEnd = () => {
		setPlayedCards({
			0: blankCard,
			1: blankCard,
			2: blankCard,
			3: blankCard
		})
		setMatchSuit(null)
		setMatchStage("RESULT")
		setTurnCount(turnCount + 1)
	}


	// Partnership making trump wins 3 or 4 tricks – 1 point
	// Partnership making trump wins 5 tricks – 2 points
	// Lone hand wins 3 or 4 tricks – 1 point
	// Lone hand wins 5 tricks – 4 points
	// Partnership or lone hand is euchred, opponents score 2 points


	const scoreMatch = () => {
		if (matchTricks.callingTeam > matchTricks.opposingTeam) {
			// Calling Team won the match
			if (matchTricks.callingTeam >= 3) {
				if (matchTricks.callingTeam === 5) {
					if (callingPlayer === yourSeat || findIsTeammate(callingPlayer, yourSeat)) setTeamScore(teamScore + 2)
					else setOpponentScore(opponentScore + 2)
				} else {
					if (callingPlayer === yourSeat || findIsTeammate(callingPlayer, yourSeat)) setTeamScore(teamScore + 1)
					else setOpponentScore(opponentScore + 1)
				}
			}
		} else {
			// Calling Team was Euchred
			if (callingPlayer === yourSeat || findIsTeammate(callingPlayer, yourSeat)) setOpponentScore(opponentScore + 2)
			else setTeamScore(teamScore + 2)
		}
		console.log("Match Score End - YT, OT", teamScore, opponentScore)
	}

	//////////////
	// AI LOGIC //
	//////////////



	const scoreHandByTrump = (hand, suitMap, trumpCode) => {
		const trumpName = suits[trumpCode].name
		if (trumpName in suitMap) {
			console.log(`decideTrump(CALL): Player ${currentPlayer} trump suit in hand`)
			const leftCode = suits[trumpCode].left.code
			const handScore = scoreHand(hand, trumpCode, leftCode)
			let enhancedScore = handScore
			if (matchStage === "CALL") {
				const dealerIsTeammate = findIsTeammate(currentPlayer, dealer)
				if (dealerIsTeammate) {
					enhancedScore += upTrump.value + 10
					if (upTrump.faceValue === "J") enhancedScore += 30
				} else {
					enhancedScore -= upTrump.value + 10
					if (upTrump.faceValue === "J") enhancedScore -= 30
				}
			}
			return enhancedScore
		} else return 0
	}



	const decideTrump = (hand) => {
		const suitMap = groupBySuit(hand)
		console.log(suitMap)
		switch (matchStage) {
			case "CALL": {
				sleep(10).then(() => {
					const trumpCode = upTrump.suit.code
					const result = scoreHandByTrump(hand, suitMap, trumpCode)
					result > 150 ? suits[upTrump.suit.code].select() : pass()
				})
				break
			}
			case "PICK": {
				console.log("decideTrump (PICK): PLAYER: ", currentPlayer)
				sleep(10).then(() => {
					const suitScores = [[scoreHandByTrump(hand, suitMap, "h"), 'h'], [scoreHandByTrump(hand, suitMap, "d"), 'd'], [scoreHandByTrump(hand, suitMap, "c"), 'c'], [scoreHandByTrump(hand, suitMap, "s"), 's']]
					let highestScore = 0
					let highSuit
					for (const score of suitScores) {
						console.log(score)
						if (score[1] === upTrump.code) continue
						else if (score[0] > highestScore) {
							highestScore = score[0]
							highSuit = score[1]
						}
					}
					if (highestScore > 170) suits[highSuit].select()
					else pass()
				})

				break
			}

			case "STUCK": {

			}
			default: console.log("decideTrump AI called on invalid match stage.")
		}
	}

	const decideAIplay = (player) => {
		console.log("decideAIplay: BEGIN: currentPlayer: ", player, " turn count: ", turnCount)

		const hand = [...getPlayerHand(player)]
		const suitMap = groupBySuit(hand)
		let chosenCard = null

		if (!matchSuit) {
			// if you are first player of match
			console.log("decideAIplay: NO MATCH SUIT SET")
			let highOffSuitValue = 0
			let highOffSuitCard
			for (const suit in suitMap) {
				if (suit === trump.name) continue
				for (const card of suitMap[suit]) {
					if (card.value > highOffSuitValue) {
						highOffSuitValue = card.value
						highOffSuitCard = card
					}
				}
			}
			// if sufficient high offsuit card, set chosenCard
			if (highOffSuitValue > 4) {
				console.log("decideAIplay: sufficient high offsuit card")
				chosenCard = highOffSuitCard
			}
			// if no sufficient high offsuit card
			else if (suitMap.hasOwnProperty(trump.name)) {
				console.log("decideAIplay: NO sufficient high offsuit card, but you have TRUMP suit")
				// if you have trump and its the right (J), bring out the dead
				const rightTrump = suitMap[trump.name].find(card => card.faceValue === "J")
				chosenCard = rightTrump !== undefined ? rightTrump : null
			}
			if (!chosenCard) {
				console.log("decideAIplay: NO high offsuit card, NO J of TRUMP suit, choosing highest offsuit")
				chosenCard = highOffSuitCard
			}
		} else {
			// not the first player, so play to matchSuit or Trump
			console.log("decideAIplay: MATCH SUIT ALREADY SET")
			const currentWinData = scoreTrick()
			if (suitMap.hasOwnProperty(matchSuit)) {
				console.log("decideAIplay: PLAYER HAS MATCH SUIT IN HAND")
				if (findIsTeammate(currentWinData.winner, player)) {
					// lay something low
					console.log("decideAIplay: TEAMMATE IS WINNING, LAY LOW")
					let lowCardValue = Infinity
					let lowCard
					for (const card of suitMap[matchSuit]) {
						if (card.value < lowCardValue) {
							lowCardValue = card.value
							lowCard = card
						}
					}
					chosenCard = lowCard
				} else {
					console.log("decideAIplay: TEAMMATE IS NOT WINNING, LAY HIGH IF YOU CAN BEAT IT")
					// try to win
					let highCardValue = currentWinData.highScore
					let highCard
					for (const card of suitMap[matchSuit]) {
						if (card.value > highCardValue) {
							highCardValue = card.value
							highCard = card
						}
					}
					chosenCard = highCard
					// can't beat it, lay low offsuit
					if (!chosenCard) {
						let lowCardValue = Infinity
						let lowCard
						for (const suit in suitMap) {
							if (suit === trump.name) continue
							for (const card of suitMap[matchSuit]) {
								if (card.value < lowCardValue) {
									lowCardValue = card.value
									lowCard = card
								}
							}
						}
						chosenCard = lowCard
					}
				}
			} else {
				console.log("decideAIplay: PLAYER DOES NOT HAVE MATCH SUIT IN HAND")
				if (findIsTeammate(currentWinData.winner, player)) {
					console.log("decideAIplay: TEAMMATE IS WINNING, LAY LOW OFF SUIT")
					// if you have off trump, lay lowest
					let lowCardValue = Infinity
					let lowCard
					for (const suit in suitMap) {
						if (suit === trump.name) continue
						for (const card of suitMap[suit]) {
							if (card.value < lowCardValue) {
								lowCardValue = card.value
								lowCard = card
							}
						}
					}
					chosenCard = lowCard
					// if you only have trump, lay lowest
					if (!chosenCard) {
						for (const card of suitMap[trump.name]) {
							if (card.value < lowCardValue) {
								lowCardValue = card.value
								lowCard = card
							}
						}
						chosenCard = lowCard
					}
				} else {
					console.log("decideAIplay: TEAMMATE IS NOT WINNING, LAY LOWEST WINNING TRUMP TO WIN OR LOW OFFSUIT TO PASS")
					let lowTrumpValue = Infinity
					let lowTrumpCard = null
					if (suitMap.hasOwnProperty(trump.name)) {
						for (const trumpCard of suitMap[trump.name]) {
							const scoredTrump = getCardScore(trumpCard, trump.name, trump.left.name)
							if (scoredTrump > currentWinData.highScore) {
								if (scoredTrump < lowTrumpValue) {
									lowTrumpValue = scoredTrump
									lowTrumpCard = trumpCard
								}
							}
						}
						chosenCard = lowTrumpCard
					}
					// didn't have any winning trump
					if (!chosenCard) {
						let lowestOffSuitValue = Infinity
						let lowestOffSuitCard
						for (const card of hand) {
							if (card.suit.name === trump.name) continue
							if (card.value < lowestOffSuitValue) {
								lowestOffSuitValue = card.value
								lowestOffSuitCard = card
							}
						}
						chosenCard = lowestOffSuitCard
					}
				}
			}
		}

		console.log("AI CHOSEN CARD + HAND", chosenCard, hand)

		sleep(10).then(() => {
			if (!matchSuit) setMatchSuit(chosenCard.suit.name)
			setPlayedCards({ ...playedCards, [player]: chosenCard })
			setCurrentPlayer((player + 1) % 4)
			handleDiscard(player, chosenCard)
		})

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
				if (turnCount > 2) {
					setMatchStage("STUCK")
					setCurrentPlayer(dealer)
					setTurnCount(0)
				} else {

					if (currentPlayer === yourSeat) {
						setPromptText(prompts.trump2Turn) // AWAITING TURN TO DECLARE IT
					} else {
						setPromptText(prompts.trump2Round) // OPTION TO DECLARE IT
						decideTrump(nonPlayerHands[currentPlayer - 1])
					}
				}
				break
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
				if (turnCount < 4) {
					if (currentPlayer === yourSeat) {
						setPromptText(prompts.yourTurn)
					} else {
						setPromptText(prompts.othersTurn)
						decideAIplay(currentPlayer)
					}
				} else {
					const trickScoreData = scoreTrick()
					setCurrentTrickScore(trickScoreData)
					if (trickScoreData.winner === callingPlayer || findIsTeammate(trickScoreData.winner, callingPlayer)) {
						setMatchTricks({ ...matchTricks, callingTeam: ++matchTricks.callingTeam })
					} else {
						setMatchTricks({ ...matchTricks, opposingTeam: ++matchTricks.opposingTeam })
					}
					if (trickScoreData.winner === yourSeat || findIsTeammate(trickScoreData.winner, yourSeat)) {
						setPromptText(prompts.trickResultWin)
					} else {
						setPromptText(prompts.trickResultLose)
					}
				}
				break
			}
			case "RESULT": {
				console.log("Prompt Management RESULT Stage")
				setCurrentPlayer(currentMatchScore.winner)
				if (playerHand.length === 0) scoreMatch()
				else {
					setMatchStage("PLAY")
					setTurnCount(0)
				}
				break
			}
			case "GAMEOVER": {
				console.log("Prompt Management GAMEOVER Stage")
				break
			}
			default: console.log("Prompt Management Default Case")
		}
	}, [turnCount]);

	console.log("LOG: (stage, cp, tc, pH, tH, oH1, oH2, uT, trump", matchStage, currentPlayer, turnCount, playerHand, opponentHand1, teammateHand, opponentHand2, upTrump, trump)

	////////////
	// RENDER //
	////////////

	return (
		<DataContext.Provider value={{ matchTricks, playedCards, setPlayedCards, handlePlayerChoice, handleDiscard, trumpCardPosition, setTrumpCardPosition, trumpCardOpacity, setTrumpCardOpacity, pass, goAlone, yourSeat, turnCount, setTurnCount, callingPlayer, setCallingPlayer, upTrump, suits, opponentScore, setOpponentScore, currentPrompt, setCurrentPrompt, promptText, setPromptText, showPrompt, setShowPrompt, playerHand, setPlayerHand, teammateHand, setTeammateHand, opponentHand1, setOpponentHand1, opponentHand2, setOpponentHand2, trump, setTrump, teamScore, setTeamScore, matchStage, setMatchStage, dealer, setDealer, currentPlayer, setCurrentPlayer }}>
			<div className="h-screen bg-gray-800 flex flex-col justify-start items-center">
				<Header />
				<div className="h-full w-full flex justify-center items-center">
					{upTrump === {} ? whiteSpinner : <GameBoard />}
				</div>
			</div>
		</DataContext.Provider>
	)
}

export const DataContext = createContext()