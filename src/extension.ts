import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.shareCodeLink', () => {

		let baseShareUrl = "https://gitlab.com/<project>/<repo>/-/blob/master";
		// TODO 
		// ApiRepository.getBranch - https://github.com/microsoft/vscode/blob/main/extensions/git/src/api/api1.ts#L160
		// get remote 
		console.log(vscode.workspace?.workspaceFolders);
		if (vscode.workspace.workspaceFolders === undefined) {
			vscode.window.showInformationMessage("No workspace opened");
			return;
		}
		let workspaceDir = vscode.workspace?.workspaceFolders[0].uri.path;
		console.log(vscode.window.activeTextEditor);
		if (vscode.window.activeTextEditor === undefined) {
			vscode.window.showInformationMessage("No file opened");
			return;
		}
		let [filePath, selectionStr] = getPathAndSelectionFromEditor(vscode.window.activeTextEditor);
		let relativeFilePath = filePath.replace(workspaceDir, "");
		console.log(relativeFilePath);
		let finalShareUrl = `${baseShareUrl}${relativeFilePath}#L${selectionStr}`;
		let message = vscode.window.activeTextEditor ? finalShareUrl : "No text editor opened";

		vscode.window.showInformationMessage(message);
	});
	context.subscriptions.push(disposable);
}


function getPathAndSelectionFromEditor(textEditor: vscode.TextEditor | undefined, delimeter: string = "-"): [string, string] {
	if (textEditor === undefined) {
		throw "No Text Editor supplied";
	}
	let selection;
	if (textEditor.selection.isSingleLine) {
		return [textEditor.document.uri.path, String(textEditor.selection.start.line)];
	}
	return [textEditor.document.uri.path, `${textEditor.selection.start.line}${delimeter}${textEditor.selection.end.line}`];
}