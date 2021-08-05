module.exports = {
	purge: {
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
				'game-canvas': "url('/src/images/bg-board.png')"
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
