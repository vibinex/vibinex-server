import { PropsWithChildren } from "react";

const TableHeaderCell = ({ className, children }: PropsWithChildren<{ className?: string }>) => (
	<th className={"px-6 py-3 bg-primary text-left text-xs font-semibold text-gray-500 uppercase tracking-wider " + className}>
		{children}
	</th>
);


const TableCell = ({ className, children }: PropsWithChildren<{ className?: string }>) => (
	<td className={"px-6 py-4 whitespace-nowrap " + className}>{children}</td>
);

export { TableHeaderCell, TableCell };