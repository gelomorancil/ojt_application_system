export default function MoaList({ moa_list = [] }) {
    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg overflow-x-auto min-h-full">
            <h3 className="mb-4 text-lg font-semibold">MOA Files</h3>
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">File Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Start Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">End Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {moa_list.length > 0 ? (
                        moa_list.map((moa, index) => (
                            <tr key={moa.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4">{index + 1}</td>
                                <td className="px-4 py-4">{moa.File_name}</td>
                                <td className="px-4 py-4">{moa.Start}</td>
                                <td className="px-4 py-4">{moa.End}</td>
                                <td className="px-4 py-4 flex space-x-4">
                                    <a href={`/storage/${moa.File}`} target="_blank" className="text-blue-500 hover:underline">
                                        View
                                    </a>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                                No MOA files available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
