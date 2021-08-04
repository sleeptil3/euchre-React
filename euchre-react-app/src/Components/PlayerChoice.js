
export default function Prompt({ promptText }) {
	return (
		<div className={`text-center text-white font-thin text-xl text-opacity-90 absolute bottom-52 left-0 right-0`}>
			<h1>{promptText.title}</h1>
			<h2>{promptText.question}</h2>
		</div>
	)
}
