import moment from "moment";
import {useEffect, useState} from "react";

const DATE_FORMAT = 'DD.MM.YYYY'

export const getLocalDate = (dateString) => {
    const fullString = moment(dateString, DATE_FORMAT).format('LL')

    return fullString.substring(0, fullString.length - 7)
}

export const today = () => {
    return moment().format(DATE_FORMAT)
}

export const useLongPress = (callback = () => {}, ms = 300) => {
    const [startLongPress, setStartLongPress] = useState(false);

    useEffect(() => {
        let timerId;
        if (startLongPress) {
            timerId = setTimeout(callback, ms);
        } else {
            clearTimeout(timerId);
        }

        return () => {
            clearTimeout(timerId);
        };
    }, [callback, ms, startLongPress]);

    return {
        onMouseDown: () => setStartLongPress(true),
        onMouseUp: () => setStartLongPress(false),
        onMouseLeave: () => setStartLongPress(false),
        onTouchStart: () => setStartLongPress(true),
        onTouchEnd: () => setStartLongPress(false),
    };
}


export function sumObjectsByKey(...objs) {
    return objs.reduce((a, b) => {
        for (let k in b) {
            if (b.hasOwnProperty(k))
                a[k] = (a[k] || 0) + b[k];
        }
        return a;
    }, {});
}
