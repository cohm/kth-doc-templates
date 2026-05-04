![](.templates/KTH_logo_RGB_bla.png)

# Widget Library v2 — User Guide

<p class="subtitle">Installing, using, and extending the widget library</p>
<p class="doctype">Package documentation</p>

> **Summary.** This document describes how to install and use the widget
> library in downstream projects. It is built from `report.md` using the
> [kth-doc-templates](https://github.com/kth/kth-doc-templates) markdown
> theme, included here as a git submodule under `.templates/`.

## Installation

Add the package to your project:

```bash
npm install @kth/widget-library
```

## Quick start

Import the main entry point and instantiate a widget:

```js
import { Widget } from '@kth/widget-library';

const w = new Widget({ kind: 'gauge' });
w.render('#root');
```

## API reference

### `new Widget(options)`

Creates a new widget instance.

| Option   | Type     | Default  | Description                       |
|----------|----------|----------|-----------------------------------|
| `kind`   | string   | `'bar'`  | Widget type — `bar`, `gauge`, …   |
| `theme`  | string   | `'kth'`  | Visual theme.                     |
| `data`   | array    | `[]`     | Initial dataset.                  |

### `widget.render(selector)`

Mounts the widget into the DOM element matched by `selector`.

<div class="notebox">

**Note.** The widget mounts synchronously and assumes the target element
already exists. Wait for `DOMContentLoaded` if you call this from a
top-level script.

</div>

## Contact

For support, contact the package maintainers at
<widget-library@kth.se>.
