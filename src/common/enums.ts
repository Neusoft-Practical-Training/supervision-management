export enum Gender {
  Unknown = 0,
  Male = 1,
  Female = 2
}

export enum Role {
  Admin = 0,
  Supervisor = 1,
  GridMember = 2
}

export enum GridMemberState {
  Idle = 0,
  Working = 1,
  TemporaryTransfer = 2,
  InVacation = 3,
  AwaitingReview = 4,
  Other = 5
}

export enum AdminPermission {
  State = 0,
  Province = 1,
  City = 2
}

export enum AqiFeedbackState {
  Unassigned = 0,
  Assigned = 1,
  Completed = 2
}

export enum  TaskCompletedState {
  Uncompleted = 0,
  Completed = 1,
  CrossDomainRequesting = 2,
  CrossDomainRequestDenied = 3,
  CrossDomainRequestAccepted = 4,
  CrossDomainRequestCompleted = 5
}