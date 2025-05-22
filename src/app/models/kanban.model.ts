export type KanbanTaskModel = {
  id: number;
  status: KanbanTaskStatusesEnum;
  title: string;
  description: string;
};

export enum KanbanTaskStatusesEnum {
  Start = 'Start',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Expired = 'Expired',
};

export enum KanbanColumnColorsByStatusEnum {
  Start = '#4FC1E9',
  InProgress = '#FFCE58',
  Completed = '#A0D665',
  Expired = '#ED5565',
};

export type KanbanTasksByColumns = Record<KanbanTaskStatusesEnum, Array<KanbanTaskModel>>;