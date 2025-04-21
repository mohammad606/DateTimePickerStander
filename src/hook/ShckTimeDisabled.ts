import dayjs from "dayjs";

export const isTimeDisabled = (
    hour: number,
    minute: number,
    shouldDisableTime?: (time: { hour: number; minute: number }) => boolean,
    disabledTimes?: Array<{ from: string; to: string }>
): boolean => {
    if (shouldDisableTime?.({ hour, minute })) {
        return true;
    }
    if (disabledTimes) {
        const currentTime = dayjs().hour(hour).minute(minute);
        return disabledTimes.some(range => {
            const from = dayjs(range.from, 'HH:mm');
            const to = dayjs(range.to, 'HH:mm');
            return currentTime.isAfter(from) && currentTime.isBefore(to);
        });
    }

    return false;
};