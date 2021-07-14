import React, {useState, useCallback, useContext} from 'react';

import { StateContext } from '../state';
import FieldSelector from '../field-selector';

type Props = {
  index: number
}

const Question: React.FC<Props> = (props: Props) => {
  const {state, dispatch} = useContext(StateContext);
  const question: any = state.pages[state.activePage - 1][props.index];

  return (
    <div
      className="card my-2 bg-light"
      draggable={true}
      onDragStart={e => {
        dispatch({type: "dragStart", payload: props.index})
      }}
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault();
        dispatch({type: 'dropEnd', payload: props.index});
      }}
    >
      <div className="card-header card-header d-flex align-items-center justify-content-around">
        Question {props.index + 1}
        <button 
          className="btn btn-sm btn-outline-danger"
          title="double click to delete"
          onDoubleClick={() => dispatch({type: "deleteQuestion", payload: props.index})}
        >
          Delete
        </button>
      </div>
      <div className="card-body">
        <div className="form-group">
          <label>Question:</label>
          <textarea className="form-control" onChange={e => question.question = e.target.value} value={question.question}></textarea>
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea className="form-control" onChange={e => question.description = e.target.value} value={question.description}></textarea>
        </div>
        <FieldSelector field={question.type} option={question.option} OnFieldSet={({fieldtype, options}) => {
          question.type = fieldtype;
          question.option = options;
        }}></FieldSelector>
      </div>
    </div>
  )
}
export default Question;
