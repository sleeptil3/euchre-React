

export const BASE_URI = "https://euchre-api.herokuapp.com/api/"
// export const BASE_URI = "http://localhost:3033/api/"

export function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
// sleep(1500).then(() => setMatchStage("DEAL"));

export const srcArray = [
	"./bg-board.png",
	"./cards/c9.png",
	"./cards/c10.png",
	"./cards/ca.png",
	"./cards/cj.png",
	"./cards/ck.png",
	"./cards/cq.png",
	"./cards/d9.png",
	"./cards/d10.png",
	"./cards/da.png",
	"./cards/dj.png",
	"./cards/dk.png",
	"./cards/dq.png",
	"./cards/h9.png",
	"./cards/h10.png",
	"./cards/ha.png",
	"./cards/hj.png",
	"./cards/hk.png",
	"./cards/hq.png",
	"./cards/s9.png",
	"./cards/s10.png",
	"./cards/sa.png",
	"./cards/sj.png",
	"./cards/sk.png",
	"./cards/sq.png",
	"./cards/down5.png",
	"./cards/down4.png",
	"./cards/down3.png",
	"./cards/down2.png",
	"./cards/down1.png",
	"./cards/down0.png",
	"./cards/deck.png",
]
export const cacheImages = async (srcArray) => {
	const promises = await srcArray.map(src => {
		return new Promise((resolve, reject) => {
			const img = new Image()

			img.src = src
			img.onload = resolve()
			img.onerror = reject()
		})
	})

	await Promise.all(promises)
}

export const blankCard = {
	faceValue: "0",
	suit: {
		code: "0",
		name: "Blank",
		left: {
			code: "0",
			name: "0"
		}
	},
	value: 0
}

export const dealerIcon = <svg
	width="34"
	height="34"
	viewBox="0 0 34 34"
	fill="none"
	xmlns="http://www.w3.org/2000/svg">
	<circle cx="17" cy="17" r="16.5" opacity="0.65" stroke="white" />
	<path
		opacity="0.65"
		d="M26.47 9.35L25.13 8.79V17.82L27.56 11.96C27.97 10.94 27.5 9.77 26.47 9.35V9.35ZM6.97 13.05L11.93 25C12.0761 25.3636 12.3252 25.6765 12.6468 25.9004C12.9683 26.1243 13.3483 26.2493 13.74 26.26C14 26.26 14.27 26.21 14.53 26.1L21.9 23.05C22.65 22.74 23.11 22 23.13 21.26C23.14 21 23.09 20.71 23 20.45L18 8.5C17.8587 8.13402 17.6104 7.81906 17.2876 7.59612C16.9648 7.37317 16.5823 7.25257 16.19 7.25C15.93 7.25 15.67 7.31 15.42 7.4L8.06 10.45C7.57076 10.6503 7.18111 11.0368 6.97671 11.5243C6.77231 12.0119 6.7699 12.5607 6.97 13.05V13.05ZM23.12 9.25C23.12 8.71957 22.9093 8.21086 22.5342 7.83579C22.1591 7.46071 21.6504 7.25 21.12 7.25H19.67L23.12 15.59"
		fill="white" />
</svg>


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

export const whiteSpinner = <svg
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
		fill="white"
		fillOpacity="0.65"
	/>
	<path
		d="M40.9526 83.3435C63.5708 83.3435 81.9053 64.6871 81.9053 41.6718H69.6195C69.6195 49.4082 66.5992 56.8277 61.2232 62.2982C55.8471 67.7687 48.5556 70.842 40.9526 70.842V83.3435Z"
		fill="white"
		fillOpacity="0.65"
	/>
	<path
		d="M0 41.6718C0 18.6564 18.3345 0 40.9527 0V12.5015C33.3497 12.5015 26.0582 15.5748 20.6821 21.0453C15.306 26.5158 12.2858 33.9353 12.2858 41.6718H0Z"
		fill="white"
		fillOpacity="0.65"
	/>
</svg>