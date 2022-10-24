import { nanoid } from 'nanoid';

const FormInputs = ({ handleChange, inputs, newData }) => {
  return inputs?.map(({ name, placeholder }) => (
    <div key={placeholder} className='mt-1 flex rounded-md shadow-sm'>
      <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'>
        {name}
      </span>
      <input
        value={newData[name]}
        onChange={(e) => handleChange(e)}
        type='text'
        name={name}
        id={name}
        className='focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300'
        placeholder={placeholder}
      />
    </div>
  ));
};
export default FormInputs;
