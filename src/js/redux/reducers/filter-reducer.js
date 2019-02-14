import * as filterTypes from '../types/filter-types'

let initialState = {
    reload: {},
    maps: {
    },
    is_dual: false,
    calculations: {},
    colors: {},
    filter_options: {},
    color_picker: {},
    division: {},
    scale: {},
    filter_switch: {},
    color_equation_switch: {},
    size_switch: {},
    centroid_filters: {}
}

const FilterReducer = (state = initialState, action) => {
    switch (action.type) {
        case filterTypes.ADD_NEW_MAPS:
            let maps_key = [...Object.keys(state.maps), action.payload.title]
            let reload_obj = {}
            maps_key.map(list => reload_obj[list] = true)

            return Object.assign({}, state, {
                maps: {
                    [action.payload.title]: {
                        dataset: action.payload.dataset
                    },
                    ...state.maps
                },
                reload: reload_obj
            })

        case filterTypes.DELETE_LAYER:
            let refined_maps = state.maps
            delete refined_maps[action.payload]
            let refined_maps_key = [...Object.keys(refined_maps)]
            let refined_reload_obj = {}
            refined_maps_key.map(list => refined_reload_obj[list] = true)

            return Object.assign({}, state, {
                maps: refined_maps,
                reload: refined_reload_obj
            })

        case filterTypes.SWITCH_SCREEN:
            return Object.assign({}, state, {
                is_dual: action.payload
            })

        case filterTypes.SET_CENTROID_FILTER:
            return Object.assign({}, state, {
                centroid_filters: {
                    ...state.centroid_filters,
                    [action.key]: action.payload
                },
                reload: {
                    ...state.reload,
                    [action.key]: true
                }
            })

        case filterTypes.SWITCH_COLOR_EQUATION:
            return Object.assign({}, state, {
                color_equation_switch: {
                    ...state.color_equation_switch,
                    [action.key]: {
                        switch: action.payload,
                        target: action.target
                    }
                },
                reload: {
                    ...state.reload,
                    [action.key]: true
                }
            })

        case filterTypes.SWITCH_SIZE_EQUATION:
            return Object.assign({}, state, {
                size_switch: {
                    ...state.size_switch,
                    [action.key]: {
                        switch: action.payload,
                        target: action.target
                    }
                },
                reload: {
                    ...state.reload,
                    [action.key]: true
                }
            })

        case filterTypes.SWITCH_FILTERS:
            return Object.assign({}, state, {
                filter_switch: {
                    ...state.filter_switch,
                    [action.key]: {
                        switch: action.payload,
                        target: action.target
                    }
                },
                reload: {
                    ...state.reload,
                    [action.key]: true
                }
            })

        case filterTypes.SET_COLOR_EQUATION:
            return Object.assign({}, state, {
                colors: {
                    ...state.colors,
                    [action.key]: action.payload
                },
                reload: {
                    ...state.reload,
                    [action.key]: true
                }
            })

        case filterTypes.SET_CALCULATION:
            return Object.assign({}, state, {
                calculations: {
                    ...state.calculations,
                    [action.key]: action.payload
                },
                reload: {
                    ...state.reload,
                    [action.key]: true
                }
            })

        case filterTypes.SUBMIT_FILTER:
            return Object.assign({}, state, {
                filter_options: {
                    ...state.filter_options,
                    [action.key]: action.payload
                },
                reload: {
                    ...state.reload,
                    [action.key]: true
                }
            })

        case filterTypes.CHANGE_COLOR_PICKER:
            return Object.assign({}, state, {
                color_picker: {
                    ...state.color_picker,
                    [action.key]: action.payload
                },
                reload: {
                    ...state.reload,
                    [action.key]: true
                }
            })

        case filterTypes.SET_DIVISION:
            return Object.assign({}, state, {
                division: {
                    ...state.division,
                    [action.key]: action.payload
                },
                reload: {
                    ...state.reload,
                    [action.key]: true
                }
            })

        case filterTypes.SET_SCALE:
            return Object.assign({}, state, {
                scale: {
                    ...state.scale,
                    [action.key]: action.payload
                },
                reload: {
                    ...state.reload,
                    [action.key]: true
                }
            })

        case filterTypes.RESET_SETTINGS:
            return Object.assign({}, state, {
                reload: {
                    ...state.reload,
                    [action.key]: false
                }
            })

        default:
            return state
    }
}

export default FilterReducer