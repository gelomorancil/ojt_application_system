import React from "react";
import Course from '../../Pages/Courses/Course';
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Edit = ({ course, courses }) => {
  return (
    <AuthenticatedLayout>
      <Head title="Edit Course" />
      
      {/* Pass the course to edit and all courses for the table */}
      <Course 
        course={course} 
        courses={courses} 
      />
    </AuthenticatedLayout>
  );
};

export default Edit;