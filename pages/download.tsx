import React from 'react'

export default function Download() {
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