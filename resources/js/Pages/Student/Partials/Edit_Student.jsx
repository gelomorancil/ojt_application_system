import React from "react";
import Student from '../../Pages/Student/Student';
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Edit = ({ student, students }) => {
  return (
    <AuthenticatedLayout>
      <Head title="Edit Student" />
      
      {/* Pass the student to edit and all students for the table */}
      <Student 
        student={student} 
        students={students} 
      />
    </AuthenticatedLayout>
  );
};

export default Edit;
