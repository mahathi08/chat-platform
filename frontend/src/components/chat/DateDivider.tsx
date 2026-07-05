interface Props {
    date: string;
}

const DateDivider = ({ date }: Props) => {
    return (
        <div className="my-5 flex items-center">

            <div className="flex-1 border-t" />

            <span className="mx-3 text-xs text-gray-500">

                {date}

            </span>

            <div className="flex-1 border-t" />

        </div>
    );
};

export default DateDivider;