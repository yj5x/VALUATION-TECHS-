export interface File {
  id: string;
  user_id: string;
  original_name: string;
  file_name: string;
  file_type: string;
  file_size: number;
  s3_key: string;
  upload_date: Date;
  processing_status: string;
  processing_error?: string;
}

export interface CreateFileData {
  user_id: string;
  original_name: string;
  file_name: string;
  file_type: string;
  file_size: number;
  s3_key: string;
}

