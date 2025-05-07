import React, { useState } from "react";
import PreDeploymentFiles from "./Partials/PreDeploymentFiles";
import DeploymentFiles from "./Partials/DeploymentFiles";
import FinalRequirementFiles from "./Partials/FinalRequirementFiles";
import DTRFiles from "./Partials/DTRFiles";
import UploadedFiles from "./Partials/UploadedFiles";

export default function UploadFiles({ id, preDeployment, deployment, final, dtr, student_company, }) {
  const [selectedCategory, setSelectedCategory] = useState("Pre-Deployment");
  const categories = ["Pre-Deployment", "Deployment", "Final Requirements", "Daily Time Record", "Uploaded Files"];

  const [selectedCompany, setSelectedCompany] = useState('');
  console.log('thisi s the comp id,', selectedCompany)

  return (
    <div className="max-w-full mx-auto space-y-4">
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <div className="flex items-center justify-between space-x-6 text-sm text-gray-700 mb-4">
            <div className="flex gap-2">
              <div className="flex items-center space-x-1">
                <span className="text-green-600">✓</span>
                <span>Verified</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-red-500">○</span>
                <span>Pending</span>
              </div>
            </div>

            <select
              className="border border-gray-300 rounded px-3 py-1 text-sm w-52"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              {student_company.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.company?.Comp_name ?? "Not Available"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex mb-4 border-b pb-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`mr-4 py-1 px-3 rounded ${
                  selectedCategory === category
                    ? "bg-uslsgreen text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-md p-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-uslsgreen text-lg">{selectedCategory}</h3>
            </div>

            {selectedCategory === "Pre-Deployment" && (
              <PreDeploymentFiles
                id={id}
                preDeployment={preDeployment.filter(
                  (file) => String(file.Comp_ID) === String(selectedCompany)
                )}
                student_company={student_company}
                comp_id={selectedCompany}
              />
            )}

            {selectedCategory === "Deployment" && (
              <DeploymentFiles
                id={id}
                deployment={deployment.filter(
                  (file) => String(file.Comp_ID) === String(selectedCompany)
                )}
                selectedCompany={selectedCompany}
                comp_id={selectedCompany}
              />
            )}

            {selectedCategory === "Final Requirements" && (
              <FinalRequirementFiles
                id={id}
                final={final.filter(
                  (file) => String(file.Comp_ID) === String(selectedCompany)
                )}
                selectedCompany={selectedCompany}
                comp_id={selectedCompany}
              />
            )}

            {selectedCategory === "Daily Time Record" && (
              <DTRFiles
                id={id}
                dtr={dtr.filter(
                  (file) => String(file.Comp_ID) === String(selectedCompany)
                )}
                selectedCompany={selectedCompany}
                comp_id={selectedCompany}
              />
            )}

            {selectedCategory === "Uploaded Files" && (
              <UploadedFiles
                id={id}
                preDeployment={preDeployment}
                deployment={deployment}
                final={final}
                dtr={dtr}
                selectedCompany={selectedCompany}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
