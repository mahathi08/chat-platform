import api from "./api";

export interface Invite {
    id: number;

    server_id: number;

    creator_id?: number;

    code: string;

    status: "ACTIVE" | "EXPIRED" | "REVOKED";

    max_uses: number;

    uses: number;

    expires_at?: string | null;

    created_at: string;

    server?: {
        id: number;
        name: string;
        description?: string;
        icon_url?: string;
    };
}

class InviteService {

    async createInvite(
        serverId: number,
        maxUses = 0,
        expiresAt?: string,
    ) {

        const response = await api.post<Invite>(
            `/invites/servers/${serverId}`,
            {
                max_uses: maxUses,
                expires_at: expiresAt,
            }
        );

        return response.data;
    }

    async getInvite(
        code: string,
    ) {

        const response = await api.get<Invite>(
            `/invites/${code}`
        );

        return response.data;
    }

    async joinInvite(
        code: string,
    ) {

        const response = await api.post(
            `/invites/${code}/join`
        );

        return response.data;
    }

    async revokeInvite(
        code: string,
    ) {

        await api.delete(
            `/invites/${code}`
        );

    }

    async getServerInvites(
        serverId: number,
    ) {

        const response = await api.get(
            `/invites/servers/${serverId}`
        );

        return response.data;

    }

}

export default new InviteService();