import React, { FC, useReducer } from 'react';

import {StateContext, reducer, initialState} from '../state';
import FieldSelector from '../field-selector';

const App: FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{state, dispatch}}>
      <div className="row">
        <div className="col-lg-12">
          <FieldSelector OnFieldSet={options => console.log(options)} />
        </div>
      </div>
    </StateContext.Provider>
  );
};

export default App;
