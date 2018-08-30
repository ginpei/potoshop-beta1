import { autoActions, buildReducer } from './util';

export interface IImageClipState {
  diffHeight: number;
  diffLeft: number;
  diffTop: number;
  diffWidth: number;
  dragging: boolean;
  height: number;
  left: number;
  top: number;
  width: number;
}
type IAction = any;

const initialImageState: IImageClipState = {
  diffHeight: 0,
  diffLeft: 0,
  diffTop: 0,
  diffWidth: 0,
  dragging: false,
  height: 0,
  left: 0,
  top: 0,
  width: 0,
};

const actions = autoActions('imageClip', {
  values: [
    'diffHeight',
    'diffLeft',
    'diffTop',
    'diffWidth',
    'dragging',
  ],

  CLEAR: (state: IImageClipState, action: IAction) => {
    state.diffHeight = 0;
    state.diffLeft = 0;
    state.diffTop = 0;
    state.diffWidth = 0;
    state.dragging = false;
    state.height = action.value.height / 2;
    state.left = 0;
    state.top = 0;
    state.width = action.value.width / 2;
  },

  DRAG: (state: IImageClipState, action: IAction) => {
    const v = action.values;
    state.diffLeft = calculatePossibleLeft(state, v) - state.left;
    state.diffTop = calculatePossibleTop(state, v) - state.top;
    state.dragging = true;
  },

  END_DRAGGING: (state: IImageClipState, action: IAction) => {
    const v = action.values;
    state.diffLeft = 0;
    state.diffTop = 0;
    state.dragging = false;
    state.left = calculatePossibleLeft(state, v);
    state.top = calculatePossibleTop(state, v);
  },
});
export default buildReducer(initialImageState, actions);

function calculatePossibleLeft (state: IImageClipState, v: any): number {
  const max = v.imageWidth - state.width;
  const min = 0;
  const value = state.left + v.diffLeft;
  return Math.min(Math.max(min, value), max);
}

function calculatePossibleTop (state: IImageClipState, v: any): number {
  const max = v.imageHeight - state.height;
  const min = 0;
  const value = state.top + v.diffTop;
  return Math.min(Math.max(min, value), max);
}
