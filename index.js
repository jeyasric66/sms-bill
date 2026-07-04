function sendToWhatsApp() {
    const name = document.getElementById('customerName').value || 'Customer';
    const phone = document.getElementById('customerPhone').value;
    
    if (!name) {
        alert('Customer பேர் போடுங்க');
        return;
    }

    let items = document.querySelectorAll('#itemsTable tbody tr');
    let itemList = '';
    let subTotal = 0;

    items.forEach((row, index) => {
        const itemName = row.querySelector('.item-name').value;
        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
        const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
        const total = qty * rate;
        
        if(itemName && qty > 0) {
            itemList += `${index + 1}. ${itemName}\n   ${qty} x ₹${rate} = ₹${total.toFixed(2)}\n`;
            subTotal += total;
        }
    });

    if (!itemList) {
        alert('குறைந்தது 1 Item சேர்க்கணும்');
        return;
    }

    const advance = parseFloat(document.getElementById('advance').value) || 0;
    const grandTotal = subTotal - advance;
    const date = new Date().toLocaleDateString('en-IN');

    const message = `*S.M.S Bill - Order Confirmation* 🧾\n\n*Date:* ${date}\n*Customer:* ${name}\n\n*Order Details:*\n${itemList}\n*Sub Total:* ₹${subTotal.toFixed(2)}\n*Advance:* ₹${advance.toFixed(2)}\n*Balance:* ₹${grandTotal.toFixed(2)}\n\nOrder க்கு நன்றி! 🙏\nS.M.S`;

    const encodedMsg = encodeURIComponent(message);
    
    // Phone number இருந்தா Direct அனுப்பும், இல்லனா Contact Select பண்ண சொல்லும்
    const waLink = phone ? `https://wa.me/91${phone}?text=${encodedMsg}` : `https://wa.me/?text=${encodedMsg}`;
    
    // Mobile க்கு இது Better
    window.location.href = waLink;
}
