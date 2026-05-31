---
form: contact
tube: /tube/contact
---

# Contact

Wrote this for Dan and Claudette.

```css
form {
  display: grid;
  grid-template-areas:
    "name    email"
    "message message"
    "intent  submit";
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  max-width: 640px;
}

input, textarea, select {
  font: inherit;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  min-height: 180px;
  resize: vertical;
}

button {
  background: #1a1a1a;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  justify-self: end;
}
```

## name
- type: text
- area: name
- required: true
- max: 100
- placeholder: Your name

```css
.field-name {
  font-weight: 600;
}
.field-name input {
  border-color: #1a1a1a;
}
```

## email
- type: email
- area: email
- required: true
- placeholder: you@example.com

```css
.field-email input {
  text-transform: lowercase;
}
```

## message
- type: textarea
- area: message
- required: true
- min: 10
- max: 2000
- placeholder: What's on your mind?

```css
.field-message textarea {
  min-height: 200px;
  line-height: 1.6;
  font-family: Georgia, serif;
}
```

## intent
- type: select
- area: intent
- options: [hello, collaborate, question, other]
- default: hello

```css
.field-intent select {
  appearance: none;
  background: url("data:image/svg+xml,...") no-repeat right 0.75rem center;
  padding-right: 2.5rem;
}
```
