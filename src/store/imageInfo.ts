import { createStore } from 'redux';
import { autoActions, buildReducer } from './util';

type IAction = any;

export interface IImageState {
  bordered: boolean;
  height: number;
  originalHeight: number;
  originalWidth: number;
  scale: number;
  type: string;
  width: number;
}

const initialImageState: IImageState = {
  bordered: false,
  height: 0,
  originalHeight: 0,
  originalWidth: 0,
  scale: 1,
  type: '',
  width: 0,
};

const actions = Object.assign(autoActions([
  'bordered',
  'type',
]), {
  SET_ORIGINAL_SIZE: (state: IImageState, action: IAction) => {
    const { height, width } = action.value;
    state.originalWidth = width;
    state.originalHeight = height;
    state.width = width;
    state.height = height;
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
