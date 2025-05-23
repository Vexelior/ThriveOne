export interface Todo {
    id: string;
    title: string;
    description: string;
    created: string | null;
    completed: string | null;
    due: string | null;
    isCompleted: boolean;
}
