import dayjs from "dayjs";

export const years = Array.from({length: 2101 - 1900}, (_, i) => 1900 + i);
export const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const hours24 = Array.from({length: 24}, (_, i) => i);
export const hours12 = Array.from({length: 12}, (_, i) => i + 1);
export const minutes = Array.from({length: 60}, (_, i) => i);

export const currentMonth = dayjs().format('MMMM');
export const currentYear = dayjs().format('YYYY');