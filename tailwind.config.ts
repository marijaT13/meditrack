import type { Config } from "tailwindcss";

const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		},
  	},
  	extend: {
  		colors: {
  			green: {
  				'500': '#657f38',
  				'600': '#9eab57'
  			},
  			blue: {
  				'500': '#79B5EC',
  				'600': '#054076'
  			},
  			red: {
  				'500': '#CA1F1D',
  				'600': '#570B09',
  				'700': '#CD0D00'
  			},
  			light: {
  				'200': '#DCDCDC'
  			},
  			dark: {
  				'200': '#0D0F10',
  				'300': '#131619',
  				'400': '#1A1D21',
  				'500': '#404447',
  				'600': '#87929B',
  				'700': '#B0B5BA'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-sans)',
                    ...fontFamily.sans
                ],
  		},
  		backgroundImage: {
			appointments: "url('/assets/images/appointments-bg.png')",
			pending: "url('/assets/images/pending-bg.png')",
			cancelled: "url('/assets/images/cancelled-bg.png')",
			},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'caret-blink': {
  				'0%,70%,100%': {
  					opacity: '1'
  				},
  				'20%,50%': {
  					opacity: '0'
  				}
  			},
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'caret-blink': 'caret-blink 1.25s ease-out infinite',
  			
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default module;