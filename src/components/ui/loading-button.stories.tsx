import { type Meta, type StoryObj } from '@storybook/react'
import { Mail } from 'lucide-react'

import { LoadingButton } from './loading-button'

const meta = {
	title: 'UI/LoadingButton',
	component: LoadingButton,
	parameters: {
		layout: 'centered',
		controls: {
			sort: 'requiredFirst',
			expanded: true,
		},
		disableAnimations: true,
		waitForLoadingState: true,
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
		loading: {
			control: 'boolean',
			description: 'Whether the button is in a loading state',
			table: {
				category: 'State',
			},
		},
		Icon: {
			control: false,
			description: 'The icon component to display when not loading',
			table: {
				category: 'Icons',
				type: { summary: 'LucideIcon' },
			},
		},
		iconPosition: {
			control: 'radio',
			options: ['left', 'right'],
			description: 'The position of the icon',
			table: {
				category: 'Icons',
				defaultValue: { summary: 'left' },
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
		children: 'Loading Button',
		Icon: Mail,
		loading: false,
	},
} satisfies Meta<typeof LoadingButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {},
}

export const Loading: Story = {
	args: {
		children: 'Loading...',
		loading: true,
	},
}

export const RightIcon: Story = {
	args: {
		children: 'Right Icon',
		iconPosition: 'right',
	},
}

export const LoadingRightIcon: Story = {
	args: {
		children: 'Loading...',
		loading: true,
		iconPosition: 'right',
	},
}

export const WithVariants: Story = {
	args: {},
	render: (args) => (
		<div className="flex flex-wrap gap-4">
			<LoadingButton {...args} variant="default">
				Default
			</LoadingButton>
			<LoadingButton {...args} variant="secondary">
				Secondary
			</LoadingButton>
			<LoadingButton {...args} variant="destructive">
				Destructive
			</LoadingButton>
			<LoadingButton {...args} variant="outline">
				Outline
			</LoadingButton>
			<LoadingButton {...args} variant="ghost">
				Ghost
			</LoadingButton>
		</div>
	),
}
