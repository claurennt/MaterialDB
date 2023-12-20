import React from 'react';
import type { NewTopic } from 'types/components';

type FormInputsProps = {
  type: string;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  newData: NewTopic[];
};
const FormInputs: React.FunctionComponent<FormInputsProps> = ({
  type,
  handleChange,
  newData,
}) => {
  const topicInputs = [
    { name: 'name', placeholder: 'Name of the topic' },
    { name: 'description', placeholder: 'add a short intro to the topic' },
  ];
  const linkInputs = [
    { name: 'url', placeholder: 'paste website url here' },
    { name: 'tags', placeholder: 'add your tags here' },
  ];
  const inputs = type === 'topic' ? topicInputs : linkInputs;

  return (
    <>
      {inputs?.map(({ name, placeholder }) => (
        <div key={placeholder} className='mt-1 flex rounded-md shadow-sm'>
          <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'>
            {name}
          </span>
          <input
            value={newData && newData[name]}
            onChange={handleChange}
            type='text'
            name={name}
            id={name}
            className='text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 text-red'
            placeholder={placeholder}
          />
        </div>
      ))}
    </>
  );
};

export default FormInputs;
