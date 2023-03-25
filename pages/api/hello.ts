// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import rudderStackEvents  from './events'

type MyData = {
  name: string
}

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<MyData>
) {
	rudderStackEvents.track("1234", "anonymous", "hello-event", {eventStatusFlag: 1});
	res.status(200).json({ name: 'John Doe' })
}