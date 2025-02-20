import axios from 'axios';

export default function DeleteMoa({ id, onDeleteSuccess }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this MOA?')) {
            axios.delete(`/moa/${id}`)
                .then(() => {
                    alert('MOA deleted successfully!');
                    if (onDeleteSuccess) onDeleteSuccess();
                })
                .catch((error) => {
                    console.error('Error deleting MOA:', error);
                    alert('Failed to delete MOA.');
                });
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
            Delete
        </button>
    );
}
