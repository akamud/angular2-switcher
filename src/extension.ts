'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const HTML_MODE: vscode.DocumentFilter = { language: 'html', scheme: 'file' };

const HTML_TAGS: string[] = [
    'html', 'head', 'body',
    'script', 'style',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'div', 'p', 'a', 'img', 'span', 'strong', 'em',
    'table', 'thead', 'tbody', 'th', 'tr', 'td',
    'ul', 'li', 'ol', 'dl', 'dt', 'dd',
    'form', 'input', 'label', 'button',
    'class', 'id', 'src', 'href',
    'click', 'mousemove',
];

class HTMLDefinitionProvider implements vscode.DefinitionProvider {
    public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) : Thenable<vscode.Location> {
        return new Promise((resolve, reject) => {
            let range = document.getWordRangeAtPosition(position);
            let word = document.getText(range);
            let wordType = 0;       // 0: property, 1: function

            // check word as function or property.
            if (HTML_TAGS.findIndex(tag => tag === word.toLowerCase()) >= 0) {
                console.log(`${word} is html tag.`);
                resolve();
            }

            // if next character is '(', so word is function
            if (document.getText(new vscode.Range(range.end, range.end.translate(0, 1))) === '(') {
                wordType = 1;
            }
            // console.log(`wordType: ${wordType}`);

            // find function in ts
            var htmlFile = document.fileName;
            let fileNameWithoutExtension = htmlFile.slice(0, htmlFile.lastIndexOf('.'));
            var tsFile = fileNameWithoutExtension + '.ts';
            let tsUri = vscode.Uri.file(tsFile);
            vscode.workspace.openTextDocument(tsFile).then((tsDoc) => {
                let lineCount = tsDoc.lineCount;
                for (var index = 0; index < tsDoc.lineCount; index++) {
                    let line = tsDoc.lineAt(index);
                    if (line.isEmptyOrWhitespace) {
                        continue;
                    }
                    let pattern: string;
                    if (wordType === 0) {               // property
                        pattern = `[^\.]${word}`;
                    }
                    else {                              // function
                        pattern = `[^\.]${word}\\(.*\\)`;
                    }
                    let rgx = new RegExp(pattern);
                    if (rgx.test(line.text))
                    {
                        resolve(new vscode.Location(tsUri, new vscode.Position(index, line.firstNonWhitespaceCharacterIndex)));
                    }
                }
                resolve();
            });
        });
    }
}

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
function openTextDocument(path: string): Promise<vscode.TextDocument> {
    return new Promise((resolve, reject) =>{
        vscode.workspace.openTextDocument(path)
            .then(
                (doc) => {
                    vscode.window.showTextDocument(doc).then(() => {
                        resolve(doc);
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

    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider(
            HTML_MODE, new HTMLDefinitionProvider())
    );

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
            if (previous && previous !== currentFile) {
                if (previous.startsWith(fileNameWithoutExtension)) {
                    targetFile = previous;
                }
                else {
                    targetFile = fileNameWithoutExtension + '.ts';
                }
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
            if (previous && previous !== currentFile) {
                if (previous.startsWith(fileNameWithoutExtension)) {
                    targetFile = previous;
                }
                else {
                    targetFile = fileNameWithoutExtension + '.html';
                }
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
            if (previous && previous !== currentFile) {
                if (previous.startsWith(fileNameWithoutExtension)) {
                    targetFile.push(previous);
                }
                else {
                    targetFile.push(fileNameWithoutExtension + '.html');
                }
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