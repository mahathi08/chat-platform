import api from "./api";

export interface UploadResponse {
    url: string;
    filename: string;
    content_type: string;
    size: number;
}

class UploadService {
    async uploadAvatar(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post(
            "/attachments/avatar",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    }

    async uploadServerIcon(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post(
            "/attachments/server-icon",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    }

    async uploadMessageAttachment(
        file: File
    ): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post(
            "/attachments/message",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    }

    async uploadMultiple(
        files: File[]
    ): Promise<UploadResponse[]> {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files", file);
        });

        const response = await api.post(
            "/attachments/multiple",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    }

    async deleteFile(fileId: number) {
        const response = await api.delete(
            `/attachments/${fileId}`
        );

        return response.data;
    }
}

export default new UploadService();