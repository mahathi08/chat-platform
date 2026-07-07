export interface Attachment {

    id: number;

    user_id: number;

    filename: string;

    stored_filename: string;

    file_path: string;

    mime_type: string;

    file_size: number;

    created_at: string;
}

export interface AttachmentListResponse {

    attachments: Attachment[];
}