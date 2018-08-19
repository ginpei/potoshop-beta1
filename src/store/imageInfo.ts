import { createStore } from 'redux';

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

const actions = {
  SET_BORDERED: (state: IImageState, action: IAction) => {
    state.bordered = action.value;
  },

  SET_SCALE: (state: IImageState, action: IAction) => {
    state.scale = action.value;
  },
};

function reducer (state: IImageState = initialImageState, action: IAction) {
  const { type } = action;
  if (actions[type]) {
    const rv = Object.assign({}, state);
    actions[type](rv, action);
    return rv;
  }
  else if (type.startsWith('@@redux/')) {
    return state;
  }
  else {
    throw new Error(`Unknown action type: ${type}`);
  }
};

const store = createStore(reducer);

export default store;
