import React, { forwardRef, memo, useId, useState } from 'react';

export type SmartSelectOption = {
	value: string;
	label: string;
	disabled?: boolean;
};

type BaseProps = {
	id?: string;
	name?: string;
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	required?: boolean;
	error?: string;
	helperText?: string;
	className?: string;
	options: SmartSelectOption[];
};

type ControlledProps = {
	value: string | null;
	onChange: (value: string | null) => void;
	defaultValue?: never;
};

type UncontrolledProps = {
	value?: never;
	onChange?: (value: string | null) => void;
	defaultValue?: string | null;
};

export type SmartSelectProps = BaseProps & (ControlledProps | UncontrolledProps);

function cn(...classes: Array<string | false | null | undefined>): string {
	return classes.filter(Boolean).join(' ');
}

const SmartSelectInner = forwardRef<HTMLSelectElement, SmartSelectProps>(function SmartSelect(
	{
		id,
		name,
		label,
		placeholder = 'Select...',
		disabled,
		required,
		error,
		helperText,
		className,
		options,
		...rest
	},
	ref
) {
	const autoId = useId();
	const selectId = id ?? `smartselect-${autoId}`;
	const labelId = label ? `${selectId}-label` : undefined;
	const helperId = helperText ? `${selectId}-help` : undefined;
	const errorId = error ? `${selectId}-error` : undefined;

	const isControlled = Object.prototype.hasOwnProperty.call(rest, 'value');
	const controlledValue = (rest as any).value as string | null | undefined;
	const onChangeProp = (rest as any).onChange as ((value: string | null) => void) | undefined;
	const defaultValue = (rest as any).defaultValue as string | null | undefined;

	const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(defaultValue ?? null);
	const selectedValue = (isControlled ? controlledValue : uncontrolledValue) ?? '';

	return (
		<div className={cn('w-full', className)}>
			{label ? (
				<label
					id={labelId}
					htmlFor={selectId}
					className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					{label} {required ? <span aria-hidden="true" className="text-red-600">*</span> : null}
				</label>
			) : null}

			<select
				ref={ref}
				id={selectId}
				name={name}
				disabled={disabled}
				required={required}
				value={selectedValue}
				onChange={(e) => {
					const next = e.target.value === '' ? null : e.target.value;
					if (!isControlled) setUncontrolledValue(next);
					onChangeProp?.(next);
				}}
				aria-labelledby={labelId}
				aria-describedby={cn(helperId, errorId)}
				aria-invalid={Boolean(error) || undefined}
				className={cn(
					'w-full rounded-md border px-3 py-2 text-sm transition',
					'bg-white dark:bg-gray-900',
					'text-gray-900 dark:text-gray-100',
					'border-gray-200 dark:border-gray-700',
					'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
					'disabled:opacity-50 disabled:cursor-not-allowed'
				)}
			>
				<option value="" disabled>
					{placeholder}
				</option>
				{options.map((opt) => (
					<option key={opt.value} value={opt.value} disabled={opt.disabled}>
						{opt.label}
					</option>
				))}
			</select>

			{helperText ? (
				<p id={helperId} className="mt-1 text-xs text-gray-500 dark:text-gray-400">
					{helperText}
				</p>
			) : null}

			{error ? (
				<p id={errorId} role="alert" className="mt-1 text-xs text-red-600">
					{error}
				</p>
			) : null}
		</div>
	);
});

SmartSelectInner.displayName = 'SmartSelect';

const SmartSelect = memo(SmartSelectInner);
export default SmartSelect;