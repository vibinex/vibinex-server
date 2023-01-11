export default interface DropZoneAction {
	type: string,
	inDropZone?: boolean,
	files?: Array<File>
}