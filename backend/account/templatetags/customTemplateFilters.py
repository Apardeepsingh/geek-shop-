from django import template

register = template.Library()

@register.filter
def add_prices(price1, price2):
    return int(price1) + int(price2)



@register.filter
def calculate_total_price(order_items):
    total_price = 0
    for item in order_items:
        try:
            total_price += (int(item["product"].get("price")) + int(item["size_variant"].get("price")))*int(item["quantity"])
        except (ValueError, TypeError):
            print(ValueError)
            print(TypeError)
    return total_price


@register.filter
def single_item_subtotal(orderItem):
    totalPrice = (int(orderItem.product.price) + int(orderItem.size_variant.price)) * int(orderItem.quantity)
    return totalPrice

@register.filter
def calculate_refund_amount(orderItem):
    itemPrice = (int(orderItem.product.price) + int(orderItem.size_variant.price)) * int(orderItem.quantity)
    couponDiscount = int(orderItem.order.couponDicount) / orderItem.order.order_items.all().count()
    refunAmount = int(itemPrice-couponDiscount)

    return refunAmount