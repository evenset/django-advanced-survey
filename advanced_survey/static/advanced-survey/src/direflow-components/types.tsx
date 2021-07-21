export enum FieldType {
    LineEdit,
    TextArea,
    Select,
    Checkbox,
    Radiobox,
    Email,
    URL,
    Phone,
    Boolean,
    Numeric,
    File,
    Image,
    Date,
    Time,
    Rating,
}
export const FieldTypeNames: Record<FieldType, string> = {
    [FieldType.LineEdit]: 'Single Line Text',
    [FieldType.TextArea]: 'Multiline text',
    [FieldType.Select]: 'Select Dropdown',
    [FieldType.Checkbox]: 'Check Box',
    [FieldType.Radiobox]: 'Radio Button',
    [FieldType.Email]: 'Email',
    [FieldType.URL]: 'URL',
    [FieldType.Phone]: 'Phone Number',
    [FieldType.Boolean]: 'True or False',
    [FieldType.Numeric]: 'Number',
    [FieldType.File]: 'File Upload',
    [FieldType.Image]: 'Image Upload',
    [FieldType.Date]: 'Date',
    [FieldType.Time]: 'Time',
    [FieldType.Rating]: 'Rating',
}

export type QuestionOptions = {
    min?: number;
    max?: number;
    max_size?: number;
    step?: number;
    multiple?: boolean;
    items?: string[];
    url?: string;
    jsonpath?: string;
    type?: 'Star' | 'Table';
    choices?: string | undefined;
}

export type Question = {
    list_order: number;
    visibleIf: string[];
    requiredIf: string[];
    id: string;
    question: string;
    description: string;
    option: QuestionOptions;
    field: FieldType;
    delete?: boolean;
};