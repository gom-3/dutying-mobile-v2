import { type Account } from './account';
import { type Shift } from './shift';

export type Moim = {
  moimId: number;
  moimName: string;
  isPublic: boolean;
  hostInfo: Pick<Account, 'accountId' | 'name' | 'profileImgBase64'>;
  moimCode: string;
  memberCount: number;
  memberInfoList: Pick<Account, 'accountId' | 'name' | 'profileImgBase64'>[];
};

export type Summary = {
  count: number;
  date: string;
  names: string[];
};

export type Collection = {
  targetAccountIds: number[];
  memberViews: (Pick<Account, 'accountId' | 'name' | 'profileImgBase64'> & {
    accountShiftTypes: (Pick<Shift, 'color' | 'name' | 'shortName'> & {
      date: string;
      startTime: string;
      endTime: string;
    })[];
  })[];
  summaryView: {
    day: Summary[];
    evening: Summary[];
    night: Summary[];
    off: Summary[];
  };
};
