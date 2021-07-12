import React, { FC, useReducer } from 'react';

import {StateContext, reducer, initialState} from '../state';
import PageManager from '../page-manager/index';

const App: FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{state, dispatch}}>
      <div className="row">
        <div className="col-lg-12">
          <PageManager />
        </div>
      </div>
    </StateContext.Provider>
  );
};

export default App;
