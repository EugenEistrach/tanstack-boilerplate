import { type Meta, type StoryObj } from '@storybook/react'
import { Mail } from 'lucide-react'

import { Button } from './button'

const meta = {
	title: 'UI/Button',
	component: Button,
	parameters: {
		layout: 'centered',
		controls: {
			sort: 'requiredFirst',
			expanded: true,
		},
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: [
				'default',
				'destructive',
				'outline',
				'secondary',
				'ghost',
				'link',
			],
			description: 'The visual style of the button',
			table: {
				defaultValue: { summary: 'default' },
				category: 'Appearance',
			},
		},
		size: {
			control: 'select',
			options: ['default', 'sm', 'xs', 'lg', 'icon'],
			description: 'The size of the button',
			table: {
				defaultValue: { summary: 'default' },
				category: 'Appearance',
			},
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the button is disabled',
			table: {
				category: 'State',
			},
		},
		className: {
			control: false,
			description: 'Additional CSS classes to apply',
			table: {
				type: { summary: 'string' },
				category: 'Advanced',
			},
		},
		children: {
			control: false,
			description: 'The content to be rendered inside the button',
			table: {
				type: { summary: 'ReactNode' },
				category: 'Advanced',
			},
		},
		asChild: {
			control: false,
			description: 'Whether to render as a child component using Radix Slot',
			table: {
				type: { summary: 'boolean' },
				category: 'Advanced',
			},
		},
	},
	args: {
		children: 'Button',
	},
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {},
}

export const Secondary: Story = {
	args: {
		variant: 'secondary',
		children: 'Secondary',
	},
}

export const Destructive: Story = {
	args: {
		variant: 'destructive',
		children: 'Destructive',
	},
}

export const Outline: Story = {
	args: {
		variant: 'outline',
		children: 'Outline',
	},
}

export const Ghost: Story = {
	args: {
		variant: 'ghost',
		children: 'Ghost',
	},
}

export const Link: Story = {
	args: {
		variant: 'link',
		children: 'Link Button',
	},
}

export const Small: Story = {
	args: {
		size: 'sm',
		children: 'Small',
	},
}

export const ExtraSmall: Story = {
	args: {
		size: 'xs',
		children: 'Extra Small',
	},
}

export const Large: Story = {
	args: {
		size: 'lg',
		children: 'Large',
	},
}

export const Icon: Story = {
	args: {
		size: 'icon',
		children: <Mail className="h-4 w-4" />,
	},
}

export const Disabled: Story = {
	args: {
		children: 'Disabled',
		disabled: true,
	},
}
