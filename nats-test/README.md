### Port forwarding notes

In our nats-test folder, we need to set up some port forwarding for testing purposes.

```bash
kubectl get pods
kubectl port-forward <pod name> <local port>:<pod port>
```

### Monitoring

```bash
kubectl get pods
kubectl port-forward <pod name> 8222:8222
```

navigate to `http://localhost:8222/streaming`
http://localhost:8222/streaming/channelsz?subs=1 - channel subscription info

### Healthchecks

Can tune the heartbeat arguments

```
    spec:
      containers:
        - name: nats
          image: nats-streaming:0.17.0
          args: [
            ...
              '-hbi', # Interval at which server sends heartbeat to a client
              '5s',
              '-hbt', # How long server waits for a heartbeat response
              '5s',
              '-hbf', # Number of failed heartbeats before server closes the client connection
            ...
            ]
```

Handle shutdown gracefully

```javascript
stan.on('close', () => {
  console.log('NATS connection closed.');
  process.exit();
});
// Gracefully handle shutdown by closing the client
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
```

### Avoding concurrency issues

Transactions Service -> Transactions DB

Our Transactions Service is responsible for processing transactions, storing them in the Transactions DB and emitting an event per action.

```json
{
  "UserId": "ABC",
  "Transactions": [
    { "action": "DEPOSIT", "amount": 70, "ID": "qwe" },
    { "action": "DEPOSIT", "amount": 40, "ID": "rty" },
    { "action": "WITHDRAW", "amount": 100, "ID": "uio" }
  ]
}
```

Emitted events should contain a sequence number amongst the other relevant information

```json
[
  {
    "user_id": "ABC",
    "event_type": "transaction:created",
    "action": "DEPOSIT",
    "amount": 70,
    "ID": "qwe",
    "seq_num": 1
  },
  {
    "user_id": "ABC",
    "event_type": "transaction:created",
    "action": "DEPOSIT",
    "amount": 40,
    "ID": "rty",
    "seq_num": 2
  },
  {
    "user_id": "ABC",
    "event_type": "transaction:created",
    "action": "WITHDRAW",
    "amount": 100,
    "ID": "uio",
    "seq_num": 3
  }
]
```

transaction:created topic -> Accounts Service (Listener A)

transaction:created topic -> Accounts Service (Listener B)

**_In a separate service, the Accounts Service, we care about these transaction events. If we have for example 2 listeners on the topic (A & B) we can prevent any concurrency issues by only processing an event if the seq_num = last_seq_num -1 - this gives us per-resource total order_**

_Accounts DB_
| user_id | balance | last_seq_num
| ----------- | ----------- | ----------- |
| abc | 70 | 1
| xyz | |
| qwerty | |

| user_id | balance | last_seq_num |
| ------- | ------- | ------------ |
| abc     | 110     | 2            |
| xyz     |         |
| qwerty  |         |

| user_id | balance | last_seq_num |
| ------- | ------- | ------------ |
| abc     | 10      | 3            |
| xyz     |         |
| qwerty  |         |

### Durable subscriptions

```javascript
.setDeliverAllAvailable() // replay from first available message
.setDurableName('orders-service'); // replay from the last ack'ed message in the subscription
```

in conjunction with a queue group

```javascript
const sub = stan.subscribe(
  'ticket:created',
  'orders-service-queue-group', // Don't dump the durable subscription even if our service goes offline for a short period
  options
);
```
