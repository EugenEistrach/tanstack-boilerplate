import { createContext, useContext } from 'react'

export const TimezoneContext = createContext<string | undefined>(undefined)

export const useTimezone = () => {
	const timezone = useContext(TimezoneContext)
	if (timezone === undefined) {
		throw new Error('useTimezone must be used within a TimezoneProvider')
	}
	return timezone
}
