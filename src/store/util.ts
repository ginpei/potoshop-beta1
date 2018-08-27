function camelToSnake (name: string): string {
  return name.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

export function autoActions (prefix: string, actions: any) {
  const names: string[] = actions.values || [];
  const result = names.reduce((obj: any, name: string) => {
    const actionName = `${prefix}/SET_${camelToSnake(name).toUpperCase()}`;
    obj[actionName] = (state: any, action: any) => {
      state[name] = action.value;
    };
    return obj;
  }, {});

  Object.entries(actions).forEach(([name, fn]) => {
    if (name === 'values') { return; }
    result[`${prefix}/${name}`] = fn;
  });

  return result;
}

export function autoMapStateToProps (state: any, path: string, names: string[]) {
  return names.reduce((obj, name) => {
    // nested path like "foo/bar" is not supported yet
    obj[name] = state[path][name];
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
