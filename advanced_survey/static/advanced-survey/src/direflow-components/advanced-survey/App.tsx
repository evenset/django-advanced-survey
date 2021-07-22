import React, { FC, useReducer, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import {StateContext, reducer, initialState} from '../state';
import PageManager  from '../page-manager';
import Question from '../question';

const App: FC = (props: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>('');

  const loadData = useCallback(() => {
    if (!props.id) return;
    setError('');
    setLoading(true);
    axios({
      method: 'GET',
      url: `${props.save_url}?id=${props.id}`
    }).then(({data}) => {
      dispatch({type: "setPages", payload: data})
    }).catch(err => {
      if (err?.response?.data?.data) {
        setSaveError(err.response.data.data)
      } else {
        setSaveError(err.message);
      }
    }).finally(() => {
      setLoading(false);
    })
  }, [props.id, props.save_url])

  useEffect(() => {
    loadData();
  }, [loadData])

  const saveQuestions = async() => {
    if (saveLoading) return;
    try {
      setSaveError('');
      setSaveLoading(true);
      const {data} = await axios({
        method: 'POST',
        // @ts-ignore
        headers: {'X-CSRFToken': document?.querySelector('[name=csrfmiddlewaretoken]')?.value},
        url: `${document.location.origin}${props.save_url}?id=${props.id}`,
        data: state.pages
      })
      dispatch({type: "setPages", payload: data})
      setSaveError('Saved successfully');
    } catch (err) {
      if (err?.response?.data?.data) {
        setSaveError(err.response.data.data)
      } else {
        setSaveError(err.message);
      }
    } finally {
      setSaveLoading(false);
    }
  }

  return (
    <StateContext.Provider value={{state, dispatch, props}}>
      {loading && <h4>Loading...</h4>}

      {!loading && error && <div className="alert alert-warning">{error} <button className="btn btn-sm btn-warning ml-2" onClick={() => loadData()}>Try Again</button></div>}

      {!loading && !error &&
        <div className="row">
          <div className="col-lg-12">

            <button onClick={() => dispatch({type: "addQuestion"})} className="btn btn-outline-primary my-2">
              + Add a new question to the active page
            </button>

            <PageManager />

            {state.pages[state.activePage - 1].map((question: any, index: number) => {
              if (question.delete) return null;
              return (<Question key={question.id} question={question} index={index} />);
            })}

            {saveError && 
              <div className="alert alert-warning alert-dismissible fade show my-1" role="alert">
                {saveError}
                <button onClick={e => setSaveError('')} type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            }

            <button className="btn btn-primary mb-2 mt-1" disabled={saveLoading} onClick={() => saveQuestions()}>{saveLoading ? 'Saving...' : 'Save Questions'}</button>

          </div>
        </div>
      }
    </StateContext.Provider>
  );
};

export default App;
