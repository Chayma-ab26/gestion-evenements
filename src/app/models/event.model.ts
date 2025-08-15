export interface Event {
    Local?: any;
    Category?: any;
    id?: number;
    title: string;
    description: string;
    datedebut: string; // format: yyyy-MM-ddTHH:mm:ss
    datefin: string;
    status?: string;
    userId: number;
    categoryId: number;
    localId: number;
  }
