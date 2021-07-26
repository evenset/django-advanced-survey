import React, { useEffect, useCallback, useContext } from 'react';
import { StateContext } from '../state'

type Props = {
  questionIdx: number;
}
type InnerProps = Props & {
  requiredSelector: boolean;
}

const VisibleOrRequired: React.FC<InnerProps> = (props: InnerProps) => {
  const questionIdx = props.questionIdx
  const required = props.requiredSelector
  const questionProperty = required ? 'is_required' : 'is_visible'
  const { state, dispatch } = useContext(StateContext)
  const page = state.pages[state.activePage - 1]
  const previousQuestions: typeof page = []

  const selectedQuestion = page[questionIdx]
  // need to filter out deleted but they still affect the index
  for (const question of page) {
    if (question.id === selectedQuestion.id) {
      break
    }
    if (question.delete) continue
    previousQuestions.push(question)
  }
  if (!selectedQuestion || selectedQuestion.delete) {
    throw Error('Selected a nonexistent or deleted question')
  }

  const update = useCallback((externalConditions: (string | number | undefined)[]) => {
    return dispatch({
      type: 'updateQuestion',
      payload: {
        id: questionIdx,
        question: { ...selectedQuestion, [questionProperty]: externalConditions.filter(e => ['string', 'number'].includes(typeof e)) }
      }
    });
  }, [questionIdx, selectedQuestion, dispatch, questionProperty])

  const [conditionType, otherQuestionIdRaw, condition, value] = selectedQuestion[questionProperty] ? selectedQuestion[questionProperty] : [];
  const otherQuestion = previousQuestions.find(q => String(q.id) === String(otherQuestionIdRaw)) || null
  const otherQuestionId = otherQuestion?.id
  const [updateConditionType, updateOtherQuestion, updateCondition, updateValue] = [
    useCallback(
      (evt: { target: { value: string } }) => {
        if (evt.target.value === 'always') {
          update(['always'])
        } else {
          update([evt.target.value, otherQuestionId, condition, value])
        }
      }, [otherQuestionId, condition, value, update]
    ),
    useCallback(
      (evt: { target: { value: string } }) => update([conditionType, evt.target.value, condition || 'isAnswered', value]),
      [conditionType, condition, value, update]
    ),
    useCallback(
      (evt: { target: { value: string } }) => update([
        conditionType,
        otherQuestionId,
        evt.target.value,
        evt.target.value === 'isAnsweredWith' ? value : ''
      ]),
      [conditionType, otherQuestionId, value, update]
    ),
    useCallback(
      (evt: { target: { value: string } }) => update([conditionType, otherQuestionId, condition, evt.target.value]),
      [conditionType, otherQuestionId, condition, update]
    ),
  ]
  const otherQuestionFound = !!otherQuestion
  useEffect(() => {
    if (!otherQuestionIdRaw) return
    if (otherQuestionFound) return
    console.warn('Resetting the visible criteria as previous question no longer exists')
    update(['always'])
  }, [update, otherQuestionIdRaw, otherQuestionFound])

  const previousChoices = otherQuestion?.option?.items
  useEffect(() => {
    if (!value) return
    if (!previousChoices) return
    if (!previousChoices.length) return
    if (previousChoices.includes(String(value))) return
    console.warn('Resetting the response criteria as previous choice no longer exists')
    update([conditionType, otherQuestionId, condition])
  }, [
    update,
    conditionType,
    otherQuestionId,
    condition,
    value,
    previousChoices,
  ])

  return (
    <div className="row container align-items-center">
      {required ? 'Required' : 'Visible'}
      <div className="col-auto">
        <select className="form-control" value={conditionType} onChange={updateConditionType}>
          <option value="always">Always</option>
          {required ? <option value="never">Never</option> : null}
          <option value="if">If</option>
          <option value="unless">Unless</option>
        </select>
      </div>
      <div className="col-auto">
        {(!['always', 'never'].includes(String(conditionType))) && <select className="form-control" value={otherQuestionId} onChange={updateOtherQuestion}>
          {!otherQuestion && <option value="">Select a question...</option>}
          {
            previousQuestions.map(q => <option key={q.id} value={q.id}>{q.question}</option>)
          }
        </select>}
      </div>
      <div className="col-auto">
        {(!!otherQuestion) && <select className="form-control" value={condition} onChange={updateCondition}>
          <option value="isAnswered">is answered</option>
          <option value="isAnsweredWith">is answered with</option>
        </select>}
      </div>
      <div className="col-auto">
        {condition === 'isAnsweredWith' && (previousChoices?.length ? (
          <select className="form-control" value={value} onChange={updateValue}>
            {(!value || !previousChoices.includes(String(value))) && <option value={undefined}>Select a response...</option>}
            {previousChoices.map(choice => <option key={choice} value={choice}>{choice}</option>)}
          </select>
        ) : <input className="form-control" value={value} onChange={updateValue} />)}
      </div>
    </div>
  )
}

export const VisibleIf: React.FC<Props> = (props: Props) => <VisibleOrRequired {...props} requiredSelector={false} />
export const RequiredIf: React.FC<Props> = (props: Props) => <VisibleOrRequired {...props} requiredSelector={true} />
