import { combineReducers, createStore } from 'redux';
import image from './image';
import imageClip from './imageClip';

const rootReducer = combineReducers({
  image,
  imageClip,
});

export default createStore(rootReducer);
