export type Handler<InputType, ReturnType> = (args: InputType) => Promise<ReturnType | 'error'>
