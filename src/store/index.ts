import { combineReducers, createStore } from 'redux';
import image, { IImageState } from './image';
import imageClip, { IImageClipState } from './imageClip';

export interface IStore {
  image: IImageState;
  imageClip: IImageClipState;
}

const rootReducer = combineReducers({
  image,
  imageClip,
});

export default createStore(rootReducer);
