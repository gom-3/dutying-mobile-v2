import { type Nurse } from './nurse';

/* eslint-disable @typescript-eslint/no-unused-vars */
export type Ward = {
  /** 병동 id */
  wardId: number;
  /** 병동 이름 */
  name: string;
  /** 병원 이름 */
  hospitalName: string;
  /** 간호사 수 */
  nurseCnt: number;
  wardShiftTypes: WardShiftType[];
  shiftTeams: ShiftTeam[];
};

/** 근무 형태 타입 */
export type WardShiftType = {
  /** 근무 타입 id */
  wardShiftTypeId: number;
  /** 근무 형태의 이름이다. @example 데이 */
  name: string;
  /** 근무 형태의 약어이다. @example D */
  shortName: string;
  /** 근무 시작 시간 @example 07:00 */
  startTime: string;
  /** 근무 종료 시간 @example 15:00 */
  endTime: string;
  /** 근무 색상 */
  color: string;
  /** 기본 값 여부 (D,E,N,O 인지) */
  isDefault: boolean;
  /** 휴가 여부 */
  isOff: boolean;
  /** 합계에 포함할 것인지 */
  isCounted: boolean;
};

export type ShiftTeam = {
  shiftTeamId: number;
  name: string;
  nurseCnt: number;
  nurses: Nurse[];
};
