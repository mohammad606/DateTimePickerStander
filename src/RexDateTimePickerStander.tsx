import React, {useEffect, useRef, useState, useCallback, useMemo, useReducer} from 'react';
import dayjs from "dayjs";
import CalendarSvg from "@/components/icon/CalendarSvg.tsx";
import ArrowIcon from "@/components/icon/ArrowIcon.tsx";
import ArrowMonthIcon from "@/components/icon/ArrowMonthIcon.tsx";
import TimePicker from "@/components/TimePicker.tsx";
import {isTimeDisabled} from "@/hook/ShckTimeDisabled.ts";
import {dateTimeReducer, getInitialState} from "@/hook/DateTimeReducer.ts";
import {currentMonth, currentYear, days, hours12, hours24, minutes, years} from "@/components/Variables.ts";


export interface PickerValidDateLookup {
    [key: string]: dayjs.Dayjs;
}
export type PickerValidDate = PickerValidDateLookup[keyof PickerValidDateLookup];

type SetFormValue<TValue = any> = <TFieldName extends string>(
    name: TFieldName,
    value: TValue,
    options?: {
        shouldValidate?: boolean;
        shouldDirty?: boolean;
        shouldTouch?: boolean;
    }
) => void;

interface RexDatePickerProps {
    width?: string;
    px?: string;
    py?: string;
    bgColor?: string;
    bgDate?: string;
    fontSize?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
    svgSize?: string;
    bgSelectDate?: string;
    svgColor?: string;
    fontColor?: string;
    defaultDate?: string;
    defaultTime?: string;
    showTimePicker?: boolean;
    timeFormat?: '12h' | '24h';
    getDateChange?: (date: string) => void;
    nameFormHook?: string;
    setValueFormHook?: SetFormValue;
    shouldDisableDate?: (date: PickerValidDate) => boolean;
    shouldDisableTime?: (time: { hour: number; minute: number }) => boolean;
    disabledTimes?: Array<{ from: string; to: string }>;
}







const RexDateTimePickerStander = ({
                                      width = '250px',
                                      px = '10px',
                                      py = '4px',
                                      bgColor = '#101316',
                                      bgDate = '',
                                      fontSize = '16px',
                                      borderWidth = '1px',
                                      borderStyle = 'solid',
                                      borderColor = '#ffff',
                                      svgSize = '20px',
                                      svgColor = '#ffff',
                                      bgSelectDate = '#2e2e2e',
                                      fontColor = '#ffff',
                                      defaultDate = '',
                                      defaultTime = '00:00',
                                      showTimePicker = true,
                                      timeFormat = '12h',
                                      getDateChange,
                                      nameFormHook,
                                      setValueFormHook,
                                      shouldDisableDate = () => false,
                                      shouldDisableTime,
                                      disabledTimes
                                  }: RexDatePickerProps) => {
    const [state, dispatch] = useReducer(dateTimeReducer, {
        date: defaultDate || dayjs().format('YYYY/MM/DD'),
        time: defaultTime || '00:00'
    }, ({ date, time }) => getInitialState(date, time));

    const [open, setOpen] = useState(false);
    const [openYear, setOpenYear] = useState(false);
    const [openTime, setOpenTime] = useState(false);
    const currentYearRef = useRef<HTMLSpanElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);


    const generateCalendar = useCallback((month: string, year: string): (number | string)[][] => {
        const firstDayOfMonth = dayjs(`${year}-${month}-01`);
        const daysInMonth = firstDayOfMonth.daysInMonth();
        let calendar: (number | string)[][] = [];
        let week: (number | string)[] = Array(7).fill(' ');

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = dayjs(`${year}-${month}-${day}`);
            const dayOfWeek = currentDate.day();
            week[dayOfWeek] = day;
            if (dayOfWeek === 6 || day === daysInMonth) {
                calendar.push([...week]);
                week = Array(7).fill(' ');
            }
        }
        return calendar;
    }, []);

    const calendar = useMemo(() => generateCalendar(state.selectMonth, state.selectYear),
        [state.selectMonth, state.selectYear, generateCalendar]);

    useEffect(() => {
        if (currentYearRef.current && openYear) {
            currentYearRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [openYear]);

    useEffect(() => {
        const newDateTime = `${state.currentDate} ${state.currentTime}`;
        dispatch({ type: 'SET_FULL_DATETIME', payload: newDateTime });

        if (getDateChange) {
            getDateChange(newDateTime);
        }
        if (nameFormHook && setValueFormHook) {
            setValueFormHook(nameFormHook, newDateTime);
        }
    }, [state.currentDate, state.currentTime, getDateChange, nameFormHook, setValueFormHook]);

    const changeMonth = useCallback((direction: 'next' | 'prev') => {
        const currentMonth = dayjs(`${state.selectMonth} 1, ${state.selectYear}`);
        const newMonth = direction === 'next'
            ? currentMonth.add(1, 'month')
            : currentMonth.subtract(1, 'month');

        dispatch({
            type: 'SET_MONTH',
            payload: {
                month: newMonth.format('MMMM'),
                monthNum: String(newMonth.month() + 1).padStart(2, '0')
            }
        });
        dispatch({ type: 'SET_YEAR', payload: newMonth.format('YYYY') });
    }, [state.selectMonth, state.selectYear]);

    const handleDateClick = useCallback((day: number) => {
        const formattedDate = `${state.selectYear}/${state.selectMonthNum}/${String(day).padStart(2, '0')}`;
        const dateObj = dayjs(formattedDate);

        if (shouldDisableDate(dateObj)) {
            return;
        }

        dispatch({ type: 'SET_DATE', payload: formattedDate });
    }, [state.selectYear, state.selectMonthNum, shouldDisableDate]);

    const handleTimeClick = useCallback((type: 'hour' | 'minute' | 'ampm', value: string) => {
        const newHour = type === 'hour' ? value.padStart(2, '0') : state.selectHour;
        const newMinute = type === 'minute' ? value.padStart(2, '0') : state.selectMinute;
        const newAmPm = type === 'ampm' ? value : state.selectAmPm;

        // تحويل الساعة إلى تنسيق 24 ساعة للتحقق
        const hour24 = timeFormat === '12h' ?
            (newAmPm === 'AM' ? parseInt(newHour) : parseInt(newHour) + 12) :
            parseInt(newHour);

        if (isTimeDisabled(hour24, parseInt(newMinute), shouldDisableTime, disabledTimes)) {
            return;
        }

        if (type === 'hour') {
            dispatch({ type: 'SET_HOUR', payload: newHour });
        } else if (type === 'minute') {
            dispatch({ type: 'SET_MINUTE', payload: newMinute });
        } else if (type === 'ampm') {
            dispatch({ type: 'SET_AMPM', payload: newAmPm });
        }

        if (timeFormat === '12h') {
            const formattedTime = `${newHour}:${newMinute} ${newAmPm}`;
            const time24 = dayjs(`2000-01-01 ${formattedTime}`).format('HH:mm');
            dispatch({ type: 'SET_TIME', payload: time24 });
        } else {
            const formattedTime = `${newHour}:${newMinute}`;
            dispatch({ type: 'SET_TIME', payload: formattedTime });
        }
    }, [state.selectHour, state.selectMinute, state.selectAmPm, timeFormat, shouldDisableTime, disabledTimes]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setOpen(false);
                setOpenYear(false);
                setOpenTime(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);




    return (
        <div className={'contDatePicker'} style={{
            width: `${width}`,
            padding: `${py} ${px}`,
            backgroundColor: `${bgColor}`,
            border: `${borderWidth} ${borderStyle} ${borderColor}`,
            position: 'relative'
        }}>
            <p className={'showDate'}
               style={{backgroundColor: `${bgDate}`, fontSize: `${fontSize}`, color: `${fontColor}`}}>
                {showTimePicker
                    ? (timeFormat === '12h'
                        ? dayjs(state.fullDateTime).format('YYYY/MM/DD hh:mm A')
                        : dayjs(state.fullDateTime).format('YYYY/MM/DD HH:mm'))
                    : state.currentDate}
            </p>
            <CalendarSvg
                props={'calSvg'}
                style={{width: `${svgSize}`, height: `${svgSize}`, fill: `${svgColor}`}}
                onClick={() => setOpen(!open)}
            />
            <div
                ref={calendarRef}
                className={'contSelectDate'}
                style={{
                    display: `${open ? 'flex' : 'none'}`,
                    backgroundColor: `${bgSelectDate}`,
                    position: 'absolute',
                    zIndex: 1000,
                    minWidth:showTimePicker?"450px":'320px'
                }}
            >
                <div className={'contSelectDatePicker'} >
                    <div className={'controlDate'}>
                        <div className={'yearSelector'} style={{color: `${fontColor}`}}
                             onClick={() => setOpenYear(!openYear)}>
                            <p>{state.selectMonth}</p>
                            <p>{state.selectYear}</p>
                            <ArrowIcon style={{rotate: `${openYear ? '0deg' : "180deg"}`, fill: `${svgColor}`}}/>
                        </div>
                        <div className={'contMonthSelect'}>
                            <ArrowMonthIcon
                                style={{fill: `${svgColor}`}}
                                onClick={() => changeMonth('prev')}
                            />
                            <ArrowMonthIcon
                                style={{rotate: '180deg', fill: `${svgColor}`}}
                                onClick={() => changeMonth('next')}
                            />
                        </div>
                    </div>
                    <div className={'contSelectorDay'} style={{color: `${fontColor}`}}>
                        <div className={'contDay'}>
                            {days.map((day, i) => (
                                <span key={i} style={{width: '100%'}}>{day}</span>
                            ))}
                        </div>
                        {calendar.map((week, i) => (
                            <div key={i} className={'contDayNum'}>
                                {week?.map((day: any, j: number) => {
                                    if (day === ' ') {
                                        return <span key={j} className={'dayNum'}>{day}</span>;
                                    }

                                    const dateObj = dayjs(`${state.selectYear}-${state.selectMonthNum}-${day}`);
                                    const isDisabled = shouldDisableDate(dateObj);
                                    const isCurrentDay = day === dayjs().date() &&
                                        state.selectMonth === currentMonth &&
                                        state.selectYear === currentYear;
                                    const isSelected = `${state.selectYear}/${state.selectMonthNum}/${String(day).padStart(2, '0')}` === state.currentDate;

                                    return (
                                        <span
                                            key={j}
                                            className={'dayNum'}
                                            style={{
                                                background: isSelected
                                                    ? '#5252e5'
                                                    : isCurrentDay
                                                        ? '#4CAF50'
                                                        : 'transparent',
                                                opacity: isDisabled ? 0.5 : 1,
                                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                color: isDisabled ? '#ccc' : fontColor
                                            }}
                                            onClick={() => {
                                                if (!isDisabled) {
                                                    handleDateClick(day);
                                                }
                                            }}
                                            title={isDisabled ? "هذا التاريخ غير متاح" : ""}
                                        >
                                        {day}
                                    </span>
                                    );
                                })}
                            </div>
                        ))}
                        <div
                            className={'yearSelectorArray'}
                            style={{
                                backgroundColor: `${bgSelectDate}`,
                                display: `${openYear ? 'grid' : "none"}`
                            }}
                        >
                            {years.map((year, i) => {
                                const isCurrentYear = year === parseInt(currentYear);
                                const isSelectedYear = year === parseInt(state.selectYear);

                                return (
                                    <span
                                        key={i}
                                        ref={isCurrentYear ? currentYearRef : null}
                                        onClick={() => {
                                            dispatch({ type: 'SET_YEAR', payload: year.toString() });
                                            setOpenYear(false);
                                        }}
                                        className={'yearNum'}
                                        style={{
                                            color: `${fontColor}`,
                                            background: isSelectedYear
                                                ? "#5252e5"
                                                : isCurrentYear
                                                    ? '#4CAF50'
                                                    : 'transparent'
                                        }}
                                    >
                                    {year}
                                </span>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <TimePicker shouldDisableTime={shouldDisableTime} showTimePicker={showTimePicker} openTime={openTime} setOpenTime={setOpenTime} fontColor={fontColor} timeFormat={timeFormat}
                            state={state} hours12={hours12} hours24={hours24} minutes={minutes} handleTimeClick={handleTimeClick}/>

            </div>
        </div>
    );
};

export default RexDateTimePickerStander;