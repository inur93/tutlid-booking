import parse from "date-fns/parse";

const dateFormat = 'yyyy-MM-dd';
export function parseDate(str: string) {
    return parse(str, dateFormat, new Date());
}