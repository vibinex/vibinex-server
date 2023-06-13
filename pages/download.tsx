import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import { rudderEventMethods } from "../utils/rudderstack_initialize";

export default function Download() {
	React.useEffect(() => {
		let localStorageAnonymousId = localStorage.getItem("AnonymousId")
		let anonymousId = (localStorageAnonymousId && localStorageAnonymousId != null) ? localStorageAnonymousId : uuidv4()
			rudderEventMethods().then((response) => {
				response?.track("", "download page call", {eventStatusFlag: 1}, anonymousId) //Anonymous Id is set in local storage as soon as the user lands on the webiste.
			});
	  }, []);

	return (
		<>
			<h1>{"Downloads"}</h1>
			<h3>{"Latest version: 1.0.0"}</h3>
			<table>
				<thead>
					<tr>
						<th>Operating System</th>
						<th>Executable</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Windows 64-bit</td>
						<td><a href="#">{"dev-profiler.exe"}</a></td>
					</tr>
					<tr>
						<td>MacOS 64-bit</td>
						<td><a href="#">{"dev-profiler (bin)"}</a></td>
					</tr>
					<tr>
						<td>Linux (Debian) 64-bit</td>
						<td><a href="#">{"dev-profiler (bin)"}</a></td>
					</tr>
				</tbody>
			</table>
		</>
	)
}