import { useCallback } from 'react';
import { useAppSelector } from '../app/hooks';
import { selectUser } from '../features/auth/selectors';
import {
	formatInUserTimeZone,
	formatUserDate,
	formatUserDateTime,
	formatUserDateTimeDetailed,
	formatUserTime,
	type FormatUserDateTimeOptions,
} from './userDateTime';
import { resolveUserTimeZone } from './userTimeZones';

export function useUserTimeZone(): string {
	const user = useAppSelector(selectUser);
	return resolveUserTimeZone(user?.timezone);
}

export function useFormatUserDateTime(): {
	timeZone: string;
	format: (utcInput: string | number | Date | null | undefined, opts?: FormatUserDateTimeOptions) => string;
	formatTime: (utcInput: string | number | Date | null | undefined) => string;
	formatDate: (utcInput: string | number | Date | null | undefined) => string;
	formatDateTime: (utcInput: string | number | Date | null | undefined) => string;
	formatDetailed: (utcInput: string | number | Date | null | undefined) => string;
} {
	const user = useAppSelector(selectUser);
	const timeZone = resolveUserTimeZone(user?.timezone);
	const language = user?.language;

	const format = useCallback(
		(utcInput: string | number | Date | null | undefined, opts?: FormatUserDateTimeOptions) =>
			formatInUserTimeZone(utcInput, { ...opts, timeZone: opts?.timeZone ?? timeZone, locale: opts?.locale }),
		[timeZone]
	);

	const formatTimeFn = useCallback(
		(utcInput: string | number | Date | null | undefined) => formatUserTime(utcInput, timeZone, language),
		[timeZone, language]
	);

	const formatDateFn = useCallback(
		(utcInput: string | number | Date | null | undefined) => formatUserDate(utcInput, timeZone, language),
		[timeZone, language]
	);

	const formatDateTimeFn = useCallback(
		(utcInput: string | number | Date | null | undefined) =>
			formatUserDateTime(utcInput, timeZone, language),
		[timeZone, language]
	);

	const formatDetailed = useCallback(
		(utcInput: string | number | Date | null | undefined) =>
			formatUserDateTimeDetailed(utcInput, timeZone, language),
		[timeZone, language]
	);

	return {
		timeZone,
		format,
		formatTime: formatTimeFn,
		formatDate: formatDateFn,
		formatDateTime: formatDateTimeFn,
		formatDetailed,
	};
}
