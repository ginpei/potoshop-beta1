import { createStore } from 'redux';
import { autoActions, buildReducer } from './util';

type IAction = any;

export interface IImageState {
  bordered: boolean;
  flipH: boolean;
  flipV: boolean;
  height: number;
  image: HTMLImageElement | null;
  originalHeight: number;
  originalWidth: number;
  rotation: number;
  scale: number;
  type: string;
  width: number;
}

const initialImageState: IImageState = {
  bordered: false,
  flipH: false,
  flipV: false,
  height: 0,
  image: null,
  originalHeight: 0,
  originalWidth: 0,
  rotation: 0,
  scale: 1,
  type: '',
  width: 0,
};

export function defaultState (preferences: Partial<IImageState>): IImageState {
  return Object.entries(preferences).reduce((obj, [key, value]) => {
    if (value !== undefined) {
      obj[key] = value;
    }
    return obj;
  }, Object.assign({}, initialImageState));
}

const actions = Object.assign(autoActions([
  'bordered',
  'flipH',
  'flipV',
  'rotation',
  'type',
]), {
  SET_IMAGE: (state: IImageState, action: IAction) => {
    const image: HTMLImageElement | null = action.value;
    const width = image ? image.naturalWidth : 0;
    const height = image ? image.naturalHeight : 0;

    state.image = image;
    state.originalWidth = width;
    state.originalHeight = height;
    state.width = width;
    state.height = height;
    state.rotation = 0;
    state.scale = 1;
    state.flipH = false;
    state.flipV = false;
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
