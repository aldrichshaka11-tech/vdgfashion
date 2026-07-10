from authentication.views import send_resend_email

def format_currency(amount):
    try:
        return f"₹{float(amount):,.2f}"
    except (ValueError, TypeError):
        return f"₹{amount}"

def generate_order_receipt_html(order):
    items_html = ""
    for item in order.items.all():
        size_color = []
        if item.selected_color:
            size_color.append(f"Color: {item.selected_color}")
        if item.selected_size:
            size_color.append(f"Size: {item.selected_size}")
        details = " | ".join(size_color)
        details_html = f"<div style='color: #666; font-size: 12px;'>{details}</div>" if details else ""
        
        items_html += f"""
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">
                <strong>{item.quantity}x {item.product_name}</strong>
                {details_html}
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
                {format_currency(item.price)}
            </td>
        </tr>
        """
        
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Order Received!</h2>
        <p>Hi {order.customer_name},</p>
        <p>Thank you for shopping with VDG Fashion! We have successfully received your order <strong>#{order.order_id}</strong>.</p>
        
        <h3 style="border-bottom: 2px solid #eee; padding-bottom: 8px; margin-top: 30px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tbody>
                {items_html}
            </tbody>
            <tfoot>
                <tr>
                    <td style="padding: 12px; text-align: right;"><strong>Subtotal:</strong></td>
                    <td style="padding: 12px; text-align: right;">{format_currency(order.subtotal)}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; text-align: right;">Shipping:</td>
                    <td style="padding: 12px; text-align: right;">{format_currency(order.shipping_fee)}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; text-align: right;"><strong>Total:</strong></td>
                    <td style="padding: 12px; text-align: right;"><strong>{format_currency(order.total_amount)}</strong></td>
                </tr>
            </tfoot>
        </table>
        
        <h3 style="border-bottom: 2px solid #eee; padding-bottom: 8px;">Shipping Details</h3>
        <p style="color: #555; line-height: 1.5;">
            {order.customer_name}<br>
            {order.street_address}<br>
            {order.city}, {order.state} - {order.pin_code}<br>
            Phone: {order.phone}
        </p>
        
        <p style="margin-top: 30px; font-size: 14px; color: #777; text-align: center;">
            You will receive another email when your order status is updated. If you have any questions, please contact our support.
        </p>
    </div>
    """
    return html

def generate_order_status_html(order):
    status_display = order.status.replace('_', ' ').title() if order.status else 'Updated'
    
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Order Status Update</h2>
        <p>Hi {order.customer_name},</p>
        <p>There is an update regarding your VDG Fashion order <strong>#{order.order_id}</strong>.</p>
        
        <div style="background-color: #f8f9fa; border-left: 4px solid #6366f1; padding: 15px; margin: 25px 0;">
            <p style="margin: 0; font-size: 16px;">
                Your new order status is: <strong>{status_display}</strong>
            </p>
        </div>
        
        <p>You can check your account dashboard for more details.</p>
        
        <p style="margin-top: 30px; font-size: 14px; color: #777; text-align: center;">
            Thank you for shopping with VDG Fashion!
        </p>
    </div>
    """
    return html

def send_order_email(order, template_type):
    """
    Sends an order email to the user.
    template_type: 'receipt' | 'status_update'
    """
    if not order.email:
        print(f"[EMAIL] Skipping {template_type} email for order {order.order_id} because customer email is empty.")
        return False
        
    subject = ""
    html_content = ""
    
    if template_type == 'receipt':
        subject = f"VDG Fashion - Order Confirmation #{order.order_id}"
        html_content = generate_order_receipt_html(order)
    elif template_type == 'status_update':
        status_display = order.status.replace('_', ' ').title() if order.status else 'Updated'
        subject = f"VDG Fashion - Order #{order.order_id} is now {status_display}"
        html_content = generate_order_status_html(order)
    else:
        print(f"[EMAIL] Unknown template type: {template_type}")
        return False
        
    print(f"[EMAIL] Sending {template_type} email for order {order.order_id} to {order.email}...")
    
    try:
        # Re-use the existing resend email function!
        return send_resend_email(subject, html_content, order.email)
    except Exception as e:
        print(f"[EMAIL] Failed to send {template_type} email: {e}")
        return False
