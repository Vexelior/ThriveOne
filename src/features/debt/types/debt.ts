export interface Debt {
    id: string;
    creditor: string;
    amount: number;
    remainingAmount: number;
    previousAmount: number;
    notes: string;
    dateAdded: string;
    dateEdited: string;
    percentageChange: number;
    type: string;
    image: string;
    imageId: string;
    imageSource: string;
    interestRate: number;
    lastPayment: number;
    lastPaymentDate: string;
    minimumPayment: number;
}