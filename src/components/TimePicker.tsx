import dayjs from "dayjs";
import React from "react";
import TimeWheel from "@/components/TimeWheel.tsx";

interface TimePickerProps {
    showTimePicker: boolean;
    openTime: boolean;
    setOpenTime: (open: boolean) => void;
    fontColor: string;
    timeFormat: '12h' | '24h';
    state: {
        currentTime: string;
        selectHour: string;
        selectMinute: string;
        selectAmPm?: string;
    };
    hours12: number[];
    hours24: number[];
    minutes: number[];
    handleTimeClick: (type: 'hour' | 'minute' | 'ampm', value: string) => void;
    shouldDisableTime?: (time: { hour: number; minute: number }) => boolean,
}

const TimePicker: React.FC<TimePickerProps> = ({
                                                   shouldDisableTime,
                                                   showTimePicker,
                                                   openTime,
                                                   setOpenTime,
                                                   fontColor,
                                                   timeFormat,
                                                   state,
                                                   hours12,
                                                   hours24,
                                                   minutes,
                                                   handleTimeClick
                                               }) => {
    if (!showTimePicker) return null;

    return (
        <div className="timePickerContainer">
            <div className={'timePicker'}>
                <div
                    className={'timeCont'}
                    style={{
                        backgroundColor: openTime ? '#818181' : 'transparent'
                    }}
                    onClick={() => setOpenTime(!openTime)}
                >
          <span style={{color: fontColor}}>
            {timeFormat === '12h'
                ? dayjs(`2000-01-01 ${state.currentTime}`).format('hh:mm A')
                : state.currentTime}
          </span>
                </div>
            </div>

            {openTime && (
                <div className={'conWheel'}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        <p style={{color: fontColor, marginBottom: '5px'}}>Hour</p>
                        <TimeWheel
                            shouldDisableTime={shouldDisableTime}
                            fontColor={fontColor}
                            timeFormat={timeFormat}
                            hours12={hours12}
                            hours24={hours24}
                            state={state}
                            handleTimeClick={handleTimeClick}
                        />
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        <p style={{color: fontColor, marginBottom: '5px'}}>Minute</p>
                        <TimeWheel
                            shouldDisableTime={shouldDisableTime}
                            fontColor={fontColor}
                            timeFormat={timeFormat}
                            minutess={minutes}
                            state={state}
                            handleTimeClick={handleTimeClick}
                        />
                    </div>

                    {timeFormat === '12h' && (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            <p style={{color: fontColor, marginBottom: '5px'}}>AM/PM</p>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '2px'
                            }}>
                                {['AM', 'PM'].map((ap) => {
                                    const isSelected = ap === state.selectAmPm;
                                    return (
                                        <span
                                            key={`ampm-${ap}`}
                                            style={{
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                backgroundColor: isSelected ? '#5252e5' : 'transparent',
                                                color: fontColor,
                                                cursor: 'pointer',
                                                minWidth: '40px',
                                                textAlign: 'center'
                                            }}
                                            onClick={() => handleTimeClick('ampm', ap)}
                                        >
                      {ap}
                    </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TimePicker;