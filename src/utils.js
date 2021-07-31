import moment from "moment";

const DATE_FORMAT = 'DD.MM.YYYY'

export const getLocalDate = (dateString) => {
    const fullString = moment(dateString, DATE_FORMAT).format('LL')

    return fullString.substring(0, fullString.length - 7)
}

export const today = () => {
    return moment().format(DATE_FORMAT)
}
