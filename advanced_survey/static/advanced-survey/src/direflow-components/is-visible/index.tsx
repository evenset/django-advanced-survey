import React, {useState, useCallback, ChangeEvent, useContext} from 'react';
import {StateContext} from '../state'
import { isNullOrUndefined } from 'util';
type Props = {
  questionId: string
}
const inline = {display: "inline"}
const VisibleSelector: React.FC<Props> = (props: Props) => {
  const questionId = props.questionId
  const {state, dispatch} = useContext(StateContext)
  const flatQuestions = state.pages.flat()
  let selectedQuestion: { visibleIf: any; list_order?: number; id?: string; title?: string; description?: string } | null = null
  const previousQuestions = []
  for (const otherQuestion of flatQuestions) {
    if (otherQuestion.id === questionId) {
      selectedQuestion = otherQuestion
      break
    }
    previousQuestions.push(otherQuestion)
  }
  if (!selectedQuestion) {
    throw 'NOPE'
  }
  const questionIdx = previousQuestions.length

  const update = (visibleIf: string[]) => dispatch({
    type: 'updateQuestion',
    payload: {
      id: questionIdx,
      question: {...selectedQuestion, visibleIf: visibleIf.filter(e => typeof e === 'string')}
    }
  })
  
  const [conditionType, otherQuestion, condition, value] = selectedQuestion.visibleIf
  const [updateConditionType, updateOtherQuestion, updateCondition, updateValue] = [
    useCallback((evt: any) => {
      if (evt.target.value === 'always') {
        update(['always'])
      } else {
        update([evt.target.value, otherQuestion, condition, value])
      }
    }, []),
    useCallback((evt: any) => update([conditionType, evt.target.value, condition, value]), []),
    useCallback((evt: any) => update([conditionType, otherQuestion, evt.target.value, value]), []),
    useCallback((evt: any) => update([conditionType, otherQuestion, condition, evt.target.value]), []),
  ]
  return (
    <span style={inline}>
      visible <select className="form-control" style={inline} value={conditionType} onChange={updateConditionType}>
          <option value="always">Always</option>
          <option value="if">If</option>
          <option value="unless">Unless</option>
      </select>
      {(conditionType !== 'always') && <select className="form-control" style={inline} value={conditionType}>
          {
            previousQuestions.map(q => <option key={q.id} value={q.id}>{q.title}</option>)
          }
      </select>}
      {/* previous question ? */}
      {/* is answered/is answered with ?*/}
      {/* option selection ?*/}
    </span>
  )

}
export default VisibleSelector;
