import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";

export default function Forms({ colleges, flash }) {

  return (
    <AuthenticatedLayout>
        <Head title="Class List" />
            <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Downloadable Forms</h2>
            </div>
    </AuthenticatedLayout>
  );
}