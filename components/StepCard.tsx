import { PropsWithChildren } from "react";

const StepCard = (props: PropsWithChildren<{
    step: string,
    description: string
}>) => {
    return (
        <div className="sm:p-5  p-3 sm:m-5 m-3 rounded-lg border-2 mt-7 sm:w-[40rem] w-[17rem] text-center border-primary-main">
            <div className="p-2 text-[22px] font-semibold">
                <h2>{props.step}</h2>
            </div>
            <div className="p-2">
                <p>{props.description}</p>
            </div>
        </div>
    )
}
export default StepCard