import React, { useEffect } from "react";

const departments = [
  {
    name: "All",
    value: "All",
  },
  {
    name: "Computer/IT",
    value: "Computer/IT",
  },
  {
    name: "Chemical Engineering",
    value: "Chemical Engineering",
  },
  {
    name: "Electrical Engineering",
    value: "Electrical Engineering",
  },
  {
    name: "Mechanical Engineering",
    value: "Mechanical Engineering",
  },
  {
    name: "Civil Engineering",
    value: "Civil Engineering",
  },
];

const Filters = ({
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  getData,
}) => {
  return (
    <div className="flex flex-col bg-slate-100 p-5 h-full my-filters-page">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">Filters</h1>
        <i
          className="ri-close-line cursor-pointer text-2xl"
          onClick={() => setShowFilters(false)}
        ></i>
      </div>
      <div className="flex flex-col gap-1 mt-5">
        <h1 className="text-gray-600 text-xl">Departments</h1>
        <div className="flex flex-col gap-1 justify-start">
          {departments.map((department) => {
            return (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="department"
                  className="width-fit"
                  checked={filters.department.includes(department.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({
                        ...filters,
                        department: [...filters.department, department.value],
                      });
                    } else {
                      setFilters({
                        ...filters,
                        department: filters.department.filter(
                          (item) => item !== department.value
                        ),
                      });
                    }
                  }}
                />
                <label htmlFor="department">{department.value}</label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Filters;
