import React from "react";

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

export default FormSelect;
