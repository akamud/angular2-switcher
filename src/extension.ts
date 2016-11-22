'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function fileIs(path: string, ...items: string[]) : boolean {
    if (!items) {
        return false;
    }

    let lPath = path.toLowerCase();
    for (var index = 0; index < items.length; index++) {
        var element = items[index];
        if (path.endsWith(items[index].toLowerCase())) {
            return true;
        }
    }

    return false;
}

let previous = '';
function openTextDocument(path: string): Promise<any> {
    return new Promise((resolve, reject) =>{
        vscode.workspace.openTextDocument(path)
            .then(
                (value) => {
                    vscode.window.showTextDocument(value).then(() => {
                        resolve();
                    }, (err) => {
                        reject(err);
                    });
                }, 
                (err) => {
                    reject(err);
                }
            );
    });
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "angular2-switcher" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let cmdSwitchTemplate = vscode.commands.registerCommand('extension.switchTemplate', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        // vscode.window.showInformationMessage('Hello World!');

        if (!vscode.workspace) {
            return;
        }
        
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        var currentFile = editor.document.fileName;
        let fileNameWithoutExtension = currentFile.slice(0, currentFile.lastIndexOf('.'));
        var targetFile = '';
        if (fileIs(currentFile, '.ts', '.scss', '.sass', '.css')) {
            targetFile = fileNameWithoutExtension + '.html';
        }
        else if (fileIs(currentFile, '.html')) {
            if (previous) {
                targetFile = previous;
            }
            else {
                targetFile = fileNameWithoutExtension + '.ts';
            }
        }
        else {
            return;
        }

        openTextDocument(targetFile).then(() => {
            previous = currentFile;
        }, (err) => {
            console.log(err);
        });

    });

    let cmdSwitchTS = vscode.commands.registerCommand('extension.switchTS', () => {

        if (!vscode.workspace) {
            return;
        }
        
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        var currentFile = editor.document.fileName;
        let fileNameWithoutExtension = currentFile.slice(0, currentFile.lastIndexOf('.'));
        var targetFile = '';
        if (fileIs(currentFile, '.html', '.scss', '.sass', '.css')) {
            targetFile = fileNameWithoutExtension + '.ts';
        }
        else if (fileIs(currentFile, '.ts')) {
            if (previous) {
                targetFile = previous
            }
            else {
                targetFile = fileNameWithoutExtension + '.html';
            }
        }
        else {
            return;
        }

        openTextDocument(targetFile).then(() => {
            previous = currentFile;
        }, (err) => {
            // console.log(err);
        });
    });

    let cmdSwitchStyle = vscode.commands.registerCommand('extension.switchStyle', () => {

        if (!vscode.workspace) {
            return;
        }
        
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        var currentFile = editor.document.fileName;
        let fileNameWithoutExtension = currentFile.slice(0, currentFile.lastIndexOf('.'));
        var targetFile: string[] = [];
        if (fileIs(currentFile, 'scss', 'sass', 'css')) {
            if (previous) {
                targetFile.push(previous);
            }
            else {
                targetFile.push(fileNameWithoutExtension + '.html');
            }
        }
        else if (fileIs(currentFile, '.ts', '.html')) {
            targetFile.push(fileNameWithoutExtension + '.scss');
            targetFile.push(fileNameWithoutExtension + '.sass');
            targetFile.push(fileNameWithoutExtension + '.css');
        }
        else {
            return;
        }

        var g = gen(targetFile);
        function next() {
            var result = g.next();
            if (result.done)
                return;
            result.value.then(() => {
                previous = currentFile;
                return;
            }, (err) => {
                // console.log(err);
                next();
            });
        }

        next();
    });

    context.subscriptions.push(cmdSwitchTemplate, cmdSwitchStyle, cmdSwitchTS);
}

function* gen(files: string[]) {
    for (var index = 0; index < files.length; index++) {
        yield openTextDocument(files[index]);
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}