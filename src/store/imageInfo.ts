import { createStore } from 'redux';
import { autoActions, buildReducer } from './util';

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

const actions = autoActions([
  'bordered',
  'height',
  'originalHeight',
  'originalWidth',
  'scale',
  'type',
  'width',
]);
const reducer = buildReducer(initialImageState, actions);
const store = createStore(reducer);

export default store;
