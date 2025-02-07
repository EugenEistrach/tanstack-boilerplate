import { oklch, formatCss } from 'culori'

const colors = {
	light: {
		background: '#fefbff',
		foreground: '#1b1b1f',
		card: '#fefbff',
		'card-foreground': '#1b1b1f',
		popover: '#fefbff',
		'popover-foreground': '#1b1b1f',
		primary: '#005ac3',
		'primary-foreground': '#ffffff',
		secondary: '#575e71',
		'secondary-foreground': '#1b1b1f',
		muted: '#e1e2ec',
		'muted-foreground': '#44474f',
		accent: '#f2f0f4',
		'accent-foreground': '#303034',
		destructive: '#ba1a1a',
		'destructive-foreground': '#ffffff',
		border: '#e1e2ec',
		input: '#e1e2ec',
		ring: '#d8e2ff',
		'sidebar-background': '#fafafa',
		'sidebar-foreground': '#404042',
		'sidebar-primary': '#1a1a1a',
		'sidebar-primary-foreground': '#fafafa',
		'sidebar-accent': '#f4f4f5',
		'sidebar-accent-foreground': '#1a1a1a',
		'sidebar-border': '#e8e8e8',
		'sidebar-ring': '#3b82f6',
		'chart-1': '#ff6b6b',
		'chart-2': '#4ecdc4',
		'chart-3': '#45b7d1',
		'chart-4': '#96ceb4',
		'chart-5': '#ffeead',
	},
	dark: {
		background: '#1b1b1f',
		foreground: '#e3e2e6',
		card: '#1b1b1f',
		'card-foreground': '#e3e2e6',
		popover: '#1b1b1f',
		'popover-foreground': '#e3e2e6',
		primary: '#adc6ff',
		'primary-foreground': '#003258',
		secondary: '#c1c7dc',
		'secondary-foreground': '#293041',
		muted: '#44474f',
		'muted-foreground': '#c4c6d0',
		accent: '#46464f',
		'accent-foreground': '#c8c6ca',
		destructive: '#ffb4ab',
		'destructive-foreground': '#690005',
		border: '#44474f',
		input: '#44474f',
		ring: '#004495',
		'sidebar-background': '#1a1a1a',
		'sidebar-foreground': '#f4f4f5',
		'sidebar-primary': '#fafafa',
		'sidebar-primary-foreground': '#1a1a1a',
		'sidebar-accent': '#292929',
		'sidebar-accent-foreground': '#f4f4f5',
		'sidebar-border': '#292929',
		'sidebar-ring': '#3b82f6',
		'chart-1': '#60a5fa',
		'chart-2': '#34d399',
		'chart-3': '#fbbf24',
		'chart-4': '#a78bfa',
		'chart-5': '#f87171',
	},
}

function convertHexToOklch(hex) {
	const color = oklch(hex)
	// Format as "L% C H" where L is percentage, C is 0-0.4 typically, H is degrees
	return `${(color.l * 100).toFixed(2)}% ${color.c.toFixed(3)} ${color.h?.toFixed(2) || 0}`
}

function processColors(theme) {
	const result = {}
	for (const [key, value] of Object.entries(theme)) {
		result[key] = convertHexToOklch(value)
	}
	return result
}

const lightColors = processColors(colors.light)
const darkColors = processColors(colors.dark)

console.log('Light theme OKLCH values:')
console.log(JSON.stringify(lightColors, null, 2))
console.log('\nDark theme OKLCH values:')
console.log(JSON.stringify(darkColors, null, 2))
