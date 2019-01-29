import { combineReducers } from 'redux'
import FilterReducer from './filter-reducer'

const Reducers = combineReducers({
    filters: FilterReducer
})

export default Reducers