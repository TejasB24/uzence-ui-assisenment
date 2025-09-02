import React from 'react';
import SmartSelect from './components/SmartSelect';
import DataTable from './components/DataTable';

const App: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Uzence UI Assignment</h1>
      <SmartSelect
        label="Choose option"
        options={[
          { value: 'apple', label: 'Apple' },
          { value: 'banana', label: 'Banana' },
          { value: 'cherry', label: 'Cherry' },
        ]}
      />
      <DataTable
        columns={[{ key: 'name', label: 'Name' }, { key: 'age', label: 'Age' }]}
        data={[
          { name: 'Alice', age: 25 },
          { name: 'Bob', age: 30 },
          { name: 'Charlie', age: 35 },
        ]}
      />
    </div>
  );
};

export default App;