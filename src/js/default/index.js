export const convertMonthtoVal = name => {
    let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return month.indexOf(name)
}

export const filter_options = [{
    text: 'Year',
    value: 'year',
    key: 'Year'
}, {
    text: 'Month',
    value: 'month',
    key: 'Month'
}, {
    text: 'Date',
    value: 'date',
    key: 'Day_of_Week'
}, {
    text: 'Centroid',
    value: 'centroid',
    key: 'Centroid'
}]

export const month_options = [{
    text: 'January',
    value: 'January'
}, {
    text: 'February',
    value: 'February'
}, {
    text: 'March',
    value: 'March'
}, {
    text: 'April',
    value: 'April'
}, {
    text: 'May',
    value: 'May'
}, {
    text: 'June',
    value: 'June'
}, {
    text: 'July',
    value: 'July'
}, {
    text: 'August',
    value: 'August'
}, {
    text: 'September',
    value: 'September'
}, {
    text: 'October',
    value: 'October'
}, {
    text: 'November',
    value: 'November'
}, {
    text: 'December',
    value: 'December'
}]

export const compulsory_element = ['Year','Month','Day_of_Week','Hour_of_Day','Centroid','Centroid Longitude','Centroid Latitude']

export const non_compulsory_element = ['Did not arrive within 15', 'Arrived at within 15', 'Total Cases']