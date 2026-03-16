const company={

name:"CITY CHOICE BAKERS",

address:"Gulmarg Road Magam (Branch Kunzer)",

phone:"7006592704,9622578770",

email:"citychoicebakers@gmail.com",

logo:"https://i.ibb.co/bM0rp66d/20260222-002732.png"

}

let items=[{name:"",qty:1,price:0}]

let customer={name:"",phone:"",address:""}

let paidAmount=0
let total=0
let balance=0


function render(){

let rows=""

items.forEach((i,index)=>{

rows+=`

<div class="item-row">

<input value="${i.name}" placeholder="Item"
oninput="items[${index}].name=this.value">

<input type="number" value="${i.qty}"
oninput="items[${index}].qty=this.value">

<input type="number" value="${i.price}" placeholder="Rate"
oninput="items[${index}].price=this.value">

</div>

`

})

document.getElementById("app").innerHTML=`

<div class="header">${company.name}</div>

<div class="card">

<input placeholder="Customer Name"
oninput="customer.name=this.value">

<input type="tel"
inputmode="numeric"
pattern="[0-9]*"
placeholder="Customer Phone"
oninput="customer.phone=this.value">

<input placeholder="Customer Address"
oninput="customer.address=this.value">

</div>

<div class="card">

${rows}

<button class="btn-add" onclick="addItem()">Add Item</button>

</div>

<div class="card">

<input id="paid" type="number" placeholder="Paid Amount">

<button class="btn-preview" onclick="previewInvoice()">Preview Invoice</button>

<button class="btn-download" onclick="downloadInvoice()">Download PDF</button>

<button class="btn-whatsapp" onclick="sendWhatsapp()">Send WhatsApp</button>

</div>

`

}

function addItem(){

items.push({name:"",qty:1,price:0})

render()

}

function calculate(){

paidAmount=document.getElementById("paid")?.value || 0

total=0

items.forEach(i=>{

total+=i.qty*i.price

})

balance=total-paidAmount

}


function previewInvoice(){

calculate()

alert(
"Grand Total: Rs "+total+
"\nPaid: Rs "+paidAmount+
"\nDue Balance: Rs "+balance
)

}


async function downloadInvoice(){

calculate()

const {jsPDF}=window.jspdf

const doc=new jsPDF()

const logo=await loadImage(company.logo)

doc.addImage(logo,"PNG",15,10,30,30)

doc.setFontSize(22)
doc.setTextColor(165,0,0)
doc.text(company.name,50,20)

doc.setFontSize(10)
doc.setTextColor(80)

doc.text(company.address,50,27)
doc.text("Mob: "+company.phone,50,32)
doc.text(company.email,50,37)

doc.line(15,45,195,45)

doc.setTextColor(0)

doc.setFontSize(12)
doc.text("BILL TO:",15,55)

doc.setFontSize(11)
doc.text(customer.name,15,62)
doc.text("Contact: "+customer.phone,15,68)
doc.text(customer.address,15,74)

let date=new Date().toISOString().split("T")[0]

doc.text("Date: "+date,150,62)
doc.text("Inv #: NEW",150,68)

let table=items.map(i=>[
date,
i.name,
i.qty,
"Rs. "+i.price,
"Rs. "+(i.qty*i.price)
])

doc.autoTable({

startY:85,

head:[["Date","Item Description","Qty","Unit Price","Total"]],

body:table,

headStyles:{fillColor:[165,0,0]}

})

let y=doc.lastAutoTable.finalY+10

doc.text("Subtotal:",140,y)
doc.text("Rs. "+total,195,y,{align:"right"})

doc.setTextColor(46,125,50)
doc.text("Paid Amount:",140,y+8)
doc.text("Rs. "+paidAmount,195,y+8,{align:"right"})

doc.setFillColor(165,0,0)
doc.rect(135,y+12,65,10,"F")

doc.setTextColor(255)
doc.text("Balance Due:",140,y+19)
doc.text("Rs. "+balance,195,y+19,{align:"right"})

doc.setTextColor(150)
doc.text("Thank you for your business!",105,y+40,{align:"center"})

doc.save(customer.name+"_invoice.pdf")

}


function sendWhatsapp(){

calculate()

let msg=""

msg+="CITY CHOICE BAKERS\n"
msg+="Gulmarg Road Magam (Branch Kunzer)\n"
msg+="Mob: 7006592704,9622578770\n"
msg+="citychoicebakers@gmail.com\n\n"

msg+="Customer Details\n"
msg+="Name: "+customer.name+"\n"
msg+="Phone: "+customer.phone+"\n"
msg+="Address: "+customer.address+"\n\n"

msg+="Items\n"

items.forEach(i=>{

msg+=
i.name+
" | Qty:"+i.qty+
" | Price:"+i.price+
" | Total:"+(i.qty*i.price)
+"\n"

})

msg+="\nSubtotal: Rs "+total+"\n"
msg+="Paid: Rs "+paidAmount+"\n"
msg+="Pending Balance: Rs "+balance+"\n\n"

msg+="Thank you for your business!"

let url="https://wa.me/"+customer.phone+"?text="+encodeURIComponent(msg)

window.open(url)

}


function loadImage(url){

return new Promise(resolve=>{

const img=new Image()

img.crossOrigin="Anonymous"

img.onload=function(){

const canvas=document.createElement("canvas")

canvas.width=img.width
canvas.height=img.height

const ctx=canvas.getContext("2d")

ctx.drawImage(img,0,0)

resolve(canvas.toDataURL("image/png"))

}

img.src=url

})

}

render()
