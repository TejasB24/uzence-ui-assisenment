import React, { useState } from 'react';
import SmartSelect from './components/SmartSelect';
import DataTable from './components/DataTable';

const App: React.FC = () => {
	const [fruit, setFruit] = useState<string | null>('banana');

	return (
		<div className="p-6 space-y-8">
			<h1 className="text-2xl font-bold">Uzence UI Assignment</h1>

			<SmartSelect
				label="Choose option"
				value={fruit}
				onChange={setFruit}
				helperText={`Selected: ${fruit ?? 'none'}`}
				options={[
					{ value: 'apple', label: 'Apple' },
					{ value: 'banana', label: 'Banana' },
					{ value: 'cherry', label: 'Cherry' },
				]}
			/>

			<DataTable
				columns={[{ key: 'name', label: 'Name', sortable: true }, { key: 'age', label: 'Age', sortable: true }]}
				data={[
					{ name: 'Alice', age: 25 },
					{ name: 'Bob', age: 30 },
					{ name: 'Charlie', age: 35 },
				]}
				caption="Simple sortable table"
				initialSort={{ key: 'name', direction: 'asc' }}
			/>
		</div>
	);
};

export default App;