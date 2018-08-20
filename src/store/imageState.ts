import { createStore } from 'redux';
import { autoActions, buildReducer } from './util';

type IAction = any;

export interface IImageState {
  bordered: boolean;
  height: number;
  image?: HTMLImageElement,
  originalHeight: number;
  originalWidth: number;
  rotation: number;
  scale: number;
  type: string;
  width: number;
}

const initialImageState: IImageState = {
  bordered: false,
  height: 0,
  image: undefined,
  originalHeight: 0,
  originalWidth: 0,
  rotation: 0,
  scale: 1,
  type: '',
  width: 0,
};

const actions = Object.assign(autoActions([
  'bordered',
  'rotation',
  'type',
]), {
  SET_IMAGE: (state: IImageState, action: IAction) => {
    const image: HTMLImageElement = action.value;
    const width = image.naturalWidth;
    const height = image.naturalHeight;

    state.image = image;
    state.originalWidth = width;
    state.originalHeight = height;
    state.width = width;
    state.height = height;
    state.rotation = 0;
    state.scale = 1;
    console.log(state, width, height);
  },

  SET_SCALE: (state: IImageState, action: IAction) => {
    const scale = action.value;
    state.scale = scale;
    state.width = Math.floor(state.originalWidth * scale);
    state.height = Math.floor(state.originalHeight * scale);
  },
});
const reducer = buildReducer(initialImageState, actions);
const store = createStore(reducer);

export default store;
