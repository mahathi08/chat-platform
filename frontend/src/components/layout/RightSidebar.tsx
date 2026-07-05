const RightSidebar = () => {
    return (
        <aside className="hidden w-72 border-l border-gray-200 bg-white p-4 lg:block dark:border-gray-800 dark:bg-gray-950">

            <h2 className="mb-4 text-lg font-bold">
                Members
            </h2>

            <div className="space-y-3">

                <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">

                    Online members will appear here.

                </div>

            </div>

        </aside>
    );
};

export default RightSidebar;