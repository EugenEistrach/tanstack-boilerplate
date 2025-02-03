import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	type Table,
} from '@tanstack/react-table'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Table as UITable,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import * as m from '@/lib/paraglide/messages'
import { cn } from '@/lib/shared/utils'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	rowClassName?: (row: { original: TData }) => string
}

function PaginationControl<TData>({ table }: { table: Table<TData> }) {
	const currentPage = table.getState().pagination.pageIndex
	const totalPages = table.getPageCount()

	if (totalPages <= 1) return null

	return (
		<div className="flex items-center gap-2">
			<button
				onClick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
				className={cn(
					'flex h-8 w-8 items-center justify-center rounded-md border border-transparent',
					'hover:border-border hover:bg-accent',
					'disabled:pointer-events-none disabled:opacity-50',
				)}
			>
				<span className="sr-only">{m.chunky_bright_earthworm_belong()}</span>
				<ChevronLeft className="h-4 w-4" />
			</button>

			<Select
				value={currentPage.toString()}
				onValueChange={(value) => {
					table.setPageIndex(Number(value))
				}}
			>
				<SelectTrigger className="h-8 w-[70px]">
					<SelectValue>{currentPage + 1}</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{Array.from({ length: totalPages }, (_, i) => (
						<SelectItem key={i} value={i.toString()}>
							{m.elegant_just_turkey_snap({ number: (i + 1).toString() })}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<div className="text-sm text-muted-foreground">
				{m.warm_cool_thrush_aspire({ total: totalPages.toString() })}
			</div>

			<button
				onClick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
				className={cn(
					'flex h-8 w-8 items-center justify-center rounded-md border border-transparent',
					'hover:border-border hover:bg-accent',
					'disabled:pointer-events-none disabled:opacity-50',
				)}
			>
				<span className="sr-only">{m.mean_lofty_pelican_rest()}</span>
				<ChevronRight className="h-4 w-4" />
			</button>
		</div>
	)
}

export function DataTable<TData, TValue>({
	columns,
	data,
	rowClassName,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: {
				pageSize: 50,
			},
		},
	})

	const { pageSize, pageIndex } = table.getState().pagination

	return (
		<div>
			<div className="rounded-md border">
				<UITable>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									className={rowClassName?.(row)}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									{m.mellow_house_mule_buzz()}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</UITable>
			</div>
			<div className="flex items-center justify-between py-4">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<div className="flex items-center gap-1">
						<span>{m.simple_plain_shrike_type()}</span>
						<Select
							value={pageSize.toString()}
							onValueChange={(value) => {
								table.setPageSize(Number(value))
							}}
						>
							<SelectTrigger className="h-8 w-[70px]">
								<SelectValue placeholder={pageSize.toString()} />
							</SelectTrigger>
							<SelectContent side="top">
								{[25, 50, 100, 200].map((size) => (
									<SelectItem key={size} value={size.toString()}>
										{size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div>
						{m.proof_real_beaver_list({
							from: (pageIndex * pageSize + 1).toString(),
							to: Math.min(
								(pageIndex + 1) * pageSize,
								table.getFilteredRowModel().rows.length,
							).toString(),
							total: table.getFilteredRowModel().rows.length.toString(),
						})}
					</div>
				</div>
				<PaginationControl table={table} />
			</div>
		</div>
	)
}
