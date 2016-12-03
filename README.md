# angular2-switcher
Easily navigate to `typescript(.ts)`|`template(.html)`|`style(.scss/.sass/.css)` in angular2 project.

## Source
[GitHub](https://github.com/infinity1207/angular2-switcher)

## Usage
### Go to the definition of variables/functions when press `f12` within html.

### Switch `.ts`|`.html`|`.scss` fastly. 
#### `alt+o`(Windows) `shift+alt+o`(macOS)
* if on ts : go to html
* if on css : go to html
* if on html: go to previous (ts or css)

#### `alt+i`(Windows) `shift+alt+i`(macOS)
* if on ts : go to css
* if on html : go to css
* if on css: go to previous (ts or html)

#### `alt+u`(Windows) `shift+alt+u`(macOS)
* if on css : go to ts
* if on html : go to ts
* if on ts: go to previous (css or html)

## Release Notes
### 0.0.8
Support go to the definition of variables/functions when press `f12` within html.

### 0.0.7
Change default key bindings in macOS.

### 0.0.6
Always trigger shortcuts in anywhere.

### 0.0.5
Modify README format.

### 0.0.4
Add more commonds, you can navigate to template(.html)|typescript(.ts)|style(.scss/.sass/.css) easily.

### 0.0.3
Handle exeption when corresponding file does not exists.

### 0.0.2
Modify categories.

### 0.0.1
Initial release.