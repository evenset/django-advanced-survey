import React, { FC, useReducer } from 'react';

import {StateContext, reducer, initialState} from '../state';
import PageManager  from '../page-manager';
import Question from '../question';

const App: FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{state, dispatch}}>
      <div className="row">
        <div className="col-lg-12">
          <button onClick={() => dispatch({type: "addQuestion"})} className="btn btn-outline-primary my-2">
            + Add a new question to the active page
          </button>
          <PageManager />
          {state.pages[state.activePage - 1].map((question: any, index: number) => <Question key={question.id} question={question} index={index} />)}
        </div>
      </div>
    </StateContext.Provider>
  );
};

export default App;
