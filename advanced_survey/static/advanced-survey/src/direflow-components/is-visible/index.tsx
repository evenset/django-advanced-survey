import React, {useState, useCallback, ChangeEvent, useContext, useMemo} from 'react';
import {StateContext} from '../state'
type Props = {
  questionId: string
}
const inline = {display: "inline"}
const VisibleSelector: React.FC<Props> = (props: Props) => {
  const questionId = props.questionId
  const {state, dispatch} = useContext(StateContext)
  const flatQuestions = state.pages.flat()
  let selectedQuestion: { visibleIf: any; list_order?: number; id?: string; title?: string; description?: string } | null = null
  let selectedOtherQuestion: { visibleIf: any; list_order?: number; id?: string; title?: string; description?: string } | null = null
  const previousQuestions = []
  for (const question of flatQuestions) {
    if (question.id === questionId) {
      selectedQuestion = question
      break
    }
    previousQuestions.push(question)
  }
  if (!selectedQuestion) {
    throw 'NOPE'
  }
  const questionIdx = previousQuestions.length

  const update = (visibleIf: string[]) =>
    dispatch({
    type: 'updateQuestion',
    payload: {
      id: questionIdx,
      question: {...selectedQuestion, visibleIf: visibleIf.filter(e => typeof e === 'string')}
    }
  })
  
  const [conditionType, otherQuestionId, condition, value] = selectedQuestion.visibleIf
  const otherQuestion = previousQuestions.find(q => q.id === otherQuestionId) || null
  const [updateConditionType, updateOtherQuestion, updateCondition, updateValue] = [
    useCallback((evt: any) => {
      if (evt.target.value === 'always') {
        update(['always'])
      } else {
        update([evt.target.value, otherQuestionId, condition, value])
      }
    }, [otherQuestionId, condition, value]),
    useCallback(
      (evt: any) => update([conditionType, evt.target.value, condition || 'isAnswered', value]),
      [conditionType, condition, value]
    ),
    useCallback(
      (evt: any) => update([conditionType, otherQuestionId, evt.target.value, evt.target.value === 'isAnsweredWith' ? value : null]),
      [conditionType, otherQuestionId, value]
    ),
    useCallback(
      (evt: any) => update([conditionType, otherQuestionId, condition, evt.target.value]),
      [conditionType, otherQuestionId, condition]
    ),
  ]
  const otherQuestionChoices = otherQuestion?.option?.choices?.split('\n')
  return (
    <span>
      visible <select className="form-control" value={conditionType} onChange={updateConditionType}>
          <option value="always">Always</option>
          <option value="if">If</option>
          <option value="unless">Unless</option>
      </select>
      {(conditionType !== 'always') && <select className="form-control" value={otherQuestionId} onChange={updateOtherQuestion}>
          {!otherQuestionId && <option value="">Select a question...</option>}
          {
            previousQuestions.map(q => <option key={q.id} value={q.id}>{q.title}</option>)
          }
      </select>}
    {(!!otherQuestionId) &&  <select className="form-control" value={condition} onChange={updateCondition}>
        <option value="isAnswered">is answered</option>
        <option value="isAnsweredWith">is answered with</option>
    </select>}
    {condition === 'isAnsweredWith' && (otherQuestionChoices?.length ? (
      <select className="form-control" value={value} onChange={updateValue}>
          {!value && <option value="">Select a response...</option>}
          {otherQuestionChoices.map(choice => <option key={value} value={choice}>{choice}</option>)}
      </select>
    ) : <input className="form-control" value={value} onChange={updateValue} />)}
    </span>
  )

}
export default VisibleSelector;
