function camelToSnake (name: string): string {
  return name.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

export function autoActions (names: string[]) {
  return names.reduce((obj, name) => {
    const actionName = `SET_${camelToSnake(name).toUpperCase()}`;
    obj[actionName] = (state: any, action: any) => {
      state[name] = action.value;
    };
    return obj;
  }, {});
}

export function autoMapStateToProps (state: any, names: string[]) {
  return names.reduce((obj, name) => {
    obj[name] = state[name];
    return obj;
  }, {});
}



export function buildReducer (initialState: any, actions: any) {
  return (state: any = initialState, action: any) => {
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
}
