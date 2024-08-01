export class DataModel {
  _id: string;
  status: DataStatus;
  createdAt: number;
  updatedAt?: number;
}

export enum DataStatus {
  NONE = 0,
  DRAFT = 1,
  ENABLED = 2,
  DISABLED = 3,
  ARCHIVED = 4,
  BLOCKED = 5,
  OBSOLETE = 6,
  ERROR = 99,
}
