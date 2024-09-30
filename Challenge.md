# Invoice Full-Stack code challenge

## The task

### Description

The task is to build an invoice displaying app, where everytime the user refreshes the page they get
new invoice data. The data is randomly generated and provided by a service named so fittingly, [microservice](microservice/srv.*). The service is written in Go. 

### Expectation

The result should be:

- A Node.js server that serves the React app from [src/web/static](src/web/static/app.jsx) and [src/web/templates](src/web/templates/index.html)
- Convert the skeleton react invoice into a dynamic invoice with data pulled from the server
- Calculate the total of line items of the invoice
- Add/Remove line items to the invoice
    - First support only client-side modifications
    - Secondly support persistence in an in-memory store on the Node.js server

We expect you to write code you would consider production-ready. This means your code should be simple, robust and follow good practices. If you decided for certain design decisions, please document them and explain why you have chosen them. Last but not least, please provide your solution in version control (git, bitbucket, etc.) and share the repository with us. We don't expect from you to improve the infrastructure setup like converting this project into a *create-react-app* template or such, try to work with the existing (unconventional) layout. It is fine if your application runs with the react development runtime.


## Microservice

The microservice exposes a JSON endpoint at `http://localhost:3000/rnd/invoice.json`.

## Completion Time

Within a maximum of 7 Days.