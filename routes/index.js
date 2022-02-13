const e = require('express');
var express = require('express');
var router = express.Router();

const session = require('express-session');
const bcrypt = require('bcrypt');



////////////////////////////////////////////////////
const { ObjectId } = require('mongodb');

const db = require('../Connection/Connection')
    /////////////////////////////////////////////////////////
    /* GET home page. */

let values = {

}
const verification = (req, res, next) => {
    console.log("user verif", values);
    values.signed ? next() : res.json({ message: "section time out" })

}


router.post('/login', async function(req, res, next) {
    console.log(req.body);
    console.log("reg", req.session)
    req.session.signed = req.body
        // console.log("req", req.session.signed);
    values = req.session.signed
    console.log("final", values);


    const result = await db.get().collection('login').findOne({ email: req.body.email })


    if (result === null) {
        res.json({ message: 'No user found' });
    } else {
        const pword = await db.get().collection('login').findOne({ password: req.body.password })

        if (pword === null) {
            res.json({ message: 'password or email incorrect' });

        } else {

            // res.json({ message: 'Login sucessfully' });
            const typee = await db.get().collection('login').findOne({ email: req.body.email })

            console.log("finall", values);
            values.signed = true


            // console.log("typeec", typee)
            res.json(typee)


        }


    }
});


router.post('/take_membership', async function(req, res, next) {
    console.log("fffff", req.body)

    const result = await db.get().collection('users').findOne({ email: req.body.email } && { dob: req.body.dob })
    const resultt = await db.get().collection('membership_request').findOne({ email: req.body.email } && { dob: req.body.dob })
    console.log("result", result);
    console.log("result2", resultt);

    if (result === null && resultt === null) {
        db.get().collection('membership_request').insertOne(req.body)
        res.json({ message: 'sent request to membership' });

    } else {
        res.json({ message: 'Already request to membership' });
    }

});


router.post('/create_account', function(req, res, next) {
    console.log("fffff", req.body)
    if (req.body.password !== req.body.confirmpassword) {

        res.json({ message: 'password does not match' });
    } else {
        db.get().collection('login').insertOne(req.body)
        res.json({ message: 'create account sucessfully' });
    }

});



router.post('/add_books', verification, async function(req, res, next) {;
    console.log("nnn");
    console.log("fffff", req.body)
    const { bookname, author, edition, language, category, stock } = req.body.bookdetails

    const result = await db.get().collection('book_details').find({ bookname: bookname, author: author, edition: edition, language: language }).toArray()
    console.log("result", result);
    // console.log("bookname", req.body.bookname);


    if (result.length === 0) {
        await db.get().collection('book_details').insertOne({ bookname: bookname, author: author, image: req.body.url, edition: edition, language: language, category: category, actualstock: stock, currentstock: stock, arrangement: 'pending' })
        res.json({ message: 'insert sucessfully' });

    } else {
        // console.log("stock", result.stock);

        await db.get().collection('book_details').updateMany({ bookname: bookname, author: author, edition: edition, language: language }, { $set: { actualstock: parseInt(result.actualstock) + parseInt(stock) } })

        res.json({ message: 'Already exists' });
    }


});


router.get('/viewbookdetails', async function(req, res, next) {
    const data = await db.get().collection('book_details').find().toArray()
        // console.log("dataaaa", data)

    res.json(data);


});

router.get('/viewrequest', async function(req, res, next) {
    console.log("haiiii")
    const data = await db.get().collection('membership_request').find({ type: "subadmin" }).toArray()
    console.log("dataaaa", data)

    res.json(data);


});

router.post('/acceptreq', async function(req, res, next) {
    console.log("iddd", req.body);
    const result = await db.get().collection('membership_request').find({ _id: ObjectId(req.body.id), status: "Accepted" }).toArray()


    if (result.length !== 0) {
        console.log(result);
        res.json({ message: 'Already accepted' });

    } else {
        console.log(result);
        await db.get().collection('membership_request').updateOne({ _id: ObjectId(req.body.id) }, { $set: { status: "Accepted" } })
        res.json({ message: 'request accepted' });
    }


});


router.get('/userrequest', async function(req, res, next) {
    console.log("haiiii")
    const data = await db.get().collection('membership_request').find({ type: "user" }).toArray()
    console.log("dataaaa", data)

    res.json(data);


});


router.post('/subacceptreq', async function(req, res, next) {
    console.log("iddd", req.body);
    const result = await db.get().collection('membership_request').find({ _id: ObjectId(req.body.id), status: "Accepted" }).toArray()


    if (result.length !== 0) {
        console.log(result);
        res.json({ message: 'Already accepted' });

    } else {
        console.log(result);
        await db.get().collection('membership_request').updateOne({ _id: ObjectId(req.body.id) }, { $set: { status: "Accepted" } })
        res.json({ message: 'request accepted' });
    }


});

router.get('/arrange', async function(req, res, next) {
    const data = await db.get().collection('book_details').find().toArray()
    console.log("dataaaa", data)

    res.json(data);


});

router.post('/arrangebook"', async function(req, res, next) {
    console.log("iddd", req.body);
    const result = await db.get().collection('book_details').find({ _id: ObjectId(req.body.id), status: "Accepted" }).toArray()


    if (result.length !== 0) {
        console.log(result);
        res.json({ message: 'Already accepted' });

    } else {
        console.log(result);
        await db.get().collection('membership_request').updateOne({ _id: ObjectId(req.body.id) }, { $set: { status: "Accepted" } })
        res.json({ message: 'request accepted' });
    }


});

//////////////////issue
router.post('/book_arrangement', async function(req, res, next) {
    console.log("rrr", req.body);
    const result = await db.get().collection('book_arrangment').find({ bookid: ObjectId(req.body.id) }).toArray()
    console.log("result", result);
    if (result.length === null) {

        await db.get().collection('book_arrangment').insertOne({ bookid: ObjectId(req.body.id), arrangedbook: req.body.stock, referanceid: req.body.bookarrange.referanceid, shelfno: req.body.bookarrange.shelfno })
        await db.get().collection('book_details').updateOne({ _id: ObjectId(req.body.id) }, { $set: { arrangement: "arranged" } })
        res.json({ message: 'arranged' });


    } else {
        await db.get().collection('book_arrangment').updateOne({ _id: ObjectId(req.body.id) }, { $set: { arrangedbook: parseInt(result.arrangedbook) + parseInt(req.body.arrangedbook) } })

        res.json({ message: 'arranged once again' });
    }


});





router.get('/searchbooks', async function(req, res, next) {
    // const data = await db.get().collection('book_details').find().toArray()
    // const result = await db.get().collection('book_arrangment').find().toArray()

    const result = await db.get().collection('book_arrangment').aggregate([{
        $lookup: {
            from: 'book_details',
            localField: 'bookid',
            foreignField: '_id',

            as: 'bookdetails'
        }
    }, {

        $project: {
            _id: 0,
            bookid: 0,
            referanceid: 0,
            arrangedbook: 0,
            // shelfno: 1,
            // bookdetails: 1
        }

    }]).toArray()



    console.log("dataaaa", result)

    res.json(result);


});



router.post('/searchbook', async function(req, res, next) {
    console.log("book", req.body)
    const data = await db.get().collection('book_details').find({ bookname: req.body.book }).toArray()
    console.log("dataaaa", data)
    console.log("iddd", data[0]._id)


    const result = await db.get().collection('book_arrangment').aggregate([{ $match: { bookid: data[0]._id } }, {
        $lookup: {
            from: 'book_details',
            localField: 'bookid',
            foreignField: '_id',

            as: 'bookdetails'
        }
    }, {

        $project: {
            _id: 0,
            bookid: 0,
            referanceid: 0,
            arrangedbook: 0,
            // shelfno: 1,
            // bookdetails: 1
        }

    }]).toArray()


    res.json(result);


});


router.post('/bookdistribution', async function(req, res, next) {
    console.log("req", req.body)
    const { name, email, dob } = req.body.details

    const data = await db.get().collection('membership_request').find({ name: name, email: email, dob: dob, status: "Accepted", type: 'user' }).toArray()
    console.log("length", data.length);
    if (data.length === 0) {

        res.json({ message: "please take membership or details incorrect" })
    } else {

        const result = await db.get().collection('book_arrangment').aggregate([{ $match: { bookid: ObjectId(req.body.id) } }, {
            $lookup: {
                from: 'book_details',
                localField: 'bookid',
                foreignField: '_id',

                as: 'bookdetails'
            }
        }, {

            $project: {
                _id: 0,
                bookid: 0,
                referanceid: 0,
                arrangedbook: 0,
                // shelfno: 1,
                // bookdetails: 1
            }

        }]).toArray()


        res.json({ result: result, message: "Take Book After Inform Librarian" })
    }

    // res.json(data);


});


router.post('/update_books', async function(req, res, next) {
    console.log("updattt", req.body);
    const { bookname, image, author, edition, language, category, stock } = req.body.bookdetails
    const result = await db.get().collection('book_details').find({ bookname: bookname, author: author, edition: edition, language: language }).toArray()
    console.log("result", result);
    // console.log("bookname", req.body.bookname);


    if (result.length === 0) {
        if (req.body.url === '') {
            await db.get().collection('book_details').updateOne({ _id: ObjectId(req.body.id) }, {
                $set: {
                    bookname: bookname,
                    author: author,
                    image: image,
                    edition: edition,
                    language: language,
                    category: category,
                    actualstock: stock,
                    currentstock: stock,
                    arrangement: 'pending'
                }
            })

        } else {
            await db.get().collection('book_details').updateOne({ _id: ObjectId(req.body.id) }, { $set: { bookname: bookname, author: author, image: req.body.url, edition: edition, language: language, category: category, actualstock: stock, currentstock: stock, arrangement: 'pending' } })

        }

        res.json({ message: 'Update sucessfully' });

    } else {

        res.json({ message: 'Already exists' });
    }


});

router.post('/deletebook', async function(req, res, next) {
    console.log("delet", req.body.id);
    await db.get().collection('book_details').deleteOne({ _id: ObjectId(req.body.id) })
    await db.get().collection('book_arrangment').deleteOne({ bookid: ObjectId(req.body.id) })


    res.json({ message: "Delete sucessfully" });


});

router.post('/postfeedback', async function(req, res, next) {
    console.log("reqq", req.body);
    let date_ob = new Date();
    console.log("date", date_ob);
    await db.get().collection('feedback').insertOne({ date: date_ob, feedback: req.body, type: "user" })


    res.json({ message: "post feedback sucessfully" });


});
router.post('/subadminfeedback', async function(req, res, next) {
    console.log("reqq", req.body);
    let date_ob = new Date();
    console.log("date", date_ob);
    await db.get().collection('feedback').insertOne({ date: date_ob, feedback: req.body, type: "subadmin" })


    res.json({ message: "post feedback sucessfully" });


});
router.get('/userfeedbacks', async function(req, res, next) {
    const data = await db.get().collection('feedback').find().toArray()
    console.log("dataaaa", data)

    res.json(data);


});
// router.get('/postfeedback', async function(req, res, next) {
//     const data = await db.get().collection('book_details').find().toArray()
//     console.log("dataaaa", data)

//     res.json(data);


// });





module.exports = router;