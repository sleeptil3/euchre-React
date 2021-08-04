import { useState, useEffect, createContext } from "react";
import { BASE_URI } from "../Data/data";
import GameBoard from "../Components/GameBoard";
import Header from "../Components/Header";
import { prompts } from '../Data/data';

export default function Game() {
	// State
	const [deck, setDeck] = useState([]);
	const [newGame, setNewGame] = useState(false);
	const [playerHand, setPlayerHand] = useState([]);
	const [teammateHand, setTeammateHand] = useState([]);
	const [opponentHand1, setOpponentHand1] = useState([]);
	const [opponentHand2, setOpponentHand2] = useState([]);
	const [trump, setTrump] = useState({}); // {suit, left}
	const [teamScore, setTeamScore] = useState(0);
	const [matchStage, setMatchStage] = useState("PRE"); // PRE, DEAL, CALL, PICK, PLAY
	const [dealer, setDealer] = useState(-1); // 0, 1, 2, 3
	const [turn, setTurn] = useState(0); // 0, 1, 2, 3, 4 (result)
	const [showPrompt, setShowPrompt] = useState(false)
	const [promptText, setPromptText] = useState(prompts[0])
	const [currentPrompt, setCurrentPrompt] = useState(0)

	// Functions
	const getDeck = async () => {
		try {
			const response = await fetch(BASE_URI + "deck")
			const data = await response.json()
			setDeck([...data.deck])
		} catch (error) {
			console.error(error)
		}
	};

	const dealCards = async () => {
		setPlayerHand(sortHand([...deck.slice(0, 5)]))
		setTeammateHand([...deck.slice(5, 10)])
		setOpponentHand1([...deck.slice(10, 15)])
		setOpponentHand2([...deck.slice(15, 20)])
	}

	const sortHand = (hand) => {
		const suitMap = groupBySuit(hand)
		let sortedHand = []
		for (const suit in suitMap) {
			suitMap[suit].sort((a, b) => a.value - b.value)
			suitMap[suit].forEach(card => sortedHand.push(card))
		}
		return sortedHand

		function groupBySuit(cards) {
			return cards.reduce(function (acc, card) {
				let key = card.suit.name
				if (!acc[key]) {
					acc[key] = []
				}
				acc[key].push(card)
				return acc
			}, {})
		}
	}

	// Effects

	// Get a new shuffled deck from API
	useEffect(() => {
		newGame && getDeck();
	}, [newGame]);

	// Populate player/AIs hands, Retrigger on dealer change
	useEffect(() => {
		if (matchStage === "DEAL") {
			dealCards();
			setMatchStage("CALL")
		}
	}, [deck, dealer]);

	//
	console.log("MATCH STATE -------------------------")
	console.log("matchStage", matchStage)
	console.log("turn", turn)
	console.log("dealer", dealer)
	console.log("(end)")

	return (
		<DataContext.Provider value={{ currentPrompt, setCurrentPrompt, promptText, setPromptText, showPrompt, setShowPrompt, setNewGame, playerHand, setPlayerHand, teammateHand, setTeammateHand, opponentHand1, setOpponentHand1, opponentHand2, setOpponentHand2, trump, setTrump, teamScore, setTeamScore, matchStage, setMatchStage, dealer, setDealer, turn, setTurn }}>
			<div className="h-screen bg-blue-900 flex flex-col justify-stretch">
				<Header />
				<div className="bg-gray-800 h-full flex justify-center items-center">
					<GameBoard />
				</div>
			</div>
		</DataContext.Provider>
	)
}

export const DataContext = createContext()