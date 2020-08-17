# Ticketyboo

StubHub / Ticketmaster clone

### Requirements

- [ ] Users can list a ticket for an event for sale.
- [ ] Other users can purchase this ticket.
- [ ] Any user can list tickets for sale and purchase tickets.
- [ ] When a user attempts to purchase a ticket, this ticket is locked for n minutes. The user has n minutes to pay for said ticket.
- [ ] While locked, no other users can purchase the ticket. After n minutes, this ticket should unlock.
- [ ] Ticket prices can be edited if they are not locked (can change variably, perhaps due to demand?).

### Resource Types

User

- email
- password

Ticket

- title
- price
- userId
- orderId

Order - intent to purchase a ticket

- userId
- status
- ticketId
- expiresAt

Charge

- orderId
- status
- amount
- stripeId
- stripeRefundId

### Services

Separate service to manage each type of resource.

Auth - signup / signin / signout

Tickets - creation / editing

Orders - creation / editing

Expiration - Watches for orders to be created, cancels them after n minutes

Payments - Handles credit card payments. Cancels order if payment fails, compltes if payment succeeds

### Events

UserCreated, UserUpdated

TicketCreated, TicketUpdated

OrderCreated, OrderCancelled, OrderExpired

ChargeCreated

### Requirements

- [Docker](https://docs.docker.com/get-docker/)

- [Kubernetes](https://kubernetes.io/docs/setup/) - I just enabled it in the Docker for Windows application (Settings -> Kubernetes -> Enable Kubernetes -> Apply & Restart)

- [Skaffold](https://skaffold.dev/docs/install/) - This required me to install Chocolately as I was using Windows for dev

- [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#docker-for-mac)

### How to run

At the root of this project run the following command, provided you have installed all of the relevant requirements and have the Docker daemon & Kubernetes running in the background

`$ skaffold dev`
