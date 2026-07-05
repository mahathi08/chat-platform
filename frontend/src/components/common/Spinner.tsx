import { Loader2 } from "lucide-react";

const Spinner = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2
                className="animate-spin"
                size={32}
            />
        </div>
    );
};

export default Spinner;