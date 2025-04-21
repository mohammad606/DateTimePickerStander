import dayjs from "dayjs";

interface DateTimeState {
    currentDate: string;
    currentTime: string;
    fullDateTime: string;
    selectYear: string;
    selectMonth: string;
    selectMonthNum: string;
    selectHour: string;
    selectMinute: string;
    selectAmPm: string;
}

type DateTimeAction =
    | { type: 'SET_DATE'; payload: string }
    | { type: 'SET_TIME'; payload: string }
    | { type: 'SET_FULL_DATETIME'; payload: string }
    | { type: 'SET_YEAR'; payload: string }
    | { type: 'SET_MONTH'; payload: { month: string; monthNum: string } }
    | { type: 'SET_HOUR'; payload: string }
    | { type: 'SET_MINUTE'; payload: string }
    | { type: 'SET_AMPM'; payload: string }
    | { type: 'RESET'; payload: { date: string; time: string } };

export const dateTimeReducer = (state: DateTimeState, action: DateTimeAction): DateTimeState => {
    switch (action.type) {
        case 'SET_DATE':
            return { ...state, currentDate: action.payload };
        case 'SET_TIME':
            return { ...state, currentTime: action.payload };
        case 'SET_FULL_DATETIME':
            return { ...state, fullDateTime: action.payload };
        case 'SET_YEAR':
            return { ...state, selectYear: action.payload };
        case 'SET_MONTH':
            return { ...state, selectMonth: action.payload.month, selectMonthNum: action.payload.monthNum };
        case 'SET_HOUR':
            return { ...state, selectHour: action.payload };
        case 'SET_MINUTE':
            return { ...state, selectMinute: action.payload };
        case 'SET_AMPM':
            return { ...state, selectAmPm: action.payload };
        case 'RESET':
            return getInitialState(action.payload.date, action.payload.time);
        default:
            return state;
    }
};

export const getInitialState = (date: string, time: string): DateTimeState => {
    const dayjsDate = dayjs(`${date} ${time}`);
    return {
        currentDate: date,
        currentTime: time,
        fullDateTime: dayjsDate.format('YYYY/MM/DD HH:mm'),
        selectYear: dayjsDate.format('YYYY'),
        selectMonth: dayjsDate.format('MMMM'),
        selectMonthNum: String(dayjsDate.month() + 1).padStart(2, '0'),
        selectHour: dayjsDate.format('HH'),
        selectMinute: dayjsDate.format('mm'),
        selectAmPm: dayjsDate.format('A')
    };
};