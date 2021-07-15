import React, {useContext} from 'react';

import { StateContext } from '../state';
import FieldSelector from '../field-selector';
import IsVisible from '../is-visible';

type Props = {
  index: number;
  question: any;
}

const Question: React.FC<Props> = ({index, question}) => {
  const {dispatch} = useContext(StateContext);

  return (
    <div
      className="card my-2 bg-light"
      draggable={true}
      onDragStart={() => dispatch({type: "dragStart", payload: index})}
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault();
        dispatch({type: 'dropEnd', payload: index});
      }}
    >
      <div className="card-header card-header d-flex align-items-center justify-content-around">
        Question {index + 1}
        <button 
          className="btn btn-sm btn-outline-danger"
          title="double click to delete"
          onDoubleClick={() => dispatch({type: "deleteQuestion", payload: index})}
        >
          Delete
        </button>
      </div>
      <div className="card-body">
        <div className="form-group mb-2">
          <label>Question:</label>
          <textarea className="form-control" onChange={e => {
            dispatch({type: 'updateQuestion', payload: {
              id: index,
              question: {...question, question: e.target.value}
            }})
          }}>{question.question}</textarea>
        </div>
        <div className="form-group mb-2">
          <label>Description:</label>
          <textarea className="form-control" onChange={e => {
            dispatch({type: 'updateQuestion', payload: {
              id: index,
              question: {...question, description: e.target.value}
            }})
          }}>{question.description}</textarea>
        </div>
        <FieldSelector key={question.id} question={question} index={index} />
        <IsVisible questionId={question.id} />
      </div>
    </div>
  )
}
export default Question;
