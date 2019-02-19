export const convertMonthtoVal = name => {
    let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return month.indexOf(name)
}

export const datasets = [{
    text: 'LGA',
    path: 'lga'
}, {
    text: 'Sample Data',
    path: 'sample_data'
}, {
    text: 'Rural Combined',
    path: 'rural_combined'
}, {
    text: 'SCF Master',
    path: 'scf_master'
}]

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
}
    // , {
    //     text: 'Centroid',
    //     value: 'centroid',
    //     key: 'Centroid'
    // }
]

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

export const compulsory_element = ['Year', 'Month', 'Day_of_Week', 'Hour_of_Day', 'Centroid', 'Centroid Longitude', 'Centroid Latitude']

export const non_compulsory_element = ['Did not arrive within 15', 'Arrived at within 15', 'Total Cases']

export const statistics_array = ['Count', 'Arrived_at_C1', 'Did not arrive within 15', 'Arrived at within 15', 'Total Cases', 'Not_Arrived', 'Arrived_Under_15', 'Not Arrived', 'Over_15', 'Under_15', 'Grand Total']

export const calculateDistance = (start, end) => {
    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(end[1] - start[1]);  // deg2rad below
    var dLon = deg2rad(end[0] - start[0]);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(start[1])) * Math.cos(deg2rad(end[1])) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km

    if(d <= 300){
        return 20000
    }else if(d < 701 && d > 300){
        return 5000
        // return 5000
    }else{
        return 4000
    }
}