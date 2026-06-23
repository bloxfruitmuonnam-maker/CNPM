const mongoose = require('mongoose');

const SharedListSchema = new mongoose.Schema({
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    memberEmail:String,
    foods:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Food'
    }]
});

module.exports = mongoose.model('SharedList', SharedListSchema);
