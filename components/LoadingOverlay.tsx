const LoadingOverlay = ({ text }: { text?: string }) => (
	<div className="fixed z-50 top-0 left-0 w-full h-full justify-center items-center backdrop-brightness-50 flex flex-col">
		<div className="border-4 border-t-primary-main rounded-full w-32 h-32 animate-spin"></div>
		<div className="my-5 text-secondary-main">{text ?? "Loading..."}</div>
	</div>
);

export default LoadingOverlay;