import React, { useEffect, useState } from 'react';
import SmartSelect from './components/SmartSelect';
import DataTable from './components/DataTable';

const App: React.FC = () => {
  const [dark, setDark] = useState(false);
  const [fruit, setFruit] = useState<string | null>('banana');
  const error = !fruit ? 'Please select an option' : '';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Uzence UI Assignment</h1>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} className="h-4 w-4" />
          Dark mode
        </label>
      </div>

      <SmartSelect
        label="Choose option"
        value={fruit}
        onChange={setFruit}
        required
        error={error}
        helperText={`Selected: ${fruit ?? 'none'}`}
        options={[
          { value: 'apple', label: 'Apple' },
          { value: 'banana', label: 'Banana' },
          { value: 'cherry', label: 'Cherry' },
        ]}
      />

      <DataTable
        caption="Simple sortable table"
        columns={[
          { key: 'name', label: 'Name', sortable: true },
          { key: 'age', label: 'Age', sortable: true, align: 'right' },
        ]}
        data={[
          { name: 'Alice', age: 25 },
          { name: 'Bob', age: 30 },
          { name: 'Charlie', age: 35 },
        ]}
        initialSort={{ key: 'name', direction: 'asc' }}
      />
    </div>
  );
};

export default App;