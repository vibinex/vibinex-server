const LoadingOverlay = ({ text, type }: { text?: string, type?: 'loading' | 'error' }) => (
	<div className="fixed z-50 top-0 left-0 w-full h-full justify-center items-center backdrop-brightness-50 flex flex-col">
		{(type === 'error') ?
			// <div className="inline-block bg-error w-16 h-16 rounded-full border border-solid border-primary-light before:rotate-45 after:-rotate-45 before:absolute after:absolute before:w-2 after:w-2 before:h-8 after:h-8 before:bg-primary-light after:bg-primary-light before:top-3 after:top-3 before:left-5 after:left-5"></div> :
			<div className="bg-error w-16 h-16 rounded-full border border-solid border-primary-light flex justify-center items-center">
				<div className="before:rotate-45 after:-rotate-45 before:absolute after:absolute before:w-2 after:w-2 -translate-x-1 before:h-10 after:h-10 -translate-y-5 before:bg-primary-light after:bg-primary-light"></div>
			</div>
			:
			<div className="border-4 border-t-primary-main rounded-full w-32 h-32 animate-spin"></div>
		}
		<div className="my-5 text-secondary-main">{text ?? "Loading..."}</div>
	</div>
);

export default LoadingOverlay;