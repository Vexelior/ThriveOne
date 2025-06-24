export interface WorkTask {
    id: string;
    title: string;
    description: string;
    completedAt: string;
    dueDate: string;
    priority: string;
    status: string;
    markdown: string;
    html: string;
    isCompleted: boolean;
    isDeleted: boolean;
}
