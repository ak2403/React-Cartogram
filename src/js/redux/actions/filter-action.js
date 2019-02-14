import * as filterTypes from '../types/filter-types'

export const addMaps = value => ({
    type: filterTypes.ADD_NEW_MAPS,
    payload: value
})

export const switchScreen = value => ({
    type: filterTypes.SWITCH_SCREEN,
    payload: value
})

export const submitFilter = (data, key) => ({
    type: filterTypes.SUBMIT_FILTER,
    payload: data,
    key: key
})

export const changeColorPicker = (key, value) => ({
    type: filterTypes.CHANGE_COLOR_PICKER,
    payload: value,
    key: key
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

export const setCentroidFilter = (key, value) => ({
    type: filterTypes.SET_CENTROID_FILTER,
    payload: value,
    key: key
})

export const deleteLayer = key => ({
    type: filterTypes.DELETE_LAYER,
    payload: key
})

export const resetSettings = key => ({
    type: filterTypes.RESET_SETTINGS,
    key: key
})