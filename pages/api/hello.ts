// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type MyData = {
	name: string
}

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<MyData>
) {
	res.status(200).json({ name: 'John Doe' })
}