const orders = []
const messages = []

export function createOrder(order) {
  orders.unshift(order)
  return order
}

export function getOrderById(id) {
  return orders.find((item) => item.id === id)
}

export function createMessage(message) {
  messages.unshift(message)
  return message
}
