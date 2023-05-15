import React, { useState } from 'react';
import { MouseEventHandler, PropsWithChildren } from "react";

const SideTree = (props: PropsWithChildren<{

	docsList?: string[],
	target?: string,
	onClick?: Function,
	disabled?: boolean,
	className?: string,
}>) => {

	const [list, setList] = useState(props.docsList || []);

	return (
		<div className='mr-10 sm:border-r-2 p-4 sm:border-[gray] sm:block flex'>
			{list.length > 0 ? list.map((item, index) => {
				return (
					<div key={index}>
						<div onClick={() => {
							// setArticle(item.content);
							// setHeading(item.heading);
							let temp = list;
							temp[index].flag = !item.flag;
							setList([...temp]);
						}}
							className='cursor-pointer sm:mt-6  p-3 rounded-md sm:ml-0 ml-8 '>
							<h1 className='text-1xl font-semibold'>{item.heading}</h1>
						</div>

						{/* Can also show subheading in tree structure if needed */}
						{/* {item.flag ? (
									item.content.map((item, index) => {
										return (
											<div>
												<h1 className='ml-6 text-sm mt-2 border-l-2 border-[gray] pl-2'>{item.subHeading}</h1>
											</div>
										)
									})
								) : null} */}
					</div>
				)
			}) : null}
		</div>
	)
}

export default SideTree;