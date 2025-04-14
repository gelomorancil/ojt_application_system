import { useEffect } from "react";

 export default function MoaForm({ compId, data, setData, handleSubmit, editingMoa, resetForm, errors }) {
     // Ensure the company ID is set correctly when editing
     useEffect(() => {
         if (editingMoa) {
             setData("Comp_ID", compId);
         }
     }, [editingMoa, compId, setData]);

     const handleFileChange = (e) => {
         const file = e.target.files[0];
         if (file && file.type !== "application/pdf") {
             alert("Only PDF files are allowed!");
             e.target.value = ""; // Reset the input
         } else {
             setData("file", file);
         }
     };

     return (
         <div className="bg-white p-6 shadow-sm sm:rounded-lg w-full max-w-md m-4">
             <h3 className="mb-4 text-lg font-semibold">
                 {editingMoa ? "Edit MOA" : "Upload MOA"}
             </h3>
             <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid grid-cols-1 gap-4">
                 {/* File Upload */}
                 <input
                     type="file"
                     accept="application/pdf"
                     onChange={handleFileChange}
                     className="border p-2 rounded"
                     required={!editingMoa}
                 />
                 {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}

                 {/* Start Date */}
                 <input
                     type="date"
                     value={data.start || ""}
                     onChange={(e) => setData("start", e.target.value)}
                     className="border p-2 rounded"
                     required
                 />
                 {errors.start && <p className="text-red-500 text-sm">{errors.start}</p>}

                 {/* End Date */}
                 <input
                     type="date"
                     value={data.end || ""}
                     onChange={(e) => setData("end", e.target.value)}
                     className="border p-2 rounded"
                     required
                 />
                 {errors.end && <p className="text-red-500 text-sm">{errors.end}</p>}

                 {/* Submit Button */}
                 <button
                     type="submit"
                     className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                     disabled={data.processing}
                 >
                     {editingMoa ? "Update MOA" : "Upload MOA"}
                 </button>

                 {/* Cancel Button (for editing) */}
                 {editingMoa && (
                     <button
                         type="button"
                         onClick={resetForm}
                         className="w-full bg-gray-500 text-white py-2 rounded mt-2 hover:bg-gray-700"
                     >
                         Cancel Edit
                     </button>
                 )}
             </form>
         </div>
     );
 }
