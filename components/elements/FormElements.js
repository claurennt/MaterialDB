import React from "react";

const FormInput = ({ handleChange, name, placeholder }) => (
  <div className="mt-1 flex rounded-md shadow-sm">
    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
      {name}
    </span>
    <input
      onChange={(e) => handleChange(e)}
      type="text"
      name={name}
      id={name}
      className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
      placeholder={placeholder}
    />
  </div>
);

const FormSelect = ({ name, handleChange }) => (
  <div className="flex items-center h-5 pt-5">
    <input
      onChange={(e) => handleChange(e)}
      id="category"
      name="category"
      value={name}
      type="radio"
      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
    />{" "}
    <label htmlFor="category" className="px-3">
      {name}
    </label>
  </div>
);

export { FormInput, FormSelect };
