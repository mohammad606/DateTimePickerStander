import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

interface TimeWheelProps {
    fontColor: string;
    timeFormat: '12h' | '24h';
    hours12?: number[];
    hours24?: number[];
    minutess?: number[];
    state: {
        selectHour: string;
        selectMinute: string;
        selectAmPm?: string;
    };
    handleTimeClick: (type: 'hour' | 'minute' | 'ampm', value: string) => void;
    shouldDisableTime?: (time: { hour: number; minute: number }) => boolean,
}

interface WheelItemProps {
    now: number;
    formatted: string;
    isSelected: boolean;
    onClick: () => void;
    isDisabled: boolean;
}

const TimeWheel = ({
                       fontColor,
                       timeFormat,
                       hours12,
                       hours24,
                       minutess,
                       state,
                       handleTimeClick,
                       shouldDisableTime
                   }: TimeWheelProps) => {
    const ITEM_HEIGHT = 40;
    const VISIBLE_ITEMS = 3;
    const PADDING_ITEMS = Math.floor(VISIBLE_ITEMS / 2);

    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    const [selectedHour, setSelectedHour] = useState<string>('12');
    const [selectedMinute, setSelectedMinute] = useState<string>('00');

    const hourRef = useRef<HTMLDivElement>(null);
    const minuteRef = useRef<HTMLDivElement>(null);

    const isTimeDisabled = (
        hour: number,
        minute: number,
        shouldDisableTime?: (time: { hour: number; minute: number }) => boolean,
    ): boolean => {
        return !!shouldDisableTime?.({hour, minute});

    };

    useEffect(() => {
        const hourIndex = hours.indexOf(selectedHour);
        const minuteIndex = minutes.indexOf(selectedMinute);

        if (hourRef.current) {
            hourRef.current.scrollTop = (hourIndex) * ITEM_HEIGHT;
        }
        if (minuteRef.current) {
            minuteRef.current.scrollTop = (minuteIndex) * ITEM_HEIGHT;
        }
    }, []);

    const handleScroll = (ref: React.MutableRefObject<HTMLDivElement | null>, type: 'hour' | 'minute') => {
        if (!ref.current) return;

        const { scrollTop } = ref.current;
        const selectedIndex = Math.round(scrollTop / ITEM_HEIGHT);

        if (type === 'hour') {
            setSelectedHour(hours[selectedIndex]);
        } else {
            setSelectedMinute(minutes[selectedIndex]);
        }
    };

    const WheelItem = ({ now, formatted, isSelected, onClick,isDisabled }: WheelItemProps) => (
        <div
            key={`now-${now}`}
            className={`wheel-item ${selectedHour === formatted || selectedMinute === formatted ? 'selected' : ''}`}
            style={{ height: ITEM_HEIGHT, backgroundColor: isSelected ? '#5252e5' : 'transparent' , color: isDisabled ? '#ccc' : fontColor,
                cursor: isDisabled ? 'not-allowed' : 'pointer', }}
            onClick={onClick}
        >
            {formatted}
        </div>
    );

    const renderOptions = (list: string[], selected: string, setSelected: (v: string) => void) => {

        return (
            <>
                {Array.from({ length: PADDING_ITEMS }).map((_, i) => (
                    <div key={`pad-top-${i}`} className="wheel-item invisible" style={{ height: ITEM_HEIGHT }} />
                ))}
                {(minutess ? minutess : (timeFormat === '12h' ? hours12 : hours24))?.map((now) => {
                    const hour24 = timeFormat === '12h' ?
                        (state.selectAmPm === 'AM' ? now : now + 12) :
                        now;
                    const hour24M = parseInt(timeFormat === '12h' ?
                        (state.selectAmPm === 'AM' ? state.selectHour : String(parseInt(state.selectHour) + 12)) :
                        state.selectHour);
                    const formatted = String(now).padStart(2, '0');
                    const isSelected = formatted === (minutess ? state.selectMinute : state.selectHour);
                    const isDisabled = isTimeDisabled(
                        minutess?hour24M:hour24,
                        minutess?now:parseInt(state.selectMinute),
                        shouldDisableTime,
                    );
                    return (
                        <WheelItem
                            key={formatted} // أضف هذا السطر فقط
                            now={now}
                            formatted={formatted}
                            isSelected={isSelected}
                            isDisabled={isDisabled}
                            onClick={() => !isDisabled && handleTimeClick(minutess ? 'minute' : 'hour', formatted)}
                        />
                    );
                })}
                {Array.from({ length: PADDING_ITEMS }).map((_, i) => (
                    <div key={`pad-bottom-${i}`} className="wheel-item invisible" style={{ height: ITEM_HEIGHT }} />
                ))}
            </>
        );
    };

    return (
        <div className="flex gap-4">
            <div
                className="wheel-scroll"
                ref={hourRef}
                onScroll={() => handleScroll(hourRef, 'hour')}
                style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, overflowY: 'scroll' }}
            >
                {renderOptions(hours, selectedHour, setSelectedHour)}
            </div>
        </div>
    );
};

export default TimeWheel;