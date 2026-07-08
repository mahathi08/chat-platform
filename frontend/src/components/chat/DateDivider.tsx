interface Props {
    date: string;
}

const DateDivider = ({
    date,
}: Props) => {

    const messageDate = new Date(date);

    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let label = messageDate.toLocaleDateString(
        [],
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        }
    );

    if (
        messageDate.toDateString() ===
        today.toDateString()
    ) {

        label = "Today";

    } else if (
        messageDate.toDateString() ===
        yesterday.toDateString()
    ) {

        label = "Yesterday";

    }

    return (

        <div className="my-6 flex items-center px-6">

            <div className="h-px flex-1 bg-zinc-800" />

            <span
                className="
                    mx-4
                    rounded-full
                    border
                    border-zinc-700
                    bg-zinc-900
                    px-4
                    py-1
                    text-xs
                    font-medium
                    text-zinc-400
                "
            >
                {label}
            </span>

            <div className="h-px flex-1 bg-zinc-800" />

        </div>

    );

};

export default DateDivider;