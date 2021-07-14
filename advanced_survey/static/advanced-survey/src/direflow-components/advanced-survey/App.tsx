import React, { FC, useReducer } from 'react';

import {StateContext, reducer, initialState} from '../state';
import PageManager  from '../page-manager';
import Question from '../question';

const App: FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const page = [...state.pages[state.activePage - 1]];
  page.sort((a: any, b: any) => {
    if ( a.list_order < b.list_order ){
      return -1;
    }
    if ( a.list_order > b.list_order ){
      return 1;
    }
    return 0;  
  })

  return (
    <StateContext.Provider value={{state, dispatch}}>
      <div className="row">
        <div className="col-lg-12">
          <button onClick={() => dispatch({type: "addQuestion"})} className="btn btn-outline-primary my-2">
            + Add a new question to the active page
          </button>
          <PageManager />
          {page.map((question: any, index: number) => <Question index={index} />)}
        </div>
      </div>
    </StateContext.Provider>
  );
};

export default App;
