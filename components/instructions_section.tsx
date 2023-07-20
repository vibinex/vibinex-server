import Image from 'next/image'
import React, { ReactNode } from 'react'

export interface InstructionSectionProps {
	heading: string,
	instructions: {
		symbol?: string,
		instruction: ReactNode,
	}[],
}

export default function InstructionsSection({ heading, instructions }: InstructionSectionProps) {
	return (
		<>
			<h1>{heading}</h1>
			<ol>
				{
					instructions.map(({ symbol, instruction }) => (
						<li key={symbol}>
							{(symbol) ? <Image src={symbol} alt={symbol} /> : null}
							{instruction}
						</li>
					))
				}
			</ol>
		</>
	)
}