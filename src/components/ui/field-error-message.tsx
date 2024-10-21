import { motion, AnimatePresence } from 'framer-motion'
import  { type FieldError } from 'react-hook-form'
import { useTranslations } from 'use-intl'

export const FieldErrorMessage = ({
	error,
}: {
	error: FieldError | undefined
}) => {
	const t = useTranslations()
	// @ts-ignore if the message key is not found, it will return messageKey as value
	const message = error?.message && t(error.message)

	return (
		<AnimatePresence>
			{message && (
				<motion.p
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: 'auto', opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={{ duration: 0.2 }}
					style={{ overflow: 'hidden' }}
					className="mt-1 text-sm text-red-500"
				>
					{message}
				</motion.p>
			)}
		</AnimatePresence>
	)
}
