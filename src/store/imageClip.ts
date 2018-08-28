import { autoActions, buildReducer } from './util';

interface IImageClipState {
  diffHeight: number;
  diffLeft: number;
  diffTop: number;
  diffWidth: number;
  dragging: boolean;
}

const initialImageState: IImageClipState = {
  diffHeight: 0,
  diffLeft: 0,
  diffTop: 0,
  diffWidth: 0,
  dragging: false,
};

const actions = autoActions('imageClip', {
  values: [
    'diffHeight',
    'diffLeft',
    'diffTop',
    'diffWidth',
    'dragging',
  ]
});
export default buildReducer(initialImageState, actions);
