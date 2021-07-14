import React, {useState, useCallback, ChangeEvent, useContext} from 'react';
import {StateContext} from '../state'
type Props = {
  questionId?: string;
  previousQuestionIds?: string;
}
const inline = {display: "inline"}
const VisibleSelector: React.FC<Props> = () => {
  const {state, dispatch} = useContext(StateContext)
  return (
    <span style={inline}>
      visible <select className="form-control" style={inline}>
          <option key="always">Always</option>
          <option key="if">If</option>
          <option key="unless">Unless</option>
      </select>
      {/* previous question ?*/}
      {/* is answered/is answered with ?*/}
      {/* option selection ?*/}
    </span>
  )

}
export default VisibleSelector;
