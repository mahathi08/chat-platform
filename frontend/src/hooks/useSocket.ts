import { useSocket as useSocketContext } from "../contexts/SocketContext";

export default function useSocket() {
    return useSocketContext();
}