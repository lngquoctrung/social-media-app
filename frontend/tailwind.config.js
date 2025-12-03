/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			keyframes: {
				modalEnter: {
					from: {
						opacity: '0',
						transform: 'scale(0.95)',
					},
					to: {
						opacity: '1',
						transform: 'scale(1)',
					},
				},
			},
			animation: {
				'modal-enter': 'modalEnter 0.2s ease-out',
			},
		},
	},
	plugins: [],
};
