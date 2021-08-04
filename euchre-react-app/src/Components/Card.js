

export default function Card({ card }) {
	const cardCode = "" + card.suit.name[0].toLowerCase() + card.faceValue.toLowerCase()

	return (
		<div onClick={null} className="cursor relative w-24 transform transition-transform delay-75 duration-400 hover:-translate-y-5">
			<img className="transition-opacity opacity-100 filter drop-shadow-2xl shadow-2xl" src={`./cards/${cardCode}.png`} alt={`${card.faceValue} of ${card.suit.name}`} />
		</div>
	)
}