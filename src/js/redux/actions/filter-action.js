import * as filterTypes from '../types/filter-types'

export const switchScreen = value => ({
    type: filterTypes.SWITCH_SCREEN,
    payload: value
})

export const submitFilter = (data, key) => ({
    type: filterTypes.SUBMIT_FILTER,
    payload: data,
    key: key
})

export const changeColorPicker = color => ({
    type: filterTypes.CHANGE_COLOR_PICKER,
    payload: color
})

export const setDivision = (value, key) => ({
    type: filterTypes.SET_DIVISION,
    payload: value,
    key: key
})

export const modifyScale = (key, value) => ({
    type: filterTypes.SET_SCALE,
    payload: value,
    key: key
})

export const setCalculation = (key, value) => ({
    type: filterTypes.SET_CALCULATION,
    payload: value,
    key: key
})

export const setColorEquation = (key, value) => ({
    type: filterTypes.SET_COLOR_EQUATION,
    payload: value,
    key: key
})

export const switchFilters = (key, value, target) => ({
    type: filterTypes.SWITCH_FILTERS,
    payload: value,
    key: key,
    target: target
})

export const switchColorEquation = (key, value, target) => ({
    type: filterTypes.SWITCH_COLOR_EQUATION,
    payload: value,
    key: key,
    target: target
})

export const switchSizeEquation = (key, value, target) => ({
    type: filterTypes.SWITCH_SIZE_EQUATION,
    payload: value,
    key: key,
    target: target
})