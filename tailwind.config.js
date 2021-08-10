module.exports = {
	purge: {
		enabled: false,
		content: [
			'./src/**.js',
			'./src/**/*.js',
			'./src/**/**/*.js',
			'./public/index.html'
		],
	},
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			backgroundImage: theme => ({
				'game-canvas': "url('https://euchre.sleeptil3software.com/bg-board.png')"
			}),
			height: {
				"canvas": "720px",
			},
			width: {
				"canvas": "1280px",
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}

// url('../public/bg-board.png')