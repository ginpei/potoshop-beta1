import { combineReducers, createStore } from "redux";
import image from './image';

const rootReducer = combineReducers({
  image,
});

export default createStore(rootReducer);
