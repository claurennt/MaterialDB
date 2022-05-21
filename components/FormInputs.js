const FormInputs = ({ handleChange }) => {
  const inputs = [
    { name: "name", placeholder: "Name of the topic" },
    { name: "description", placeholder: "add a short intro to the topic" },
  ];
  return inputs.map(({ name, placeholder }) => (
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
  ));
};

export default FormInputs;
