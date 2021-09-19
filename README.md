# Ticketyboo

Ticketyboo is a StubHub / Ticketmaster clone.

The frontend is built using Next JS and utilises Server-side rendering.

The backend consists of several Express Microservices written in TypeScript, a common npm module for shared code, and a central NATS Streaming Server acting as an event bus.

Docker & Kubernetes has been utilised throughout for both development and deployment.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)

- [Kubernetes](https://kubernetes.io/docs/setup/) - I just enabled it in the Docker for Windows application (Settings -> Kubernetes -> Enable Kubernetes -> Apply & Restart)

- [Skaffold](https://skaffold.dev/docs/install/) - This required me to install Chocolately as I was using Windows for dev

- [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#docker-for-mac)

### Run locally

Provided you have installed all of the relevant requirements and have the Docker daemon & Kubernetes running in the background, run the follow command to;

Run in development mode

`$ skaffold dev`

Navigate to ticketyboo.dev in your browser (type thisisunsafe if you get a warning from Chrome)

### Testing

Each service has it's own suite of unit tests.

`$ npm run test`

### A note on transactions / data integrity

To keep the project simple (I only have so much free time!) we've chosen not to implement database transactions for saving items and saving events to emit, as well as two-phase commit for event emissions.

Ideally we'd have an events collection along side a, e.g., tickets collection. Write to both collections in a transaction (initial event state is sent=false, when we succesfully emit the event update the collection).

| sent  | event                      |
| ----- | -------------------------- |
| false | { transaction:created ...} |
| true  | { transaction:updated ...} |

A separate process will be watching events being written to this table, and will emit these to NATS.

This ensures that;

- if we fail to write to the tickets collection, rollback both writes (to tickets & events collections)
- if we fail to write to the events collection, rollback both writes (to tickets & events collections)
- if we fail to emit the event to NATS, the separate process can eventually recover and emit to NATS (avoid data integrity issues for emitted events & stored state in the tickets collection)
