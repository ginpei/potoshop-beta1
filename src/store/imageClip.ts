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
    state.diffLeft = v.diffLeft;
    state.diffTop = v.diffTop;
    state.dragging = true;
  },

  END_DRAGGING: (state: IImageClipState, action: IAction) => {
    const v = action.values;
    state.diffLeft = 0;
    state.diffTop = 0;
    state.dragging = false;
    state.left += v.diffLeft;
    state.top += v.diffTop;
  },
});
export default buildReducer(initialImageState, actions);
