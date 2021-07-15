import React, {useEffect, useCallback, useContext} from 'react';
import {StateContext} from '../state'
type Props = {
  questionId: string;
}
const VisibleSelector: React.FC<Props> = (props: Props) => {
  const questionId = props.questionId
  const {state, dispatch} = useContext(StateContext)
  const flatQuestions = state.pages.flat()
  const previousQuestions: typeof flatQuestions = []
  let selectedQuestion: null | typeof previousQuestions[0] = null
  for (const question of flatQuestions) {
    if (question.id === questionId) {
      selectedQuestion = question
      break
    }
    previousQuestions.push(question)
  }
  if (!selectedQuestion) {
    throw Error('Selected a nonexistent question')
  }

  const questionIdx = previousQuestions.length

  const update = useCallback((visibleIf: string[]) =>
    {
      return dispatch({
        type: 'updateQuestion',
        payload: {
          id: questionIdx,
          question: { ...selectedQuestion, visibleIf: visibleIf.filter(e => typeof e === 'string') }
        }
      });
    }, [questionIdx, selectedQuestion])
  
  const [conditionType, otherQuestionId, condition, value] = selectedQuestion.visibleIf
  const otherQuestion = previousQuestions.find(q => q.id === otherQuestionId) || null
  const [updateConditionType, updateOtherQuestion, updateCondition, updateValue] = [
    useCallback(
      (evt: {target: {value: string}}) => {
        if (evt.target.value === 'always') {
          update(['always'])
        } else {
          update([evt.target.value, otherQuestionId, condition, value])
        }
      }, [otherQuestionId, condition, value, update]
    ),
    useCallback(
      (evt: {target: {value: string}}) => update([conditionType, evt.target.value, condition || 'isAnswered', value]),
      [conditionType, condition, value, update]
    ),
    useCallback(
      (evt: {target: {value: string}}) => update([
        conditionType,
        otherQuestionId,
        evt.target.value,
        evt.target.value === 'isAnsweredWith' ? value : ''
      ]),
      [conditionType, otherQuestionId, value, update]
    ),
    useCallback(
      (evt: {target: {value: string}}) => update([conditionType, otherQuestionId, condition, evt.target.value]),
      [conditionType, otherQuestionId, condition, update]
    ),
  ]

  useEffect(() => {
    if (!otherQuestionId) return
    if (previousQuestions.find(({id}) => id === otherQuestionId)) return
    console.warn('Resetting the visible criteria as previous question no longer exists')
    update(['always'])
  }, [update, otherQuestionId, !!previousQuestions.find(({id}) => id === otherQuestionId)])

  useEffect(() => {
    if (!value) return
    const choices = previousQuestions.find(({id}) => id === otherQuestionId)?.option?.choices?.split('\n')?.filter(truthy => truthy) || [] 
    if (!choices.length) return
    if (choices.includes(value)) return
    console.warn('Resetting the response criteria as previous choice no longer exists')
    update([conditionType, otherQuestionId, condition])
  }, [
    update,
    conditionType,
    otherQuestionId,
    condition,
    value,
    previousQuestions.find(({id}) => id === otherQuestionId)?.option?.choices
  ])

  const otherQuestionChoices = otherQuestion?.option?.choices?.split('\n')?.filter(truthy => truthy)
  return (
    <div className="row container align-items-center">
      Visible
      <div className="col-auto">
        <select className="form-control" value={conditionType} onChange={updateConditionType}>
            <option value="always">Always</option>
            <option value="if">If</option>
            <option value="unless">Unless</option>
        </select>
      </div>
      <div className="col-auto">
        {(conditionType !== 'always') && <select className="form-control" value={otherQuestionId} onChange={updateOtherQuestion}>
            {!otherQuestionId && <option value="">Select a question...</option>}
            {
              previousQuestions.map(q => <option key={q.id} value={q.id}>{q.question}</option>)
            }
        </select>}
      </div>
      <div className="col-auto">
        {(!!otherQuestionId) &&  <select className="form-control" value={condition} onChange={updateCondition}>
            <option value="isAnswered">is answered</option>
            <option value="isAnsweredWith">is answered with</option>
        </select>}
      </div>
      <div className="col-auto">
        {condition === 'isAnsweredWith' && (otherQuestionChoices?.length ? (
          <select className="form-control" value={value} onChange={updateValue}>
              {(!value || !otherQuestionChoices.includes(value)) && <option value={undefined}>Select a response...</option>}
              {otherQuestionChoices.map(choice => <option key={choice} value={choice}>{choice}</option>)}
          </select>
        ) : <input className="form-control" value={value} onChange={updateValue} />)}
      </div>
    </div>
  )

}
export default VisibleSelector;
