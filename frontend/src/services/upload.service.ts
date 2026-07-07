import api from "./api";

class UploadService {

    async upload(
        file: File,
    ) {

        const formData =
            new FormData();

        formData.append(
            "file",
            file,
        );

        const response =
            await api.post(
                "/attachments",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

        return response.data;

    }

    async getAttachments() {

        const response =
            await api.get(
                "/attachments"
            );

        return response.data;

    }

    async getAttachment(
        attachmentId: number,
    ) {

        const response =
            await api.get(
                `/attachments/${attachmentId}`
            );

        return response.data;

    }

    async deleteAttachment(
        attachmentId: number,
    ) {

        await api.delete(
            `/attachments/${attachmentId}`
        );

    }

}

export default new UploadService();