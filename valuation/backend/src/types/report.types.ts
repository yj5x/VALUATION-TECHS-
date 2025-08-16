export interface Report {
  id: string;
  file_id: string;
  user_id: string;
  report_number: number;
  analysis_results: any;
  compliance_score: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateReportData {
  file_id: string;
  user_id: string;
  report_number: number;
  analysis_results: any;
  compliance_score: number;
}

