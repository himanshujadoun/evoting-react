// src/reducers/index.js
import { combineReducers } from 'redux';
import headerReducer from './headerReducer';

const rootReducer = combineReducers({
  Header: headerReducer,
});

export default rootReducer;
