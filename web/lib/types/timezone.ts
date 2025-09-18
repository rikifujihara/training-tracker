/**
 * Types for timezone-aware date filtering and API contracts
 */

export interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

export interface DateBoundaries {
  startUTC: Date;
  endUTC: Date;
}

export interface PartialDateBoundaries {
  startUTC: Date | null;
  endUTC: Date | null;
}

export interface FilterDateRanges {
  today: DateBoundaries;
  overdue: {
    startUTC?: Date;
    endUTC: Date;
  };
  upcoming: {
    startUTC: Date;
    endUTC?: Date;
  };
}

export type FilterType = 'today' | 'overdue' | 'upcoming' | 'all';