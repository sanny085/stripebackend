const cors = require('cors');
const express = require('express');

// created a stripe Roll Api Key
const stripe = require('stripe')('sk_test_51J4QieSFWEOClMCafXUZWxQUDN62k03hT6tbf3fOkxoS7ss91aWOLtpAuNCuekzu8tiBzNKdjL53lzKTlBfyhBQv00bBALkA8s');
const uuid = require('uuid').v4;

var app = express();
  
//middleware
app.use(express.json());
app.use(cors());


//routes
app.get('/', (req, res, next) => {
    res.send('This is our stripeBackend')
});


//http://localhost:8000/Payment
app.post('/Payment', (req, res) => {

    const {product, token} = req.body;
    console.log('PRODUCT : ', product);
    console.log('TOKEN : ',token)
    console.log('PRODUCT PRICE : ', product.price);

    const idempotencyKey = uuid();
    
    return stripe.customers.create({
            email : token.email,
            source : token.id,
        })
        .then(customer => { 
                stripe.charges.create({ 
                    amount : product.price * 100,
                    currency : 'usd',
                    customer : customer.id,
                    receipt_email : token.email,
                    description : `Your have purchased ${product.name}`,
                    shipping : {
                        name : token.card.name,   // stripe provides a card element
                        address : {
                            country : token.card.address_country
                        }
                    }
                }, 
                {idempotencyKey})
        })
        .then(result => {
            console.log('res',res.status)
             res.status(200).json(result)
        
            })
        .catch(err => console.log('Error : ',err))

});
    


//listen
app.listen(8000, () => {
    console.log('Listening at port 8000')
});