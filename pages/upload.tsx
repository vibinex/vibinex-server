import MainAppBar from "../views/MainAppBar";
import InstructionsSection, { InstructionSectionProps } from "../components/instructions_section"

export default function Upload() {
	const upload_instructions: InstructionSectionProps = {
		heading: "How to create your DevProfile?",
		instructions: [
			{
				instruction: (<span>Download the CLI from the <a href='download'>downloads</a></span>)
			},
			{
				instruction: (<span>
					Run <code>./dev-profiler find_repos</code> command to detect all Git repositories on your local machine
				</span>)
			},
			{
				instruction: (<span>
					Run <code>./dev-profiler generate</code> command to generate your objective contribution report from the detected repositories
				</span>)
			},
			{
				instruction: (<span>
					A report with the file-extension <code>.json.zip</code> will be created and stored inside the <code>artifacts</code> directory. Upload this file below.
				</span>)
			},
		]
	}

	return (
		<>
			<MainAppBar />
			<InstructionsSection {...upload_instructions} />
			<form action="u" method="post">
				<input type="file" name="report" id="dev-profile-report" />
				<input type="submit" value="Upload" />
			</form>
		</>
	)
}