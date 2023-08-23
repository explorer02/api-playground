# API Playground

React Playground for API Routes
A component to ease up hitting utility routes based on different templates

Best usecase is to open the component in a Modal

## API

Component - <b>APIPlayground</b>

Props =>
<b>config</b>: TemplateConfig[]

> TemplateConfig is a union type for different type of templates

| Template                         | Usecase                                                                                     | Options                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cache Viewer <br> (CACHE_VIEWER) | View static data <br>- Quickly peek into some environment configurations or user properties | - id(string) - unique id for template<br> - title(string) - template title to be shown in sidenav<br> - type(Template)- Template.STATIC_DATA<br> - data(object\|string) - JSON object or string to be shown<br> - language(?Language) - Language of data (JSON, JAVASCRIPT), for syntax highlighting and formatting<br> - readOnly(?boolean) - whether the content is editable or not |
|                                  |                                                                                             |                                                                                                                                                                                                                                                                                                                                                                                       |
|                                  |                                                                                             |                                                                                                                                                                                                                                                                                                                                                                                       |

### How to build?

- compile `src/styles/root.scss` and `src/styles/tailwind.scss` using VSCode live SASS compiler
- execute `yarn build`

## License

ISC Licensed. Copyright (c) @explorer02 2023.
