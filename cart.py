# cart.py
# Shopping Cart implemented using Singly Linked List

class CartItem:
    def __init__(self, pid, name, price, quantity):
        self.pid = pid
        self.name = name
        self.price = price
        self.quantity = quantity
        self.next = None


class ShoppingCart:
    def __init__(self):
        self.head = None

    # Insert operation (Add item)
    def add_item(self, pid, name, price, quantity):
        new_item = CartItem(pid, name, price, quantity)

        # If cart is empty
        if self.head is None:
            self.head = new_item
            return

        # Insert at end
        temp = self.head
        while temp.next is not None:
            temp = temp.next
        temp.next = new_item

    # Delete operation (Remove item by product ID)
    def remove_item(self, pid):
        temp = self.head
        prev = None

        while temp is not None:
            if temp.pid == pid:
                if prev is None:
                    self.head = temp.next
                else:
                    prev.next = temp.next
                return
            prev = temp
            temp = temp.next

    # Update operation (Change quantity)
    def update_quantity(self, pid, quantity):
        temp = self.head
        while temp is not None:
            if temp.pid == pid:
                temp.quantity = quantity
                return
            temp = temp.next

    # Traverse and get all items
    def get_items(self):
        items = []
        temp = self.head

        while temp is not None:
            items.append({
                "pid": temp.pid,
                "name": temp.name,
                "price": temp.price,
                "quantity": temp.quantity,
                "subtotal": temp.price * temp.quantity
            })
            temp = temp.next

        return items

    # Traverse and calculate total
    def calculate_total(self):
        total = 0
        temp = self.head

        while temp is not None:
            total += temp.price * temp.quantity
            temp = temp.next

        return total
