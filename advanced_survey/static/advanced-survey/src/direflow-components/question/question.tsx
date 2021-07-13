import React, {useState, useCallback} from 'react';
import './question.css';

type Props = {
  title?: string
  description?: string
  placeholder?: string
  ordinal: number
}
const Question: React.FC<Props> = (props: Props) => {
  const [title, setTitle] = useState<string>(props.title || '')
  const [description, setDescription] = useState<string>(props.description || '');
  const [questionType, setQuestionType] = useState<string>('LineEdit')

  const handleTitleChange = useCallback(((evt: React.ChangeEvent<HTMLInputElement>) => setTitle(evt.target.value)), [])
  const handleDescChange = useCallback(((evt: React.ChangeEvent<HTMLInputElement>) => setDescription(evt.target.value)), [])
  const handleTypeChange = useCallback(((evt: React.ChangeEvent<HTMLInputElement>) => setQuestionType(evt.target.value)), [])

  const placeholder = props.placeholder || 'Description...'
  const ordinal = props.ordinal ? `${props.ordinal}.` : ''
  return (
    <div className="card">
      <div className="question-name">
        {ordinal && <span className="ordinal">{ordinal}</span>}
        <input type="text" placeholder="Question name..." onChange={handleTitleChange} value={title}/>
      </div>
      <div className="question-description">
        <textarea placeholder={placeholder} rows={1} value={description} onChange={handleDescChange}/>
        <select onChange={handleTypeChange} value={questionType}>
          <option value="LineEdit">Line Edit</option>
          <option value="TextArea">Text Area</option>
          <option value="Select">Select</option>
          <option value="Checkbox">Checkbox</option>
          <option value="Radiobox">Radiobox</option>
          <option value="Email">Email</option>
          <option value="URL">URL</option>
          <option value="Phone">Phone</option>
          <option value="Boolean">Boolean</option>
          <option value="Numeric">Numeric</option>
          <option value="File">File</option>
          <option value="Image">Image</option>
          <option value="Date">Date</option>
          <option value="Time">Time</option>
          <option value="Rating">Rating</option>
        </select>
      </div>
    </div>
  )

}
export default Question;
