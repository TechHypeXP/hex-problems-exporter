export interface ProblemLocation {
  line: number;
  column: number;
}

export interface RelatedProblemInfo {
  location: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
  message: string;
  filename: string;
}

export interface ProblemRecord {
  filename: string;
  type: 'error' | 'warning' | 'info';
  code: string;
  location: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
  message: string;
  source: string;
  severity: number;
  relatedInfo: RelatedProblemInfo[];
}

export interface GroupedProblems {
  [key: string]: ProblemRecord[];
}

export interface ProblemGroups {
  byType: GroupedProblems;
  bySource: GroupedProblems;
  byCode: GroupedProblems;
}
