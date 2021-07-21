export enum FieldType {
    LineEdit = 'LineEdit',
    TextArea = 'TextArea',
    Select = 'Select',
    Checkbox = 'Checkbox',
    Radiobox = 'Radiobox',
    Email = 'Email',
    URL = 'URL',
    Phone = 'Phone',
    Boolean = 'Boolean',
    Numeric = 'Numeric',
    File = 'File',
    Image = 'Image',
    Date = 'Date',
    Time = 'Time',
    Rating = 'Rating',
}
export const FieldTypeNames: Record<FieldType, string> = {
    [FieldType.LineEdit]: 'Single Line Text',
    [FieldType.TextArea]: 'Multiline Text',
    [FieldType.Select]: 'Select Dropdown',
    [FieldType.Checkbox]: 'Check Box',
    [FieldType.Radiobox]: 'Multiple Choice',
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